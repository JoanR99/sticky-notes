const { Router } = require('express');
const {
	getNotes,
	createNote,
	getNote,
	deleteNote,
	updateNote,
} = require('../controllers/notes.controllers');
const verifyJWT = require('../middlewares/verifyJWT');
const asyncHandler = require('../middlewares/asyncHandler');
const {
	validateCreateNoteFields,
} = require('../middlewares/validation.middlewares');
const router = Router();

router
	.route('/')
	.get(verifyJWT, asyncHandler(getNotes))
	.post(verifyJWT, validateCreateNoteFields, asyncHandler(createNote));

router
	.route('/:id')
	.get(verifyJWT, asyncHandler(getNote))
	.delete(verifyJWT, asyncHandler(deleteNote))
	.patch(verifyJWT, asyncHandler(updateNote));

module.exports = router;
