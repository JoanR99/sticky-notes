import { useMutation, useQueryClient } from 'react-query';

import { deleteNote } from '../services/notes.services';
import { useRequest } from '../context/RequestProvider';

const useDeleteNote = () => {
	const privateRequest = useRequest();
	const request = deleteNote(privateRequest);
	const queryClient = useQueryClient();
	const { mutate, isLoading } = useMutation(
		async (id: number) => await request(id),
		{
			onSuccess: (data) => {
				queryClient.invalidateQueries(['notes', { isArchive: false }]);
				queryClient.invalidateQueries(['notes', { isArchive: true }]);
			},
		}
	);

	return { mutate, isLoading };
};

export default useDeleteNote;
