import { useQuery } from 'react-query';
import { AxiosInstance } from 'axios';

import { getColors } from '../services/colors.services';

const useGetColors = (privateRequest: AxiosInstance) => {
	const request = getColors(privateRequest);

	return useQuery('colors', async () => await request());
};

export default useGetColors;
