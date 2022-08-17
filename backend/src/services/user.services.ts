import bcrypt from 'bcrypt';

import User from '../models/user';

export const findUserByEmail = async (email: string) =>
	await User.findOne({ where: { email } });

export const createUser = async (
	username: string,
	email: string,
	password: string
) => {
	const hash = await bcrypt.hash(password, 10);
	await User.create({ username, email, password: hash });
};

export const findUserByRefreshToken = async (refreshToken: string) =>
	await User.findOne({ where: { refreshToken } });

export const findUserById = async (id: number) =>
	await User.findOne({ where: { id } });
