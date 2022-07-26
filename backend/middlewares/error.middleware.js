const errorHandler = (err, req, res, next) => {
	res.status(500).json({ errorMessage: err.message });
};

module.exports = errorHandler;
