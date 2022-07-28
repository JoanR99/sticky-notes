import React, { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { Box, Grid, Stack, Button, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../components/FormInput';
import useUpdateNote from '../hooks/useUpdateNote';
import SelectInput from './SelectInput';

const EditNoteForm = ({ handleClose, note }) => {
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

	const onHandleSubmit = async ({ title, content, color }) => {
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
					<Stack sx={{ textAlign: 'center', width: '80%', mb: 2 }}>
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

						<SelectInput id="color" name="color" label="color" required focused>
							{colors?.map((color) => (
								<MenuItem key={color.id} value={color.name}>
									<Box
										component="span"
										sx={{
											height: 20,
											width: 20,
											backgroundColor: color.hex,
											mr: 2,
										}}
									></Box>
									{color.name}
								</MenuItem>
							))}
						</SelectInput>
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
