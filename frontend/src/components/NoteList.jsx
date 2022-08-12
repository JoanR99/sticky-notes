import { Box, Grid } from '@mui/material';

import NoteCard from './NoteCard';

const NoteList = ({ notes }) => {
	return (
		<Box sx={{ flexGrow: 1 }}>
			<Grid container spacing={2}>
				{notes.map((note, i) => (
					<Grid item xs={12} sm={6} md={4} xxl={3} key={i}>
						<NoteCard note={note} />
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default NoteList;
