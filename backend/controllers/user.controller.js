const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports.createUser = async (req, res) => {
	const { username, email, password } = req.body;

	const hash = await bcrypt.hash(password, 10);
	await User.create({ username, email, password: hash });

	res.status(201).json({ message: 'User created successfuly' });
};
