const { Router } = require('express');
const {
	createUser,
	login,
	logout,
	getUsers,
} = require('../controllers/user.controller');
const asyncHandler = require('../middlewares/asyncHandler');
const router = Router();

router.route('/').get(asyncHandler(getUsers));
router.route('/register').post(asyncHandler(createUser));
router.route('/login').post(asyncHandler(login));
router.route('/logout').get(asyncHandler(logout));

module.exports = router;
