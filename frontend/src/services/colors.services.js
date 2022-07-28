export const getColors = (privateRequest) => async () => {
	const response = await privateRequest.get('/colors');

	return response.data;
};
