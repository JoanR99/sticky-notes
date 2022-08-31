import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

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
	const { t, i18n } = useTranslation('translation');
	const { accessToken, changeAccessToken } = useAuth();
	const privateRequest = usePrivateRequest(
		accessToken,
		changeAccessToken,
		i18n.language
	);
	const { mutate: updateNote, isLoading } = useUpdateNote(
		privateRequest,
		i18n.language
	);
	const handleClick = async () => {
		await updateNote(
			{ id: note?.id, newNote: { isArchive: !note?.isArchive } },
			{
				onSuccess: () => {
					const successMessage = note?.isArchive
						? t('unarchive_note.success')
						: t('archive_note.success');
					toast.success(successMessage);
					handleClose();
				},
				onError: (error) => {
					if (error instanceof AxiosError)
						toast.error(error?.response?.data?.message);
				},
			}
		);
	};

	const dialogTitle = note?.isArchive
		? t('unarchive_note.title')
		: t('archive_note.title');

	const dialogAction = note?.isArchive
		? t('actions.unarchive')
		: t('actions.archive');

	return (
		<Dialog
			open={show}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
		>
			<DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>

			<DialogActions>
				<Button onClick={handleClose}>{t('actions.cancel')}</Button>
				<LoadingButton onClick={handleClick} loading={isLoading} autoFocus>
					{dialogAction}
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
};

export default ArchiveNoteModal;
