import { z } from 'zod';

export const noteSchema = z.object({
	id: z.number(),
	title: z.string({
		required_error: 'Name is required',
		invalid_type_error: 'Name must be a string',
	}),
	content: z.string({
		required_error: 'Name is required',
		invalid_type_error: 'Name must be a string',
	}),
	isArchive: z.boolean().default(false),
	authorId: z.number(),
	color: z.enum([
		'red',
		'yellow',
		'orange',
		'blue',
		'teal',
		'green',
		'purple',
		'pink',
		'gray',
		'brown',
		'white',
	]),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const createNoteSchema = noteSchema.pick({
	title: true,
	content: true,
	color: true,
});

export const updateNoteSchema = noteSchema
	.pick({
		title: true,
		content: true,
		color: true,
		isArchive: true,
	})
	.partial();

const getNotesQuerySchema = noteSchema
	.pick({ color: true })
	.extend({ search: z.string(), isArchive: z.string() })
	.partial();

const getNotesResponseSchema = noteSchema.array();

export type Note = z.infer<typeof noteSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type GetNotesQuery = z.infer<typeof getNotesQuerySchema>;
export type GetNotesResponse = z.infer<typeof getNotesResponseSchema>;
