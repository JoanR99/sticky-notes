import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import useUpdateNote from '../hooks/useUpdateNote';
import { Note } from '../types/Note';
import usePrivateRequest from '../hooks/usePrivateRequest';
import { useAuth } from '../context/AuthProvider';

interface Props {
	show: boolean;
	handleClose: () => void;
	note: Note;
}

const ArchiveNoteModal = ({ show, handleClose, note }: Props) => {
	const { accessToken, changeAccessToken } = useAuth();
	const privateRequest = usePrivateRequest(accessToken, changeAccessToken);
	const { mutate: updateNote, isLoading } = useUpdateNote(privateRequest);
	const handleClick = async () => {
		await updateNote(
			{ id: note?.id, newNote: { isArchive: !note?.isArchive } },
			{
				onSuccess: () => {
					toast.success('Note archived successfully');
					handleClose();
				},
				onError: (error) => {
					if (error instanceof AxiosError)
						toast.error(error?.response?.data?.message);
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
