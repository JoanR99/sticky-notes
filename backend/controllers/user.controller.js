const userService = require('../services/user.services');

const createUser = async (req, res) => {
	const { username, email, password } = req.body;

	await userService.createUser(username, email, password);

	res.status(201).json({ message: 'User created successfully' });
};

module.exports = { createUser };
