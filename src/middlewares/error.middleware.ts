import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	const errorMessage = err.messages ? err.messages : err.message;

	res.status(err.status).json({ errorMessage });
};

export default errorHandler;
