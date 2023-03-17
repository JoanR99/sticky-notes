import { z } from 'zod';
import { noteSchema } from '../note/note.schema';

export const userSchema = z.object({
	id: z.number(),
	username: z
		.string({
			required_error: 'Name is required',
			invalid_type_error: 'Name must be a string',
		})
		.min(2)
		.max(20),
	email: z
		.string({
			required_error: 'Email is required',
			invalid_type_error: 'Email must be a string',
		})
		.email(),
	password: z
		.string({ required_error: 'Password is required' })
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%])/,
			'Invalid Password'
		)
		.min(8)
		.max(24),
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
			required_error: 'Email is required',
			invalid_type_error: 'Email must be a string',
		})
		.email(),
	password: z.string({
		required_error: 'Email is required',
		invalid_type_error: 'Email must be a string',
	}),
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserLoginInput = z.infer<typeof loginSchema>;
