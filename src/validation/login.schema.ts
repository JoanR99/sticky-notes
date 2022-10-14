import { z } from 'zod';

const loginSchema = z
	.object({
		email: z
			.string({ required_error: 'validation.email.required' })
			.email('validation.email.invalid'),
		password: z.string({ required_error: 'validation.password.required' }),
	})
	.required();

export default loginSchema;
