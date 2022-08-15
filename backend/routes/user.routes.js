const { Router } = require('express');
const { createUser } = require('../controllers/user.controller');
const asyncHandler = require('../middlewares/asyncHandler');
const {
	validateRegisterFields,
} = require('../middlewares/validation.middlewares');
const router = Router();

router
	.route('/register')
	.post(validateRegisterFields, asyncHandler(createUser));

module.exports = router;
