import { getColors } from '../services/colors.services';
import { useQuery } from 'react-query';
import { useRequest } from '../context/RequestProvider';

const useGetColors = () => {
	const privateRequest = useRequest();
	const request = getColors(privateRequest);

	const {
		data: colors,
		isLoading,
		error,
	} = useQuery('colors', async () => await request());

	return { colors, isLoading, error };
};

export default useGetColors;
