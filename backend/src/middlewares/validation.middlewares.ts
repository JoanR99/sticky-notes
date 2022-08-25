import validateFields from './validateFields';
import registerSchema from '../validation/register.schema';
import loginSchema from '../validation/login.schema';
import createNoteSchema from '../validation/createNote.schema';
import createColorSchema from '../validation/createColor.schema';

export const validateRegisterFields = validateFields(registerSchema);

export const validateLoginFields = validateFields(loginSchema);

export const validateCreateNoteFields = validateFields(createNoteSchema);

export const validateCreateColorFields = validateFields(createColorSchema);
