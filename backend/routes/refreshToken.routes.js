const { Router } = require('express');
const refreshToken = require('../controllers/refreshToken.controller');
const router = Router();

router.route('/').get(refreshToken);

module.exports = router;
