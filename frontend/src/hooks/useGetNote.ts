import { useQuery } from 'react-query';
import { AxiosInstance } from 'axios';

import { getNote } from '../services/notes.services';

const useGetNote = (privateRequest: AxiosInstance, id: number) => {
	const request = getNote(privateRequest);

	return useQuery(['note', { id: Number(id) }], async () => await request(id));
};

export default useGetNote;
