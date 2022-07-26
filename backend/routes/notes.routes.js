const { Router } = require('express');
const router = Router();
const {
	getNotes,
	createNote,
	getNote,
	deleteNote,
	updateNote,
} = require('../controllers/notes.controllers');
const verifyJWT = require('../middlewares/verifyJWT');
const asyncHandler = require('../middlewares/asyncHandler');

router
	.route('/')
	.get(verifyJWT, asyncHandler(getNotes))
	.post(verifyJWT, asyncHandler(createNote));

router
	.route('/:id')
	.get(verifyJWT, asyncHandler(getNote))
	.delete(verifyJWT, asyncHandler(deleteNote))
	.patch(verifyJWT, asyncHandler(updateNote));

module.exports = router;
