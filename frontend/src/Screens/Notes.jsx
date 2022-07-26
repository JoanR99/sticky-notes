import React from 'react';
import { toast } from 'react-toastify';
import Container from '@mui/material/Container';
import useGetNotes from '../hooks/useGetNotes';
import NoteList from '../components/NoteList';
import FullScreenLoader from '../components/FullScreenLoader';
import AddNote from '../components/AddNote';

const Notes = () => {
	const { isLoading, notes } = useGetNotes({
		onError: (error) => {
			toast.error(error.response.data.message);
		},
	});
	console.log(notes);

	return (
		<Container sx={{ mb: 2 }}>
			{isLoading && <FullScreenLoader />}
			{notes?.length && <NoteList notes={notes} />}
			{!notes?.length && <h2>There are currently no notes</h2>}
			<AddNote />
		</Container>
	);
};

export default Notes;
