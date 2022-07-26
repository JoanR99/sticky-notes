import React from 'react';
import Container from '@mui/material/Container';
import { toast } from 'react-toastify';
import useGetArchivedNotes from '../hooks/useGetArchivedNotes';
import NoteList from '../components/NoteList';
import FullScreenLoader from '../components/FullScreenLoader';

const ArchivedNotes = () => {
	const { isLoading, notes } = useGetArchivedNotes({
		onError: (error) => {
			toast.error(error.response.data.message);
		},
	});

	return (
		<Container>
			{isLoading && <FullScreenLoader />}
			{notes?.length && <NoteList notes={notes} />}
			{notes?.length === 0 && <h2>There are currently no archived notes</h2>}
		</Container>
	);
};

export default ArchivedNotes;
