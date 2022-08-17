import { Router } from 'express';

import {
	getColors,
	createColor,
	deleteColor,
} from '../controllers/colors.controller';
import { verifyJWT } from '../middlewares/verifyJWT';
import asyncHandler from '../middlewares/asyncHandler';

const router = Router();

router
	.route('/')
	.get(verifyJWT, asyncHandler(getColors))
	.post(verifyJWT, asyncHandler(createColor));

router.route('/:id').delete(verifyJWT, asyncHandler(deleteColor));

export default router;
