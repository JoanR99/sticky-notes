import Container from '@mui/material/Container';

import NotesGrid from '../components/NotesGrid';
import AddNote from '../components/AddNote';

const Notes = () => (
	<Container sx={{ mb: 2 }}>
		<NotesGrid />
		<AddNote />
	</Container>
);

export default Notes;
