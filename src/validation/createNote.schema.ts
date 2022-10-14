import { z } from 'zod';

const createNoteSchema = z
	.object({
		title: z.string({
			required_error: 'validation.title.required',
			invalid_type_error: 'validation.title.type',
		}),
		content: z.string({
			required_error: 'validation.content.required',
			invalid_type_error: 'validation.content.type',
		}),
		colorId: z.number({
			required_error: 'validation.color_id.required',
			invalid_type_error: 'validation.color_id.type',
		}),
	})
	.required();

export default createNoteSchema;
