const { z } = require('zod');

const loginSchema = z
	.object({
		email: z
			.string({ required_error: 'Email is required' })
			.email('Not a valid email'),
		password: z.string({ required_error: 'Password is required' }),
	})
	.required();

module.exports = loginSchema;
