import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const NoteModal = ({ show, handleClose, note, lastEdit }) => (
	<>
		{show && (
			<Dialog
				fullWidth={true}
				maxWidth="sm"
				open={show}
				onClose={handleClose}
				aria-labelledby="note"
			>
				<DialogTitle id="note" sx={{ backgroundColor: note.color.hex }}>
					<Typography variant="h5" component="div">
						{note.title}
					</Typography>
				</DialogTitle>
				<DialogContent sx={{ backgroundColor: note.color.hex }}>
					<Typography variant="p" sx={{ mb: 1.5 }}>
						{note.content}
					</Typography>
					<Typography sx={{ mt: 1 }} color="text.secondary">
						{lastEdit}
					</Typography>
				</DialogContent>
				<DialogActions sx={{ backgroundColor: note.color.hex }}>
					<Button autoFocus onClick={handleClose}>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		)}
	</>
);

export default NoteModal;
