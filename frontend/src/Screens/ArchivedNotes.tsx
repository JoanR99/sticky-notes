import Container from '@mui/material/Container';

import useGetArchivedNotes from '../hooks/useGetArchivedNotes';
import NoteList from '../components/NoteList';
import FullScreenLoader from '../components/FullScreenLoader';

const ArchivedNotes = () => {
	const { isLoading, notes } = useGetArchivedNotes();

	return (
		<Container>
			{isLoading && <FullScreenLoader />}
			{notes && notes?.length > 0 && <NoteList notes={notes} />}
			{notes?.length === 0 && <h2>There are currently no archived notes</h2>}
		</Container>
	);
};

export default ArchivedNotes;
