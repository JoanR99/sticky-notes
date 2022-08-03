const { Router } = require('express');
const { createUser } = require('../controllers/user.controller');
const asyncHandler = require('../middlewares/asyncHandler');
const router = Router();

router.route('/register').post(asyncHandler(createUser));

module.exports = router;
