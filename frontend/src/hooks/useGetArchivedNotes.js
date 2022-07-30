import { useQuery } from 'react-query';
import { getNotes } from '../services/notes.services';
import { useRequest } from '../context/RequestProvider';
import { useFilter } from '../context/FilterProvider';
import filterNotes from '../utils/filter';

const useGetArchivedNotes = () => {
	const isArchive = true;
	const privateRequest = useRequest();
	const request = getNotes(privateRequest);
	const { colorFilter, searchFilter } = useFilter();

	const {
		data: notes,
		isLoading,
		error,
	} = useQuery(['notes', { isArchive }], async () => await request(isArchive), {
		select: (notes) => {
			return filterNotes(notes, colorFilter, searchFilter);
		},
	});
	return { notes, isLoading, error };
};

export default useGetArchivedNotes;
