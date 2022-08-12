const User = require('../models/user');
const bcrypt = require('bcrypt');

const findUserByEmail = async (email) =>
	await User.findOne({ where: { email } });

const createUser = async (username, email, password) => {
	const hash = await bcrypt.hash(password, 10);
	await User.create({ username, email, password: hash });
};

const findUserByRefreshToken = async (refreshToken) =>
	await User.findOne({ where: { refreshToken } });

const findUserById = async (id) => await User.findOne({ where: { id } });

module.exports = {
	findUserByEmail,
	createUser,
	findUserByRefreshToken,
	findUserById,
};
