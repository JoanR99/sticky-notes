const { z } = require('zod');

const createNoteSchema = z
	.object({
		title: z.string({
			required_error: 'Title is required',
			invalid_type_error: 'Title must be a string',
		}),
		content: z.string({
			required_error: 'Content is required',
			invalid_type_error: 'Content must be a string',
		}),
		color: z.number({
			required_error: 'Color is required',
			invalid_type_error: 'Color must be a number',
		}),
	})
	.required();

module.exports = createNoteSchema;
