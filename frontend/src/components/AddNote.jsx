import React from 'react';
import useShowModal from '../hooks/useShowModal';
import CreateOrEditNoteModal from './CreateOrEditNoteModal';
import CreateNoteForm from './CreateNoteForm';
import Fab from '@mui/material/Fab';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddNote = () => {
	const { show, handleClose, handleShow } = useShowModal();

	console.log('add');

	return show ? (
		<CreateOrEditNoteModal
			show={show}
			handleClose={handleClose}
			title="Create Note"
		>
			<CreateNoteForm handleClose={handleClose} />
		</CreateOrEditNoteModal>
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
