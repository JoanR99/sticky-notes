import { AxiosInstance } from 'axios';
import { Color } from '../types/Note';

export const getColors =
	(privateRequest: AxiosInstance) => async (): Promise<Color[]> => {
		const response = await privateRequest.get('/colors');

		return response.data;
	};
