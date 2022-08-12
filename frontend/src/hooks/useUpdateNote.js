import { useMutation, useQueryClient } from 'react-query';

import { updateNote } from '../services/notes.services';
import { useRequest } from '../context/RequestProvider';

const useUpdateNote = () => {
	const privateRequest = useRequest();
	const request = updateNote(privateRequest);
	const queryClient = useQueryClient();
	const { mutate, isLoading } = useMutation(
		async (data) => await request(data),
		{
			onSuccess: (data) => {
				queryClient.invalidateQueries(['notes', { isArchive: false }]);
				queryClient.invalidateQueries(['notes', { isArchive: true }]);
			},
		}
	);

	return { mutate, isLoading };
};

export default useUpdateNote;
