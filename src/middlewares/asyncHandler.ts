import { RequestHandler } from 'express';

const asyncHandler =
	(callback: any): RequestHandler =>
	async (req, res, next) => {
		try {
			await callback(req, res, next);
		} catch (e) {
			next(e);
		}
	};

export default asyncHandler;
