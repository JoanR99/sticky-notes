import axios from 'axios';

const baseRequest = axios.create({
	baseURL: '/api',
});

const privateRequest = axios.create({
	baseURL: '/api',
	withCredentials: true,
});

baseRequest.defaults.headers.common['Content-Type'] = 'application/json';
privateRequest.defaults.headers.common['Content-Type'] = 'application/json';

const refreshAccessTokenFn = async () => {
	const response = await privateRequest.get('/refresh');
	return response.data;
};

export { baseRequest, privateRequest, refreshAccessTokenFn };
