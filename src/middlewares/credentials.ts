import { RequestHandler } from 'express';

import allowedOrigins from '../config/allowedOrigins';

const credentials: RequestHandler = (req, res, next) => {
	const origin = req.headers.origin ?? '';
	if (allowedOrigins.includes(origin)) {
		res.header('Access-Control-Allow-Credentials', 'true');
	}
	next();
};

export default credentials;
