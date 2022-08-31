import { useMutation, useQueryClient } from 'react-query';
import { AxiosInstance } from 'axios';

import { updateNote } from '../services/notes.services';
import { UpdateNote } from '../types/Note';

const useUpdateNote = (privateRequest: AxiosInstance, language: string) => {
	const request = updateNote(privateRequest, language);
	const queryClient = useQueryClient();
	return useMutation(async (data: UpdateNote) => await request(data), {
		onSuccess: (data) => {
			queryClient.invalidateQueries(['notes', { isArchive: false }]);
			queryClient.invalidateQueries(['notes', { isArchive: true }]);
		},
	});
};

export default useUpdateNote;
