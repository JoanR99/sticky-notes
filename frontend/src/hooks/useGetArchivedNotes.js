import { useQuery } from 'react-query';
import { getNotes } from '../services/notes.services';
import usePrivateRequest from './usePrivateRequest';
import { useRequest } from '../context/RequestProvider';

const useGetArchivedNotes = () => {
	const isArchive = true;
	const privateRequest = useRequest();
	const request = getNotes(privateRequest);

	const {
		data: notes,
		isLoading,
		error,
	} = useQuery(['notes', { isArchive }], async () => await request(isArchive));
	return { notes, isLoading, error };
};

export default useGetArchivedNotes;
