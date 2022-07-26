import React from 'react';
import { Box, Typography, Grid, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string, boolean } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../components/FormInput';
import useRegister from '../hooks/useRegister';
import { useNavigate, Link } from 'react-router-dom';

import { toast } from 'react-toastify';
import styled from '@emotion/styled';

export const LinkItem = styled(Link)`
	text-decoration: none;
	color: #3683dc;
	background-color: #00000;
	&:hover {
		text-decoration: underline;
		color: #5ea1b6;
	}
`;

const registerSchema = object({
	username: string().nonempty('Username is required').max(20),
	email: string()
		.nonempty('Email address is required')
		.email('Email Address is invalid'),
	password: string()
		.nonempty('Password is required')
		.min(8, 'Password must be more than 8 characters')
		.max(32, 'Password must be less than 32 characters'),
	passwordConfirm: string().nonempty('Please confirm your password'),
}).refine((data) => data.password === data.passwordConfirm, {
	path: ['passwordConfirm'],
	message: 'Password do not match',
});

const Register = () => {
	const defaultValues = {
		username: '',
		email: '',
		password: '',
		passwordConfirm: '',
	};

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
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			sx={{ width: '100%', height: '100%', backgroundColor: '#fff', mt: 2 }}
		>
			<Box
				sx={{
					maxWidth: '30rem',
					width: '100%',
					backgroundColor: '#fff',
					mt: 2,
				}}
			>
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
								<FormInput
									label="Username"
									type="text"
									name="username"
									focused
									required
								/>
								<FormInput
									label="Enter your email"
									type="email"
									name="email"
									focused
									required
								/>
								<FormInput
									type="password"
									label="Password"
									name="password"
									required
									focused
								/>
								<FormInput
									type="password"
									label="Confirm password"
									name="passwordConfirm"
									required
									focused
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
					<Grid container justifyContent="center" sx={{ mt: 2 }}>
						<Stack sx={{ textAlign: 'center' }}>
							<Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
								Already have an account? <LinkItem to="/login">Login</LinkItem>
							</Typography>
						</Stack>
					</Grid>
				</FormProvider>
			</Box>
		</Box>
	);
};

export default Register;
