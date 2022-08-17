import { Router } from 'express';

import { createUser } from '../controllers/user.controller';
import asyncHandler from '../middlewares/asyncHandler';
import { validateRegisterFields } from '../middlewares/validation.middlewares';

const router = Router();

router
	.route('/register')
	.post(validateRegisterFields, asyncHandler(createUser));

export default router;
