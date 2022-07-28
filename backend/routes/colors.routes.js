const { Router } = require('express');
const router = Router();
const {
	getColors,
	createColor,
	deleteColor,
} = require('../controllers/colors.controller');
const verifyJWT = require('../middlewares/verifyJWT');
const asyncHandler = require('../middlewares/asyncHandler');

router
	.route('/')
	.get(verifyJWT, asyncHandler(getColors))
	.post(verifyJWT, asyncHandler(createColor));

router.route('/:id').delete(verifyJWT, asyncHandler(deleteColor));

module.exports = router;
