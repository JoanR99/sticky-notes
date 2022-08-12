const loginSchema = require('../validation/login.schema');
const BadRequest = require('../errors/BadRequest');

const validateLoginFields = (req, res, next) => {
	try {
		const result = loginSchema.safeParse(req.body);

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

module.exports = validateLoginFields;
