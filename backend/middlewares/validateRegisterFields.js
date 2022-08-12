const registerSchema = require('../validation/register.schema');
const BadRequest = require('../errors/BadRequest');

const validateRegisterFields = (req, res, next) => {
	try {
		const result = registerSchema.safeParse(req.body);

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

module.exports = validateRegisterFields;
