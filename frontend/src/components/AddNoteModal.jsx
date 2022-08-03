import React from 'react';
import { useForm } from 'react-hook-form';
import { object, string, number } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useAddNote from '../hooks/useAddNote';
import { useQueryClient } from 'react-query';
import NoteForm from './NoteForm';

const AddNoteModal = ({ handleClose, show }) => {
	const { mutate: addNote, isLoading } = useAddNote();
	const queryClient = useQueryClient();
	const colors = queryClient.getQueryData('colors');

	const noteSchema = object({
		title: string().optional(),
		content: string().min(1, 'Content is required'),
		color: number(),
	});

	const defaultValues = {
		title: '',
		content: '',
		color: 14,
	};

	const methods = useForm({
		resolver: zodResolver(noteSchema),
		defaultValues,
	});

	const { reset, handleSubmit } = methods;

	const onHandleSubmit = handleSubmit(async ({ title, content, color }) => {
		await addNote(
			{ title, content, color },
			{
				onSuccess: (data) => {
					toast.success('Note added successfuly');
					reset();
					handleClose();
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
