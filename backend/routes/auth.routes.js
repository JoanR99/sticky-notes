const { Router } = require('express');
const {
	login,
	logout,
	refreshToken,
} = require('../controllers/auth.controller');
const asyncHandler = require('../middlewares/asyncHandler');
const {
	validateLoginFields,
} = require('../middlewares/validation.middlewares');
const router = Router();

router.route('/login').post(validateLoginFields, asyncHandler(login));
router.route('/logout').get(asyncHandler(logout));
router.route('/refresh').get(refreshToken);

module.exports = router;
