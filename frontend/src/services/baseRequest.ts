import axios from 'axios';

export const baseRequest = axios.create({
	baseURL: '/api',
});

export const privateRequest = axios.create({
	baseURL: '/api',
	withCredentials: true,
});

baseRequest.defaults.headers.common['Content-Type'] = 'application/json';
privateRequest.defaults.headers.common['Content-Type'] = 'application/json';
