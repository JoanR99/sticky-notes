import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { object, string, number } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

import useUpdateNote from '../hooks/useUpdateNote';
import NoteForm from './NoteForm';
import { Note, Color } from '../types/Note';
import usePrivateRequest from '../hooks/usePrivateRequest';
import { useAuth } from '../context/AuthProvider';

interface Props {
	show: boolean;
	handleClose: () => void;
	note: Note;
}

const EditNoteModal = ({ handleClose, show, note }: Props) => {
	const { t } = useTranslation('translation');
	const queryClient = useQueryClient();
	const { accessToken, changeAccessToken } = useAuth();
	const privateRequest = usePrivateRequest(accessToken, changeAccessToken);
	const { mutate: updateNote, isLoading } = useUpdateNote(privateRequest);
	const colors = queryClient.getQueryData('colors') as Color[];

	const noteSchema = object({
		title: string().optional(),
		content: string().min(1, 'Content is required'),
		color: number(),
	});

	const defaultValues = {
		title: note?.title,
		content: note?.content,
		color: note?.color.id,
	};

	const methods = useForm({
		resolver: zodResolver(noteSchema),
		defaultValues,
	});

	const { reset, handleSubmit } = methods;

	const onHandleSubmit = handleSubmit(async ({ title, content, color }) => {
		console.log(color);
		await updateNote(
			{ id: note.id, newNote: { title, content, colorId: color } },
			{
				onSuccess: () => {
					queryClient.invalidateQueries(['note', { id: note.id }]);
					toast.success(t('edit_note.success'));
					reset();
					handleClose();
				},
				onError: (error) => {
					if (error instanceof AxiosError)
						toast.error(error?.response?.data?.message);
				},
			}
		);
	});

	return (
		<Dialog fullWidth={true} maxWidth="sm" open={show} onClose={handleClose}>
			<DialogTitle>{t('edit_note.title')}</DialogTitle>
			<DialogContent>
				<NoteForm
					handleClose={handleClose}
					methods={methods}
					onHandleSubmit={onHandleSubmit}
					colors={colors}
					isLoading={isLoading}
					buttonDesc="edit"
				/>
			</DialogContent>
		</Dialog>
	);
};

export default EditNoteModal;
