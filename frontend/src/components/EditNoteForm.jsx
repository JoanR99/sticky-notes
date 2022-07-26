import React, { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { Box, Grid, Stack, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../components/FormInput';
import useUpdateNote from '../hooks/useUpdateNote';

const EditNoteForm = ({ handleClose, note }) => {
	const queryClient = useQueryClient();
	const { mutate: updateNote, isLoading } = useUpdateNote();

	const noteSchema = object({
		title: string().optional(),
		content: string().min(1, 'Content is required'),
	});

	const defaultValues = {
		title: note?.title,
		content: note?.content,
	};

	const methods = useForm({
		resolver: zodResolver(noteSchema),
		defaultValues,
	});

	const { reset, handleSubmit } = methods;

	const onHandleSubmit = async ({ title, content }) => {
		await updateNote(
			{ id: note.id, newNote: { title, content } },
			{
				onSuccess: () => {
					queryClient.invalidateQueries(['note', { id: note.id }]);
					toast.success('Note edited');
					reset();
					handleClose();
				},
			}
		);
	};

	return (
		<FormProvider {...methods}>
			<Box
				display="flex"
				flexDirection="column"
				component="form"
				noValidate
				autoComplete="off"
				onSubmit={handleSubmit(onHandleSubmit)}
				sx={{ mt: 2 }}
			>
				<Grid container justifyContent="center">
					<Stack sx={{ textAlign: 'center', width: '80%' }}>
						<FormInput
							label="Title"
							type="text"
							name="title"
							focused
							required
						/>
						<FormInput
							type="text"
							label="Content"
							name="content"
							required
							focused
						/>
					</Stack>
				</Grid>

				<Stack direction="row" spacing={2} sx={{ ml: 'auto' }}>
					<Button variant="contained" color="error" onClick={handleClose}>
						Cancel
					</Button>

					<LoadingButton
						fullWidth
						variant="contained"
						type="submit"
						loading={isLoading}
						sx={{ width: '30px' }}
					>
						Edit
					</LoadingButton>
				</Stack>
			</Box>
		</FormProvider>
	);
};

export default EditNoteForm;
