import { AxiosInstance } from 'axios';

export const getColors = (privateRequest: AxiosInstance) => async () => {
	const response = await privateRequest.get('/colors');

	return response.data;
};
