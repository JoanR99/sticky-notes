import React from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import useShowModal from '../hooks/useShowModal';
import DeleteNoteModal from './DeleteNoteModal';

const DeleteNote = ({ note }) => {
	const { show, handleClose, handleShow } = useShowModal();

	return (
		<>
			{show && (
				<DeleteNoteModal show={show} handleClose={handleClose} id={note.id} />
			)}
			{!show && (
				<Button onClick={handleShow}>
					<DeleteIcon sx={{ color: 'black' }} />
				</Button>
			)}
		</>
	);
};

export default DeleteNote;
