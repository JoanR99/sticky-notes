import { useQuery } from 'react-query';
import { AxiosInstance } from 'axios';

import { getColors } from '../services/colors.services';

const useGetColors = (privateRequest: AxiosInstance, language: string) => {
	const request = getColors(privateRequest, language);

	return useQuery('colors', async () => await request());
};

export default useGetColors;
