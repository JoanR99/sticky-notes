const asyncHandler = (callback) => async (req, res, next) => {
	try {
		await callback(req, res);
	} catch (e) {
		next(e);
	}
};

module.exports = asyncHandler;
