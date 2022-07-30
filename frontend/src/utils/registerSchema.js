import { object, string } from 'zod';

export const registerSchema = object({
	username: string().nonempty('Username is required').max(20),
	email: string()
		.nonempty('Email address is required')
		.email('Email Address is invalid'),
	password: string()
		.nonempty('Password is required')
		.min(8, 'Password must be more than 8 characters')
		.max(32, 'Password must be less than 32 characters'),
	passwordConfirm: string().nonempty('Please confirm your password'),
}).refine((data) => data.password === data.passwordConfirm, {
	path: ['passwordConfirm'],
	message: 'Password do not match',
});

export const defaultValues = {
	username: '',
	email: '',
	password: '',
	passwordConfirm: '',
};
