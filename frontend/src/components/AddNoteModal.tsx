import { useForm } from 'react-hook-form';
import { object, string, number } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useQueryClient } from 'react-query';
import { AxiosError } from 'axios';

import useAddNote from '../hooks/useAddNote';
import NoteForm from './NoteForm';
import { Color } from '../types/Note';
import usePrivateRequest from '../hooks/usePrivateRequest';
import { useAuth } from '../context/AuthProvider';

const AddNoteModal = ({
	handleClose,
	show,
}: {
	handleClose: () => void;
	show: boolean;
}) => {
	const { accessToken, changeAccessToken } = useAuth();
	const privateRequest = usePrivateRequest(accessToken, changeAccessToken);
	const { mutate: addNote, isLoading } = useAddNote(privateRequest);
	const queryClient = useQueryClient();
	const colors = queryClient.getQueryData('colors') as Color[];

	const noteSchema = object({
		title: string().optional(),
		content: string().min(1, 'Content is required'),
		color: number(),
	});

	const defaultValues = {
		title: '',
		content: '',
		color: 1,
	};

	const methods = useForm({
		resolver: zodResolver(noteSchema),
		defaultValues,
	});

	const { reset, handleSubmit } = methods;

	const onHandleSubmit = handleSubmit(async ({ title, content, color }) => {
		await addNote(
			{ title, content, colorId: color },
			{
				onSuccess: (data) => {
					toast.success('Note added successfuly');
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
			<DialogTitle>Add Note</DialogTitle>
			<DialogContent>
				<NoteForm
					handleClose={handleClose}
					methods={methods}
					onHandleSubmit={onHandleSubmit}
					colors={colors}
					isLoading={isLoading}
					buttonDesc="Add"
				/>
			</DialogContent>
		</Dialog>
	);
};

export default AddNoteModal;
