import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	const errorMessage = err.messages ? err.messages : err.message;
	const status = err.status || 500;

	console.log(errorMessage);

	res.status(status).json({ errorMessage });
};

export default errorHandler;
