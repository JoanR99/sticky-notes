import bcrypt from 'bcrypt';
import { prisma } from '../../prisma';

export const findUserByEmail = async (email: string) =>
	await prisma.user.findUnique({ where: { email } });

export const createUser = async (
	username: string,
	email: string,
	password: string
) => {
	const hash = await bcrypt.hash(password, 10);
	await prisma.user.create({
		data: {
			email,
			username,
			password: hash,
		},
	});
};

export const findUserByRefreshToken = async (refreshToken: string) =>
	await prisma.user.findFirst({ where: { refreshToken } });

export const findUserById = async (id: number) =>
	await prisma.user.findUnique({ where: { id } });

export const updateRefreshToken = async (id: number, refreshToken: string) =>
	await prisma.user.update({ where: { id }, data: { refreshToken } });
