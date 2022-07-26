import { getNote } from '../services/notes.services';
import { useQuery } from 'react-query';
import usePrivateRequest from './usePrivateRequest';
import { useRequest } from '../context/RequestProvider';

const useGetNotes = (id) => {
	const privateRequest = useRequest();
	const request = getNote(privateRequest);

	const {
		data: note,
		isLoading,
		error,
	} = useQuery(['note', { id: Number(id) }], async () => await request(id));

	return { note, isLoading, error };
};

export default useGetNotes;
