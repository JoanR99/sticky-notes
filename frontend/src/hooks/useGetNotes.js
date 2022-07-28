import { getNotes } from '../services/notes.services';
import { useQuery } from 'react-query';
import { useRequest } from '../context/RequestProvider';

const useGetNotes = () => {
	const isArchive = false;
	const privateRequest = useRequest();
	const request = getNotes(privateRequest);
	console.log('get');

	const {
		data: notes,
		isLoading,
		error,
	} = useQuery(['notes', { isArchive }], async () => await request(isArchive));

	return { notes, isLoading, error };
};

export default useGetNotes;
