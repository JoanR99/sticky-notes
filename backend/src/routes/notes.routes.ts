import { Router } from 'express';

import {
	getNotes,
	createNote,
	getNote,
	deleteNote,
	updateNote,
} from '../controllers/notes.controllers';
import { verifyJWT } from '../middlewares/verifyJWT';
import asyncHandler from '../middlewares/asyncHandler';
import { validateCreateNoteFields } from '../middlewares/validation.middlewares';

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

export default router;
