import React from 'react';
import useShowModal from '../hooks/useShowModal';
import AddNoteModal from './AddNoteModal';
import Fab from '@mui/material/Fab';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddNote = () => {
	const { show, handleClose, handleShow } = useShowModal();

	console.log('add');

	return show ? (
		<AddNoteModal show={show} handleClose={handleClose} />
	) : (
		<Box sx={{ '& > :not(style)': { m: 1 } }}>
			<Fab
				color="primary"
				aria-label="add"
				sx={{
					position: 'fixed',
					bottom: (theme) => theme.spacing(2),
					right: (theme) => theme.spacing(4),
				}}
				onClick={handleShow}
			>
				<AddIcon />
			</Fab>
		</Box>
	);
};

export default AddNote;
