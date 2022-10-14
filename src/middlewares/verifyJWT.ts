import { RequestHandler, Request } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import * as authService from '../services/auth.services';

export interface CustomRequest extends Request {
	user: string;
}

export const verifyJWT: RequestHandler = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization || req.headers.Authorization;

		if (typeof authHeader === 'undefined' || Array.isArray(authHeader))
			return res.sendStatus(401);

		if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);

		const token = authHeader.split(' ')[1];

		const publicKey = process.env.ACCESS_TOKEN_SECRET!;

		const tokenPayload = await authService.validateToken(token, publicKey);

		(req as CustomRequest).user = tokenPayload.user.id.toString();

		return next();
	} catch (e) {
		return res.sendStatus(403);
	}
};
