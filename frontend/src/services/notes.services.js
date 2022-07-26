export const getNotes = (privateRequest) => async (isArchive) => {
	const response = await privateRequest.get(`/notes?isArchive=${isArchive}`);
	return response.data;
};

export const getNote = (privateRequest) => async (id) => {
	const response = await privateRequest.get(`/notes/${id}`);
	return response.data;
};

export const addNote = (privateRequest) => async (note) => {
	const response = await privateRequest.post('/notes', note);
	return response.data;
};

export const deleteNote = (privateRequest) => async (id) => {
	const response = await privateRequest.delete(`/notes/${id}`);
	return response.data;
};

export const updateNote =
	(privateRequest) =>
	async ({ id, newNote }) => {
		const response = await privateRequest.patch(`/notes/${id}`, newNote);
		return response.data;
	};
