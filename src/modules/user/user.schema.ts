import { z } from 'zod';
import { noteSchema } from '../note/note.schema';

export const userSchema = z.object({
	id: z.number(),
	username: z
		.string({
			required_error: 'validation.username.required',
			invalid_type_error: 'validation.username.type',
		})
		.min(2, 'validation.username.min')
		.max(20, 'validation.username.max'),
	email: z
		.string({
			required_error: 'validation.email.required',
			invalid_type_error: 'validation.email.type',
		})
		.email('validation.email.invalid'),
	password: z
		.string({
			required_error: 'validation.password.required',
			invalid_type_error: 'validation.password.type',
		})
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%])/,
			'validation.password.invalid'
		)
		.min(8, 'validation.password.min')
		.max(24, 'validation.password.max'),
	refreshToken: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	notes: z.array(noteSchema),
});

export const userResponseSchema = userSchema
	.pick({
		id: true,
		username: true,
		email: true,
	})
	.extend({
		createdAt: z.string(),
		updatedAt: z.string(),
	});

export const createUserSchema = userSchema.pick({
	username: true,
	email: true,
	password: true,
});

export const loginSchema = z.object({
	email: z
		.string({
			required_error: 'validation.email.required',
			invalid_type_error: 'validation.email.type',
		})
		.email('validation.email.invalid'),
	password: z.string({
		required_error: 'validation.password.required',
		invalid_type_error: 'validation.password.type',
	}),
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserLoginInput = z.infer<typeof loginSchema>;
