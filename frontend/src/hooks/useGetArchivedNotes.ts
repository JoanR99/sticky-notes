import { useQuery } from 'react-query';
import { AxiosInstance } from 'axios';

import { getNotes } from '../services/notes.services';
import filterNotes from '../utils/filter';

const useGetArchivedNotes = (
	privateRequest: AxiosInstance,
	colorFilter: string,
	searchFilter: string
) => {
	const isArchive = true;
	const request = getNotes(privateRequest);

	return useQuery(
		['notes', { isArchive }],
		async () => await request(isArchive),
		{
			select: (notes) => {
				return filterNotes(notes, colorFilter, searchFilter);
			},
		}
	);
};

export default useGetArchivedNotes;
