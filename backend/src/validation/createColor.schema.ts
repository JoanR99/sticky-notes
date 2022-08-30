import { z } from 'zod';

const createColorSchema = z
	.object({
		name: z.string({
			required_error: 'validation.name.required',
			invalid_type_error: 'validation.name.type',
		}),
		hex: z.string({
			required_error: 'validation.hex.required',
			invalid_type_error: 'validation.hex.type',
		}),
	})
	.required();

export default createColorSchema;
