const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');

const createAccessToken = (userId) => {
	const accessToken = jwt.sign(
		{
			user: {
				id: userId,
			},
		},
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: '1m' }
	);

	return accessToken;
};

const createRefreshToken = (userId) => {
	const refreshToken = jwt.sign(
		{ id: userId },
		process.env.REFRESH_TOKEN_SECRET,
		{ expiresIn: '1d' }
	);

	return refreshToken;
};

const verifyPasswordsMatch = async (rawPassword, hashPassword) =>
	await bcrypt.compare(rawPassword, hashPassword);

module.exports = {
	verifyPasswordsMatch,
	createAccessToken,
	createRefreshToken,
};
