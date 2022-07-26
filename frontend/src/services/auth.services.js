import { baseRequest, privateRequest } from './baseRequest';

export const register = async (credentials) => {
	const response = await privateRequest.post(`/users/register`, credentials);

	return response.data;
};

export const login = async (credentials) => {
	const response = await privateRequest.post(`/users/login`, credentials);
	return response.data;
};

export const logout = async () => {
	const response = await privateRequest.get(`/users/logout`, {
		withCredentials: true,
	});
	return response.data;
};

export const getUsers = () => baseRequest.get(`/users`);

export const getRefreshToken = () =>
	baseRequest.get(`/refresh`, { withCredentials: true });
