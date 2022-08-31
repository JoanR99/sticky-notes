import { LoginCredentials, RegisterCredentials } from '../types/Auth';
import { baseRequest, privateRequest } from './baseRequest';

export const register = async (
	credentials: RegisterCredentials,
	language: string
) => {
	const response = await baseRequest.post(`/users/register`, credentials, {
		headers: { 'Accept-Language': language },
	});

	return response.data;
};

export const login = async (
	credentials: LoginCredentials,
	language: string
) => {
	const response = await baseRequest.post(`/auth/login`, credentials, {
		headers: { 'Accept-Language': language },
	});
	return response.data;
};

export const logout = async (language: string) => {
	const response = await privateRequest.get(`/auth/logout`, {
		headers: { 'Accept-Language': language },
	});
	return response.data;
};

export const getRefreshToken = async (language: string) => {
	const response = await privateRequest.get('/auth/refresh', {
		headers: { 'Accept-Language': language },
	});
	return response.data;
};
