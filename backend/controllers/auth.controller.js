const jwt = require('jsonwebtoken');
require('dotenv').config();
const authService = require('../services/auth.services');
const userService = require('../services/user.services');
const Unauthorized = require('../errors/Unauthorized');

const login = async (req, res) => {
	const { email, password } = req.body;

	const user = await userService.findUserByEmail(email);

	if (user) {
		const match = await authService.verifyPasswordsMatch(
			password,
			user.password
		);

		if (match) {
			const accessToken = authService.createAccessToken(user.id);
			const refreshToken = authService.createRefreshToken(user.id);

			user.refreshToken = refreshToken;
			await user.save();

			res
				.cookie('jwt', refreshToken, {
					httpOnly: true,
					sameSite: 'None',
					secure: true,
					maxAge: 24 * 60 * 60 * 1000,
				})
				.json({ accessToken });
		}
	}

	throw new Unauthorized('Wrong credentials');
};

const logout = async (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) return res.sendStatus(204);

	const refreshToken = cookies.jwt;

	const user = await userService.findUserByRefreshToken(refreshToken);

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

const refreshToken = async (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) return res.sendStatus(401);

	const refreshToken = cookies.jwt;

	const user = await userService.findUserByRefreshToken(refreshToken);

	if (!user) return res.sendStatus(403);

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
		if (err || user.id !== decoded.id) return res.sendStatus(403);

		const accessToken = authService.createAccessToken(decoded.id);

		res.json({ accessToken });
	});
};

module.exports = { login, logout, refreshToken };
