import { z } from 'zod';

const registerSchema = z
	.object({
		username: z
			.string({ required_error: 'Username is required' })
			.min(2, 'Username must be 2 or more characters long')
			.max(20, 'Username must be 20 or fewer characters long'),
		email: z
			.string({ required_error: 'Email is required' })
			.email('Not a valid email'),
		password: z
			.string({ required_error: 'Password is required' })
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%])/,
				'Password must contain at least a lowercase letter, a uppercase letter, a number and a special character ( ! @ # $ % )'
			)
			.min(8, 'Password must be 8 or more characters')
			.max(24, 'Password must be 24 or fewer characters'),
	})
	.required();

export default registerSchema;
