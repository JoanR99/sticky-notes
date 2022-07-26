import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const CreateOrEditNoteModal = ({ children, show, handleClose, title }) => {
	return (
		<Dialog fullWidth={true} maxWidth="sm" open={show} onClose={handleClose}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>{children}</DialogContent>
		</Dialog>
	);
};

export default CreateOrEditNoteModal;
