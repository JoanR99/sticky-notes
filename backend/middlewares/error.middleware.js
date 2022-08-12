const errorHandler = (err, req, res, next) => {
	res.status(err.status).json({ errorMessage: err.message });
};

module.exports = errorHandler;
