const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');

module.exports.login = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ where: { email: email } });
	if (!user) throw new Error('User not found');
	const match = await bcrypt.compare(password, user.password);
	if (match) {
		const accessToken = jwt.sign(
			{
				user: {
					id: user.id,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '1m' }
		);

		const refreshToken = jwt.sign(
			{ id: user.id },
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

module.exports.logout = async (req, res) => {
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

module.exports.refreshToken = async (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) return res.sendStatus(401);

	const refreshToken = cookies.jwt;

	const user = await User.findOne({ where: { refreshToken: refreshToken } });

	if (!user) return res.sendStatus(403);

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		async (err, decoded) => {
			if (err || user.id !== decoded.id) return res.sendStatus(403);

			const accessToken = jwt.sign(
				{
					user: {
						id: decoded.id,
					},
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '1m' }
			);

			res.json({ accessToken });
		}
	);
};
