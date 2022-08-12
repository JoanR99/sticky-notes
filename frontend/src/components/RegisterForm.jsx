import { Box, Typography, Grid, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from '@emotion/styled';

import FormInput from '../components/FormInput';
import useRegister from '../hooks/useRegister';
import { registerSchema, defaultValues } from '../utils/registerSchema';

const RegisterForm = () => {
	const methods = useForm({
		resolver: zodResolver(registerSchema),
		defaultValues,
	});

	const { mutate: register, isLoading } = useRegister();
	const navigate = useNavigate();

	const onHandleSubmit = async ({ username, email, password }) => {
		register(
			{ username, email, password },
			{
				onSuccess: () => {
					toast.success('Register successfully');
					methods.reset();
					navigate('/login');
				},
				onError: (error) => {
					toast.error(error.response.data.message);
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
				onSubmit={methods.handleSubmit(onHandleSubmit)}
				sx={{ mt: 2 }}
			>
				<Typography
					variant="h6"
					component="h1"
					sx={{ textAlign: 'center', mb: '1.5rem' }}
				>
					Welcome to Sticky Notes
				</Typography>
				<Grid container justifyContent="center">
					<Stack sx={{ textAlign: 'center', width: '100%' }}>
						<FormInput label="Username" type="text" name="username" required />
						<FormInput
							label="Enter your email"
							type="email"
							name="email"
							required
						/>
						<FormInput
							type="password"
							label="Password"
							name="password"
							required
						/>
						<FormInput
							type="password"
							label="Confirm password"
							name="passwordConfirm"
							required
						/>
					</Stack>
				</Grid>

				<LoadingButton
					fullWidth
					variant="contained"
					sx={{
						py: '0.6rem',
						mt: 2,
						width: '80%',
						marginInline: 'auto',
					}}
					type="submit"
					loading={isLoading}
				>
					Sign Up
				</LoadingButton>
			</Box>
		</FormProvider>
	);
};

export default RegisterForm;
