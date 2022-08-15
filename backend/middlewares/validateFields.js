const BadRequest = require('../errors/BadRequest');

const validateFields = (validationSchema) => (req, res, next) => {
	try {
		const result = validationSchema.safeParse(req.body);

		if (result.success) {
			return next();
		} else {
			const errorMessages = result.error.issues.map((error) => error.message);

			throw new BadRequest(errorMessages);
		}
	} catch (e) {
		return next(e);
	}
};

module.exports = validateFields;
