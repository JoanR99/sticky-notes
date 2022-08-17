import { RequestHandler } from 'express';

import * as userService from '../services/user.services';

export const createUser: RequestHandler = async (req, res) => {
	const { username, email, password } = req.body;

	await userService.createUser(username, email, password);

	res.status(201).json({ message: 'User created successfully' });
};
