import React from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import useShowModal from '../hooks/useShowModal';
import EditNoteForm from './EditNoteForm';
import CreateOrEditNoteModal from './CreateOrEditNoteModal';

const ShowEditModalButton = ({ note }) => {
	const { show, handleClose, handleShow } = useShowModal();

	return (
		<>
			{show && (
				<CreateOrEditNoteModal
					show={show}
					handleClose={handleClose}
					title="Edit Note"
				>
					<EditNoteForm handleClose={handleClose} note={note} />
				</CreateOrEditNoteModal>
			)}
			{!show && (
				<Button onClick={handleShow}>
					<EditIcon sx={{ color: 'black' }} />
				</Button>
			)}
		</>
	);
};

export default ShowEditModalButton;
