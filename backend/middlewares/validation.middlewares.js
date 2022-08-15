const validateFields = require('./validateFields');
const registerSchema = require('../validation/register.schema');
const loginSchema = require('../validation/login.schema');
const createNoteSchema = require('../validation/createNote.schema');

const validateRegisterFields = validateFields(registerSchema);
const validateLoginFields = validateFields(loginSchema);
const validateCreateNoteFields = validateFields(createNoteSchema);

module.exports = {
	validateRegisterFields,
	validateLoginFields,
	validateCreateNoteFields,
};
