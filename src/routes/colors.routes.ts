import { Router } from 'express';

import {
	getColors,
	createColor,
	deleteColor,
} from '../controllers/colors.controller';
import { verifyJWT } from '../middlewares/verifyJWT';
import asyncHandler from '../middlewares/asyncHandler';
import { validateCreateColorFields } from '../middlewares/validation.middlewares';

const router = Router();

router
	.route('/')
	.get(verifyJWT, asyncHandler(getColors))
	.post(validateCreateColorFields, asyncHandler(createColor));

router.route('/:id').delete(verifyJWT, asyncHandler(deleteColor));

export default router;
