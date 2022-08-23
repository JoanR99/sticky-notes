import { Box, Grid } from '@mui/material';
import { Note } from '../types/Note';

import NoteCard from './NoteCard';

interface Props {
	notes: Note[];
}

const NoteList = ({ notes }: Props) => {
	return (
		<Box sx={{ flexGrow: 1 }}>
			<Grid container spacing={2}>
				{notes.map((note, i) => (
					<Grid item xs={12} sm={6} md={4} key={i}>
						<NoteCard note={note} />
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default NoteList;
