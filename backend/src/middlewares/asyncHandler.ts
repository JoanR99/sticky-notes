import { RequestHandler, Response, NextFunction } from 'express';
import { CustomRequest } from './verifyJWT';

type Callback = (req: CustomRequest, res: Response, nex: NextFunction) => void;

const asyncHandler =
	(callback: Callback): RequestHandler =>
	async (req, res, next) => {
		try {
			await callback(req as CustomRequest, res, next);
		} catch (e) {
			next(e);
		}
	};

export default asyncHandler;
