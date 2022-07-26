import React, { useEffect } from 'react';
import { Box, Grid, Stack, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import FormInput from '../components/FormInput';
import useAddNote from '../hooks/useAddNote';

const CreateNoteForm = ({ handleClose }) => {
	const { mutate: addNote, isLoading } = useAddNote();

	const noteSchema = object({
		title: string().optional(),
		content: string().min(1, 'Content is required'),
	});

	const defaultValues = {
		title: '',
		content: '',
	};

	const methods = useForm({
		resolver: zodResolver(noteSchema),
		defaultValues,
	});

	const { reset, handleSubmit } = methods;

	const onHandleSubmit = async ({ title, content }) => {
		await addNote(
			{ title, content },
			{
				onSuccess: (data) => {
					toast.success('Note added successfuly');
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
						Add
					</LoadingButton>
				</Stack>
			</Box>
		</FormProvider>
	);
};

export default CreateNoteForm;
