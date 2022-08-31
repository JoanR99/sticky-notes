import { AxiosInstance } from 'axios';
import { AddNote, Note, UpdateNote } from '../types/Note';

const getNotes =
	(privateRequest: AxiosInstance, language: string) =>
	(isArchive: boolean): Promise<Note[]> =>
		privateRequest
			.get(`/notes?isArchive=${isArchive}`, {
				headers: { 'Accept-Language': language },
			})
			.then((response) => response.data);

const getNote =
	(privateRequest: AxiosInstance, language: string) =>
	async (id: number): Promise<Note> => {
		const response = await privateRequest.get(`/notes/${id}`, {
			headers: { 'Accept-Language': language },
		});
		return response.data;
	};

const addNote =
	(privateRequest: AxiosInstance, language: string) =>
	async (note: AddNote) => {
		const response = await privateRequest.post('/notes', note, {
			headers: { 'Accept-Language': language },
		});
		return response.data;
	};

const deleteNote =
	(privateRequest: AxiosInstance, language: string) => async (id: number) => {
		const response = await privateRequest.delete(`/notes/${id}`, {
			headers: { 'Accept-Language': language },
		});
		return response.data;
	};

const updateNote =
	(privateRequest: AxiosInstance, language: string) =>
	async ({ id, newNote }: UpdateNote) => {
		const response = await privateRequest.patch(`/notes/${id}`, newNote, {
			headers: { 'Accept-Language': language },
		});
		return response.data;
	};

export { getNote, getNotes, addNote, deleteNote, updateNote };
