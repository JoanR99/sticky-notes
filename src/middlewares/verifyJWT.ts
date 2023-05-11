import { RequestHandler } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import NotFound from '../errors/NotFound';
import Unauthorized from '../errors/Unauthorized';
import * as userService from '../modules/user/user.services';

declare global {
	namespace Express {
		interface Request {
			user: string;
		}
	}
}

export const verifyJWT: RequestHandler = async (req, _res, next) => {
	try {
		const authHeader = req.headers.authorization || req.headers.Authorization;

		if (typeof authHeader === 'undefined' || Array.isArray(authHeader)) {
			throw new Unauthorized(req.t('unauthorized'));
		}

		if (!authHeader?.startsWith('Bearer ')) {
			throw new Unauthorized(req.t('unauthorized'));
		}

		const token = authHeader.split(' ')[1];

		const publicKey = process.env.ACCESS_TOKEN_SECRET!;

		let tokenPayload;

		try {
			tokenPayload = await userService.validateToken(token, publicKey);
		} catch (e) {
			throw new Unauthorized(req.t('unauthorized'));
		}

		const user = await userService.findById(Number(tokenPayload.user.id));

		if (!user) {
			throw new NotFound(req.t('user.not_found'));
		}

		req.user = tokenPayload.user.id.toString();

		return next();
	} catch (e) {
		return next(e);
	}
};
