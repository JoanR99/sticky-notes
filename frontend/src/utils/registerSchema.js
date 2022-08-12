import { object, string } from 'zod';

const registerSchema = object({
	username: string({ required_error: 'Username is required' }).max(20),
	email: string({ required_error: 'Email is required' }).email(
		'Email Address is invalid'
	),
	password: string({ required_error: 'Password is required' })
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%])/,
			'Password must contain at least a lowercase letter, a uppercase letter, a number and a special character ( ! @ # $ % )'
		)
		.min(8, 'Password must be 8 or more characters')
		.max(24, 'Password must be less than 24 characters'),
	passwordConfirm: string({
		required_error: 'Password confirm is required',
	}),
}).refine((data) => data.password === data.passwordConfirm, {
	path: ['passwordConfirm'],
	message: 'Password do not match',
});

const defaultValues = {
	username: '',
	email: '',
	password: '',
	passwordConfirm: '',
};

export { registerSchema, defaultValues };
