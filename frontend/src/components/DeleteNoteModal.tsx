import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import useDeleteNote from '../hooks/useDeleteNote';
import usePrivateRequest from '../hooks/usePrivateRequest';
import { useAuth } from '../context/AuthProvider';

interface Props {
	show: boolean;
	handleClose: () => void;
	id: number;
}

const DeleteNoteModal = ({ show, handleClose, id }: Props) => {
	const { accessToken, changeAccessToken } = useAuth();
	const privateRequest = usePrivateRequest(accessToken, changeAccessToken);
	const { mutate: deleteNote, isLoading } = useDeleteNote(privateRequest);
	const handleClick = async () => {
		await deleteNote(id, {
			onSuccess: () => {
				toast.success('Note deleted successfully');
				handleClose();
			},
			onError: (error) => {
				if (error instanceof AxiosError)
					toast.error(error?.response?.data?.message);
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
