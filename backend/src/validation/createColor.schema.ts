import { z } from 'zod';

const createColorSchema = z
	.object({
		name: z.string({
			required_error: 'Name is required',
			invalid_type_error: 'Name must be a string',
		}),
		hex: z.string({
			required_error: 'Hex is required',
			invalid_type_error: 'Hex must be a string',
		}),
	})
	.required();

export default createColorSchema;
