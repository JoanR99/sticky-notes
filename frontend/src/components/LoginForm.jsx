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
import useLogin from '../hooks/useLogin';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../components/FormInput';
import { loginSchema, defaultValues } from '../utils/loginSchema';

const LoginForm = () => {
	const { mutate: login, isLoading } = useLogin();

	const { setAccessToken } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || '/';

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
					setAccessToken(accessToken);
					localStorage.setItem('persist', JSON.stringify(persist));
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
							required
						/>
						<FormInput
							type="password"
							label="Password"
							name="password"
							required
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
		</FormProvider>
	);
};

export default LoginForm;
