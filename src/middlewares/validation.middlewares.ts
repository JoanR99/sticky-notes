import validateFields from './validateFields';
import { createUserSchema, loginSchema } from '../modules/user/user.schema';
import {
	createNoteSchema,
	updateNoteSchema,
} from '../modules/note/note.schema';

export const validateRegisterFields = validateFields(createUserSchema);

export const validateLoginFields = validateFields(loginSchema);

export const validateCreateNoteFields = validateFields(createNoteSchema);

export const validateUpdateNoteFields = validateFields(updateNoteSchema);
