import { addNote } from '../services/notes.services';
import { useMutation, useQueryClient } from 'react-query';
import usePrivateRequest from './usePrivateRequest';
import { useRequest } from '../context/RequestProvider';

const useAddNote = () => {
	const privateRequest = useRequest();
	const request = addNote(privateRequest);
	const queryClient = useQueryClient();

	const { mutate, isLoading } = useMutation(
		async (note) => await request(note),
		{
			onSuccess: (data) => {
				queryClient.invalidateQueries(['notes', { isArchive: false }]);
			},
		}
	);

	return {
		mutate,
		isLoading,
	};
};

export default useAddNote;
