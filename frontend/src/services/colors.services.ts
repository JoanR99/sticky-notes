import { AxiosInstance } from 'axios';
import { Color } from '../types/Note';

export const getColors =
	(privateRequest: AxiosInstance, language: string) =>
	async (): Promise<Color[]> => {
		const response = await privateRequest.get('/colors', {
			headers: { 'Accept-Language': language },
		});

		return response.data;
	};
