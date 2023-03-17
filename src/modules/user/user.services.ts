import { prisma } from '../../../prisma';
import { hashPassword } from '../../utils/hash';
import { CreateUserInput } from './user.schema';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const signToken = (
	payload: string | object,
	secret: string,
	signOptions: SignOptions
): string => jwt.sign(payload, secret, signOptions);

export function createAccessToken(userId: number) {
	const payload = {
		user: {
			id: userId,
		},
	};

	const secret = process.env.ACCESS_TOKEN_SECRET!;

	const signOptions: SignOptions = {
		expiresIn: '1d',
	};

	return signToken(payload, secret, signOptions);
}

export function createRefreshToken(userId: number) {
	const payload = {
		user: {
			id: userId,
		},
	};

	const secret = process.env.REFRESH_TOKEN_SECRET!;

	const signOptions: SignOptions = {
		expiresIn: '7d',
	};

	return signToken(payload, secret, signOptions);
}

interface TokenPayload {
	user: {
		id: number;
	};
}

export function validateToken(
	token: string,
	publicKey: string
): Promise<TokenPayload> {
	return new Promise((resolve, reject) => {
		jwt.verify(token, publicKey, (error, decoded: any) => {
			if (error) return reject(error);

			resolve(decoded);
		});
	});
}

export async function createUser(userInput: CreateUserInput) {
	const { password } = userInput;
	const hash = await hashPassword(password);

	const user = await prisma.user.create({
		data: {
			...userInput,
			password: hash,
		},
	});

	return user;
}

export async function findById(id: number) {
	const user = await prisma.user.findUnique({ where: { id } });

	return user;
}

export async function findByEmail(email: string) {
	const user = await prisma.user.findUnique({ where: { email } });

	return user;
}

export async function findByRefreshToken(refreshToken: string) {
	const user = await prisma.user.findFirst({ where: { refreshToken } });

	return user;
}

export async function updateRefreshToken(userId: number, refreshToken: string) {
	await prisma.user.update({
		where: { id: userId },
		data: {
			refreshToken,
		},
	});
}
