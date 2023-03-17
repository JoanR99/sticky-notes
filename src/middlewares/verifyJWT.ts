import { RequestHandler } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import NotFound from '../errors/NotFound';
import * as userService from '../modules/user/user.services';

declare global {
	namespace Express {
		interface Request {
			user: string;
		}
	}
}

export const verifyJWT: RequestHandler = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization || req.headers.Authorization;

		if (typeof authHeader === 'undefined' || Array.isArray(authHeader))
			return res.sendStatus(401);

		if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);

		const token = authHeader.split(' ')[1];

		const publicKey = process.env.ACCESS_TOKEN_SECRET!;

		const tokenPayload = await userService.validateToken(token, publicKey);

		const user = await userService.findById(Number(tokenPayload.user.id));

		if (!user) {
			throw new NotFound(req.t('user.not_found'));
		}

		req.user = tokenPayload.user.id.toString();

		return next();
	} catch (e) {
		return res.sendStatus(403);
	}
};
