import { Request, RequestHandler } from 'express';
import * as userService from './user.services';

import Unauthorized from '../../errors/Unauthorized';
import { CreateUserInput, UserLoginInput } from './user.schema';
import { verifyPasswordMatch } from '../../utils/hash';

export const createUser: RequestHandler = async (
	req: Request<{}, {}, CreateUserInput>,
	res
) => {
	await userService.createUser(req.body);

	res.status(201).json({ message: req.t('user.create') });
};

export const login: RequestHandler = async (
	req: Request<{}, {}, UserLoginInput>,
	res
) => {
	const { email, password } = req.body;

	const user = await userService.findByEmail(email);

	if (user && (await verifyPasswordMatch(password, user.password))) {
		const accessToken = userService.createAccessToken(user.id);
		const refreshToken = userService.createRefreshToken(user.id);

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

	throw new Unauthorized(req.t('unauthorized'));
};

export const logout: RequestHandler = async (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) return res.sendStatus(403);

	const refreshToken = cookies.jwt;

	const user = await userService.findByRefreshToken(refreshToken);

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

		if (!cookies?.jwt) return res.sendStatus(403);

		const refreshToken = cookies.jwt;

		const user = await userService.findByRefreshToken(refreshToken);

		if (!user) return res.sendStatus(403);

		const secretToken = process.env.REFRESH_TOKEN_SECRET!;

		const tokenPayload = await userService.validateToken(
			refreshToken,
			secretToken
		);

		const accessToken = userService.createAccessToken(tokenPayload.user.id);

		return res.json({ accessToken });
	} catch (e) {
		return res.sendStatus(403);
	}
};
