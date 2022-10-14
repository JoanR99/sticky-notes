import { z } from 'zod';

const registerSchema = z
	.object({
		username: z
			.string({ required_error: 'validation.username.required' })
			.min(2, 'validation.username.min')
			.max(20, 'validation.username.max'),
		email: z
			.string({ required_error: 'validation.email.required' })
			.email('validation.email.invalid'),
		password: z
			.string({ required_error: 'validation.password.required' })
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%])/,
				'validation.password.invalid'
			)
			.min(8, 'validation.password.min')
			.max(24, 'validation.password.max'),
	})
	.required();

export default registerSchema;
