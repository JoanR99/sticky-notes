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
import { useNavigate, useLocation, Location } from 'react-router-dom';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import FormInput from '../components/FormInput';
import { loginSchema, defaultValues } from '../utils/loginSchema';
import useLogin from '../hooks/useLogin';
import { useAuth } from '../context/AuthProvider';
import { AxiosError } from 'axios';

const LoginForm = () => {
	const { t, i18n } = useTranslation('translation');
	const { mutate: login, isLoading } = useLogin(i18n.language);

	interface OwnLocation extends Location {
		state: {
			from?: {
				pathname?: string;
			};
		};
	}

	const { changeAccessToken } = useAuth();
	const navigate = useNavigate();
	const location = useLocation() as OwnLocation;
	const from = location.state?.from?.pathname || '/';

	const methods = useForm({
		resolver: zodResolver(loginSchema()),
		defaultValues,
	});

	const { reset, handleSubmit } = methods;

	const onHandleSubmit = async ({
		email,
		password,
		persist,
	}: {
		email: string;
		password: string;
		persist: boolean;
	}) => {
		login(
			{ email, password },
			{
				onSuccess: ({ accessToken }) => {
					changeAccessToken(accessToken);
					localStorage.setItem('persist', JSON.stringify(persist));
					reset();
					navigate(from, { replace: true });
					toast.success(t('login.success'));
				},
				onError: (error) => {
					if (error instanceof AxiosError)
						toast.error(error.response?.data.message);
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
					{t('login.title')}
				</Typography>
				<Grid container justifyContent="center">
					<Stack
						sx={{
							textAlign: 'center',
							width: '100%',
						}}
					>
						<FormInput
							label={t('labels.email')}
							type="email"
							name="email"
							required
						/>
						<FormInput
							type="password"
							label={t('labels.password')}
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
									{t('labels.trust')}
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
					{t('login.actions.login')}
				</LoadingButton>
			</Box>
		</FormProvider>
	);
};

export default LoginForm;
