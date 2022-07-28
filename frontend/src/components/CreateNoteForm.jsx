import React, { useEffect } from 'react';
import { Box, Grid, Stack, Button, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import FormInput from '../components/FormInput';
import useAddNote from '../hooks/useAddNote';
import useGetColors from '../hooks/useGetColors';
import SelectInput from './SelectInput';

const CreateNoteForm = ({ handleClose }) => {
	const { mutate: addNote, isLoading } = useAddNote();
	const { colors, isLoading: loading, error } = useGetColors();

	const noteSchema = object({
		title: string().optional(),
		content: string().min(1, 'Content is required'),
		color: string(),
	});

	const defaultValues = {
		title: '',
		content: '',
		color: 'white',
	};

	const methods = useForm({
		resolver: zodResolver(noteSchema),
		defaultValues,
	});

	const { reset, handleSubmit } = methods;

	const onHandleSubmit = async ({ title, content, color }) => {
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

						{!loading && (
							<SelectInput
								id="color"
								name="color"
								label="color"
								required
								focused
							>
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
						)}
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
