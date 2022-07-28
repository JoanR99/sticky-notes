import { getNotes } from '../services/notes.services';
import { useQuery } from 'react-query';
import { useRequest } from '../context/RequestProvider';
import { useFilter } from '../context/FilterProvider';

const useGetNotes = () => {
	const isArchive = false;
	const privateRequest = useRequest();
	const request = getNotes(privateRequest);
	const { color } = useFilter();
	console.log('get');

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

export default useGetNotes;
