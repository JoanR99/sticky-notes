const getNotes = (privateRequest) => async (isArchive) => {
	const response = await privateRequest.get(`/notes?isArchive=${isArchive}`);
	return response.data;
};

const getNote = (privateRequest) => async (id) => {
	const response = await privateRequest.get(`/notes/${id}`);
	return response.data;
};

const addNote = (privateRequest) => async (note) => {
	const response = await privateRequest.post('/notes', note);
	return response.data;
};

const deleteNote = (privateRequest) => async (id) => {
	const response = await privateRequest.delete(`/notes/${id}`);
	return response.data;
};

const updateNote =
	(privateRequest) =>
	async ({ id, newNote }) => {
		const response = await privateRequest.patch(`/notes/${id}`, newNote);
		return response.data;
	};

export { getNote, getNotes, addNote, deleteNote, updateNote };
