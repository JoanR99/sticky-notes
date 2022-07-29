import { getNotes } from '../services/notes.services';
import { useQuery } from 'react-query';
import { useRequest } from '../context/RequestProvider';
import { useFilter } from '../context/FilterProvider';

const useGetNotes = () => {
	const isArchive = false;
	const privateRequest = useRequest();
	const request = getNotes(privateRequest);
	const { color, filter } = useFilter();
	console.log('get');

	const {
		data: notes,
		isLoading,
		error,
	} = useQuery(['notes', { isArchive }], async () => await request(isArchive), {
		select: (notes) => {
			if (color === 'all' && !filter) return notes;
			if (color !== 'all' && !filter)
				return notes.filter((note) => note.color.name === color);
			if (color === 'all' && filter)
				return notes.filter(
					(note) => note.title.includes(filter) || note.content.includes(filter)
				);
			if (color !== 'all' && filter)
				return notes.filter(
					(note) =>
						note.color.name === color &&
						(note.title.includes(filter) || note.content.includes(filter))
				);
		},
	});

	return { notes, isLoading, error };
};

export default useGetNotes;
