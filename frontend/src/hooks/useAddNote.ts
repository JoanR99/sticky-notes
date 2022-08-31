import { useMutation, useQueryClient } from 'react-query';
import { AxiosInstance } from 'axios';
import { addNote } from '../services/notes.services';
import { AddNote } from '../types/Note';

const useAddNote = (privateRequest: AxiosInstance, language: string) => {
	const request = addNote(privateRequest, language);
	const queryClient = useQueryClient();

	return useMutation(async (note: AddNote) => await request(note), {
		onSuccess: (data) => {
			queryClient.invalidateQueries(['notes', { isArchive: false }]);
		},
	});
};

export default useAddNote;
