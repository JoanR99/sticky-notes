import { Router } from 'express';

import { login, logout, refreshToken } from '../controllers/auth.controller';
import asyncHandler from '../middlewares/asyncHandler';
import { validateLoginFields } from '../middlewares/validation.middlewares';

const router = Router();

router.route('/login').post(validateLoginFields, asyncHandler(login));
router.route('/logout').get(asyncHandler(logout));
router.route('/refresh').get(refreshToken);

export default router;
