import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { AxiosError, AxiosInstance } from 'axios';

import { getNotes } from '../services/notes.services';
import filterNotes from '../utils/filter';

const useGetNotes = (
	privateRequest: AxiosInstance,
	colorFilter: string,
	searchFilter: string,
	language: string
) => {
	const isArchive = false;
	const request = getNotes(privateRequest, language);

	return useQuery(
		['notes', { isArchive }],
		async () => await request(isArchive),
		{
			select: (notes) => {
				return filterNotes(notes, colorFilter, searchFilter);
			},
			onError: (error) => {
				if (error instanceof AxiosError)
					toast.error(error?.response?.data?.message);
			},
		}
	);
};

export default useGetNotes;
