import { RequestHandler } from 'express';
import { ZodSchema } from 'zod';

import BadRequest from '../errors/BadRequest';

const validateFields =
	(validationSchema: ZodSchema): RequestHandler =>
	(req, _res, next) => {
		try {
			const result = validationSchema.safeParse(req.body);

			if (result.success) {
				return next();
			} else {
				const errorMessage = result.error.issues.map((error) =>
					req.t(error.message)
				);

				throw new BadRequest(errorMessage);
			}
		} catch (e) {
			return next(e);
		}
	};

export default validateFields;
