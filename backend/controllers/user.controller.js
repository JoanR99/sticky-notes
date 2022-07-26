const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');

const createUser = async (req, res) => {
	const { username, email, password } = req.body;

	const hash = await bcrypt.hash(password, 10);
	const user = await User.create({ username, email, password: hash });

	res.status(201).json({ message: 'User created successfuly' });
};

const getUsers = async (req, res) => {
	const users = await User.findAll({ include: 'roles' });
	res.json(users);
};

const login = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ where: { email: email } });
	if (!user) throw new Error('User not found');
	const match = await bcrypt.compare(password, user.password);
	if (match) {
		const accessToken = jwt.sign(
			{
				userInfo: {
					email: user.email,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '1m' }
		);

		const refreshToken = jwt.sign(
			{ email: user.email },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);

		user.refreshToken = refreshToken;
		await user.save();

		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			sameSite: 'None',
			secure: true,
			maxAge: 24 * 60 * 60 * 1000,
		});
		res.json({ accessToken });
	} else {
		throw new Error('User not found');
	}
};

const logout = async (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) return res.sendStatus(204);

	const refreshToken = cookies.jwt;

	const user = await User.findOne({ where: { refreshToken: refreshToken } });

	if (!user) {
		res.clearCookie('jwt', {
			httpOnly: true,
			sameSite: 'None',
			secure: true,
			maxAge: 24 * 60 * 60 * 1000,
		});
		return res.sendStatus(204);
	}

	user.refreshToken = '';
	await user.save();

	res.clearCookie('jwt', {
		httpOnly: true,
		sameSite: 'None',
		secure: true,
		maxAge: 24 * 60 * 60 * 1000,
	});
	res.sendStatus(204);
};

module.exports = { createUser, getUsers, login, logout };
