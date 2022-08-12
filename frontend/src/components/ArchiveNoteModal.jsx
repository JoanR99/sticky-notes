import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { LoadingButton } from '@mui/lab';

import useUpdateNote from '../hooks/useUpdateNote';

const ArchiveNoteModal = ({ show, handleClose, note }) => {
	const { mutate: updateNote, isLoading } = useUpdateNote();
	const handleClick = async () => {
		await updateNote(
			{ id: note?.id, newNote: { isArchive: !note?.isArchive } },
			{
				onSuccess: () => {
					handleClose();
				},
			}
		);
	};

	return (
		<Dialog
			open={show}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
		>
			<DialogTitle id="alert-dialog-title">
				{`Are you sure you want to ${
					note?.isArchive ? 'unarchive' : 'archive'
				} this note?`}
			</DialogTitle>

			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<LoadingButton onClick={handleClick} loading={isLoading} autoFocus>
					{note?.isArchive ? 'unarchive' : 'archive'}
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
};

export default ArchiveNoteModal;
