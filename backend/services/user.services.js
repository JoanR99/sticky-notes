const User = require('../models/user');

const findUserByEmail = async (email) =>
	await User.findOne({ where: { email } });

module.exports = { findUserByEmail };
