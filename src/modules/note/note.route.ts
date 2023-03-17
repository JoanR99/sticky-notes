import { Router } from 'express';

import {
	getNotes,
	createNote,
	deleteNote,
	updateNote,
} from './note.controllers';
import { verifyJWT } from '../../middlewares/verifyJWT';
import asyncHandler from '../../middlewares/asyncHandler';
import {
	validateCreateNoteFields,
	validateUpdateNoteFields,
} from '../../middlewares/validation.middlewares';

const router = Router();

router
	.route('/')
	.get(verifyJWT, asyncHandler(getNotes))
	.post(verifyJWT, validateCreateNoteFields, asyncHandler(createNote));

router
	.route('/:id')
	.delete(verifyJWT, asyncHandler(deleteNote))
	.patch(verifyJWT, validateUpdateNoteFields, asyncHandler(updateNote));

export default router;
