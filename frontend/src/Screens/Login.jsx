import { useEffect } from 'react';
import {
	Box,
	Typography,
	FormControlLabel,
	Checkbox,
	Grid,
	Stack,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string, boolean } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../components/FormInput';
import useLogin from '../hooks/useLogin';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useToggle from '../hooks/useToggle';
import { useAuth } from '../context/AuthProvider';
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

const loginSchema = object({
	email: string()
		.min(1, 'Email address is required')
		.email('Email Address is invalid'),
	password: string()
		.min(1, 'Password is required')
		.min(8, 'Password must be more than 8 characters')
		.max(32, 'Password must be less than 32 characters'),
	persist: boolean(),
});

const Login = () => {
	const { mutate: login, isLoading } = useLogin();

	const [check, toggleCheck] = useToggle('persist');

	const { setAuth } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || '/';

	const defaultValues = {
		email: '',
		password: '',
		persist: false,
	};

	const methods = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues,
	});

	const { reset, handleSubmit } = methods;

	const onHandleSubmit = async ({ email, password, persist }) => {
		login(
			{ email, password },
			{
				onSuccess: ({ accessToken }) => {
					setAuth({ email, accessToken });
					toggleCheck(persist);
					reset();
					navigate(from, { replace: true });
					toast.success('You successfully logged in');
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
			sx={{ width: '100%', height: '100%', mt: 2 }}
		>
			<Box
				sx={{
					maxWidth: '35rem',
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
						onSubmit={handleSubmit(onHandleSubmit)}
						sx={{ mt: 2 }}
					>
						<Typography
							variant="h6"
							component="h1"
							sx={{ textAlign: 'center', mb: '1.5rem' }}
						>
							Log into your account
						</Typography>
						<Grid container justifyContent="center">
							<Stack
								sx={{
									textAlign: 'center',
									width: '100%',
								}}
							>
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

								<FormControlLabel
									control={
										<Checkbox
											size="small"
											aria-label="trust this device checkbox"
											required
											{...methods.register('persist')}
										/>
									}
									label={
										<Typography
											variant="body2"
											sx={{
												fontSize: '0.8rem',
												fontWeight: 400,
												color: '#5e5b5d',
											}}
										>
											Trust this device
										</Typography>
									}
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
							Login
						</LoadingButton>
					</Box>
					<Grid container justifyContent="center" sx={{ mt: 2 }}>
						<Stack sx={{ textAlign: 'center' }}>
							<Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
								Need an account?{' '}
								<LinkItem to="/register">Sign up here</LinkItem>
							</Typography>
						</Stack>
					</Grid>
				</FormProvider>
			</Box>
		</Box>
	);
};

export default Login;
