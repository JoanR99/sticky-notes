import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const signToken = (
	payload: string | object,
	secret: string,
	signOptions: SignOptions
): string => jwt.sign(payload, secret, signOptions);

export const createAccessToken = (userId: number) => {
	const payload = {
		user: {
			id: userId,
		},
	};

	const secret = process.env.ACCESS_TOKEN_SECRET!;

	const signOptions: SignOptions = {
		expiresIn: '1m',
	};

	return signToken(payload, secret, signOptions);
};

export const createRefreshToken = (userId: number) => {
	const payload = {
		user: {
			id: userId,
		},
	};

	const secret = process.env.REFRESH_TOKEN_SECRET!;

	const signOptions: SignOptions = {
		expiresIn: '1d',
	};

	return signToken(payload, secret, signOptions);
};

interface TokenPayload {
	user: {
		id: number;
	};
}

export const validateToken = (
	token: string,
	publicKey: string
): Promise<TokenPayload> =>
	new Promise((resolve, reject) => {
		jwt.verify(token, publicKey, (error, decoded: any) => {
			if (error) return reject(error);

			resolve(decoded);
		});
	});

export const verifyPasswordsMatch = (
	rawPassword: string,
	hashPassword: string
) => bcrypt.compare(rawPassword, hashPassword);
