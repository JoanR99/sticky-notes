import { useQuery } from 'react-query';
import { getNotes } from '../services/notes.services';
import { useRequest } from '../context/RequestProvider';
import { useFilter } from '../context/FilterProvider';

const useGetArchivedNotes = () => {
	const isArchive = true;
	const privateRequest = useRequest();
	const request = getNotes(privateRequest);
	const { color } = useFilter();

	const {
		data: notes,
		isLoading,
		error,
	} = useQuery(['notes', { isArchive }], async () => await request(isArchive), {
		select: (notes) => {
			console.log(notes);
			console.log(color);
			if (color === 'all') return notes;
			return notes.filter((note) => note.color.name === color);
		},
	});
	return { notes, isLoading, error };
};

export default useGetArchivedNotes;
