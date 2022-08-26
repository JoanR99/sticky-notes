import { useMutation, useQueryClient } from 'react-query';

import { addNote } from '../services/notes.services';
import { useRequest } from '../context/RequestProvider';
import { AddNote } from '../types/Note';

const useAddNote = () => {
	const privateRequest = useRequest();
	const request = addNote(privateRequest);
	const queryClient = useQueryClient();

	return useMutation(async (note: AddNote) => await request(note), {
		onSuccess: (data) => {
			queryClient.invalidateQueries(['notes', { isArchive: false }]);
		},
	});
};

export default useAddNote;
