import React from 'react';
import { Box, Grid, Stack, Button, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from './FormInput';
import SelectInput from './SelectInput';

const NoteForm = ({
	handleClose,
	methods,
	onHandleSubmit,
	colors,
	isLoading,
	buttonDesc,
}) => {
	return (
		<FormProvider {...methods}>
			<Box
				display="flex"
				flexDirection="column"
				component="form"
				noValidate
				autoComplete="off"
				onSubmit={onHandleSubmit}
				sx={{ mt: 2 }}
			>
				<Grid container justifyContent="center">
					<Stack sx={{ textAlign: 'center', width: '80%', mb: 2 }}>
						<FormInput label="Title" type="text" name="title" required />
						<FormInput
							type="text"
							multiline
							rows={4}
							label="Content"
							name="content"
							required
						/>

						<SelectInput id="color" name="color" label="color" required>
							{colors?.map((color) => {
								return (
									<MenuItem key={color.id} value={color.id}>
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
								);
							})}
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
						{buttonDesc}
					</LoadingButton>
				</Stack>
			</Box>
		</FormProvider>
	);
};

export default NoteForm;
