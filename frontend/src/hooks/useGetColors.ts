import { useQuery } from 'react-query';

import { getColors } from '../services/colors.services';
import { useRequest } from '../context/RequestProvider';
import { Color } from '../types/Note';
import { AxiosError } from 'axios';

const useGetColors = () => {
	const privateRequest = useRequest();
	const request = getColors(privateRequest);

	const {
		data: colors,
		isLoading,
		error,
	} = useQuery<Color[], AxiosError>('colors', async () => await request());

	return { colors, isLoading, error };
};

export default useGetColors;
