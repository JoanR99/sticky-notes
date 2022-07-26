import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';

function PaperComponent(props) {
	return (
		<Draggable handle="#note" cancel={'[class*="MuiDialogContent-root"]'}>
			<Paper {...props} />
		</Draggable>
	);
}

const NoteModal = ({ show, handleClose, note, lastEdit }) => (
	<>
		{show && (
			<Dialog
				fullWidth={true}
				maxWidth="sm"
				open={show}
				onClose={handleClose}
				PaperComponent={PaperComponent}
				aria-labelledby="note"
			>
				<DialogTitle style={{ cursor: 'move' }} id="note">
					<Typography variant="h5" component="div">
						{note.title}
					</Typography>
				</DialogTitle>
				<DialogContent>
					<Typography variant="p" sx={{ mb: 1.5 }}>
						{note.content}
					</Typography>
					<Typography sx={{ mt: 1 }} color="text.secondary">
						{lastEdit}
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={handleClose}>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		)}
	</>
);

export default NoteModal;
