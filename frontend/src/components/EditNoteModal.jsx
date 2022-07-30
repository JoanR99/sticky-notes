import React from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { object, string } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useUpdateNote from '../hooks/useUpdateNote';
import NoteForm from './NoteForm';

const EditNoteModal = ({ handleClose, show, note }) => {
	const queryClient = useQueryClient();
	const { mutate: updateNote, isLoading } = useUpdateNote();
	const colors = queryClient.getQueryData('colors');

	const noteSchema = object({
		title: string().optional(),
		content: string().min(1, 'Content is required'),
		color: string(),
	});

	const defaultValues = {
		title: note?.title,
		content: note?.content,
		color: note?.color.name,
	};

	const methods = useForm({
		resolver: zodResolver(noteSchema),
		defaultValues,
	});

	const { reset, handleSubmit } = methods;

	const onHandleSubmit = handleSubmit(async ({ title, content, color }) => {
		console.log(color);
		await updateNote(
			{ id: note.id, newNote: { title, content, color } },
			{
				onSuccess: () => {
					queryClient.invalidateQueries(['note', { id: note.id }]);
					toast.success('Note edited');
					reset();
					handleClose();
				},
			}
		);
	});

	return (
		<Dialog fullWidth={true} maxWidth="sm" open={show} onClose={handleClose}>
			<DialogTitle>Edit Note</DialogTitle>
			<DialogContent>
				<NoteForm
					handleClose={handleClose}
					methods={methods}
					onHandleSubmit={onHandleSubmit}
					colors={colors}
					isLoading={isLoading}
					buttonDesc="Edit"
				/>
			</DialogContent>
		</Dialog>
	);
};

export default EditNoteModal;
