import { useQuery } from 'react-query';
import { AxiosInstance } from 'axios';

import { getNote } from '../services/notes.services';

const useGetNote = (
	privateRequest: AxiosInstance,
	id: number,
	language: string
) => {
	const request = getNote(privateRequest, language);

	return useQuery(['note', { id: Number(id) }], async () => await request(id));
};

export default useGetNote;
