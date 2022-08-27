import { AxiosInstance } from 'axios';
import { AddNote, Note, UpdateNote } from '../types/Note';

const getNotes =
	(privateRequest: AxiosInstance) =>
	(isArchive: boolean): Promise<Note[]> =>
		privateRequest
			.get(`/notes?isArchive=${isArchive}`)
			.then((response) => response.data);

const getNote =
	(privateRequest: AxiosInstance) =>
	async (id: number): Promise<Note> => {
		const response = await privateRequest.get(`/notes/${id}`);
		return response.data;
	};

const addNote = (privateRequest: AxiosInstance) => async (note: AddNote) => {
	const response = await privateRequest.post('/notes', note);
	return response.data;
};

const deleteNote = (privateRequest: AxiosInstance) => async (id: number) => {
	const response = await privateRequest.delete(`/notes/${id}`);
	return response.data;
};

const updateNote =
	(privateRequest: AxiosInstance) =>
	async ({ id, newNote }: UpdateNote) => {
		const response = await privateRequest.patch(`/notes/${id}`, newNote);
		return response.data;
	};

export { getNote, getNotes, addNote, deleteNote, updateNote };
