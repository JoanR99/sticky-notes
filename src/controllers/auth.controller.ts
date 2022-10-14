import { RequestHandler } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import * as authService from '../services/auth.services';

import * as userService from '../services/user.services';
import Unauthorized from '../errors/Unauthorized';

export const login: RequestHandler = async (req, res) => {
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

			await userService.updateRefreshToken(user.id, refreshToken);

			res
				.cookie('jwt', refreshToken, {
					httpOnly: true,
					sameSite: 'none',
					secure: true,
					maxAge: 24 * 60 * 60 * 1000,
				})
				.json({ accessToken });
		}
	}

	throw new Unauthorized(req.t('unauthorized'));
};

export const logout: RequestHandler = async (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) return res.sendStatus(204);

	const refreshToken = cookies.jwt;

	const user = await userService.findUserByRefreshToken(refreshToken);

	if (!user) {
		res.clearCookie('jwt', {
			httpOnly: true,
			sameSite: 'none',
			secure: true,
			maxAge: 24 * 60 * 60 * 1000,
		});
		return res.sendStatus(204);
	}

	await userService.updateRefreshToken(user.id, '');

	res.clearCookie('jwt', {
		httpOnly: true,
		sameSite: 'none',
		secure: true,
		maxAge: 24 * 60 * 60 * 1000,
	});

	return res.sendStatus(204);
};

export const refreshToken: RequestHandler = async (req, res) => {
	try {
		const cookies = req.cookies;

		if (!cookies?.jwt) return res.sendStatus(401);

		const refreshToken = cookies.jwt;

		const user = await userService.findUserByRefreshToken(refreshToken);

		if (!user) return res.sendStatus(403);

		const secretToken = process.env.REFRESH_TOKEN_SECRET!;

		const tokenPayload = await authService.validateToken(
			refreshToken,
			secretToken
		);

		const accessToken = authService.createAccessToken(tokenPayload.user.id);

		return res.json({ accessToken });
	} catch (e) {
		return res.sendStatus(403);
	}
};
