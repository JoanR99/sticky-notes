import { Router } from 'express';

import { createUser, login, logout, refreshToken } from './user.controller';
import asyncHandler from '../../middlewares/asyncHandler';
import {
	validateLoginFields,
	validateRegisterFields,
} from '../../middlewares/validation.middlewares';

const router = Router();

router.route('/').post(validateRegisterFields, asyncHandler(createUser));
router.route('/login').post(validateLoginFields, asyncHandler(login));
router.route('/logout').post(asyncHandler(logout));
router.route('/refresh').get(refreshToken);

export default router;
