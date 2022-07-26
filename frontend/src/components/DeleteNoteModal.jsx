import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { LoadingButton } from '@mui/lab';
import useDeleteNote from '../hooks/useDeleteNote';

const DeleteNoteModal = ({ show, handleClose, id }) => {
	const { mutate: deleteNote, isLoading } = useDeleteNote();
	const handleClick = async () => {
		await deleteNote(id, {
			onSuccess: () => {
				handleClose();
			},
		});
	};

	return (
		<Dialog
			open={show}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
		>
			<DialogTitle id="alert-dialog-title">
				Are you sure you want to delete this note?
			</DialogTitle>

			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<LoadingButton onClick={handleClick} loading={isLoading} autoFocus>
					Delete
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
};

export default DeleteNoteModal;
