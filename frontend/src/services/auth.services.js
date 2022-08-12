import { baseRequest, privateRequest } from './baseRequest';

const register = async (credentials) => {
	const response = await baseRequest.post(`/users/register`, credentials);

	return response.data;
};

const login = async (credentials) => {
	const response = await baseRequest.post(`/auth/login`, credentials);
	return response.data;
};

const logout = async () => {
	const response = await privateRequest.get(`/auth/logout`);
	return response.data;
};

const getRefreshToken = async () => {
	const response = await privateRequest.get('/auth/refresh');
	return response.data;
};

export { register, login, logout, getRefreshToken };
