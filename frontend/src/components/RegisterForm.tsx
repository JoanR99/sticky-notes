import { Box, Typography, Grid, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import FormInput from '../components/FormInput';
import useRegister from '../hooks/useRegister';
import { registerSchema, defaultValues } from '../utils/registerSchema';
import { RegisterCredentials } from '../types/Auth';
import { AxiosError } from 'axios';

const RegisterForm = () => {
	const { t, i18n } = useTranslation('translation');

	const methods = useForm({
		resolver: zodResolver(registerSchema()),
		defaultValues,
	});

	const { mutate: register, isLoading } = useRegister(i18n.language);
	const navigate = useNavigate();

	const onHandleSubmit = async ({
		username,
		email,
		password,
	}: RegisterCredentials) => {
		register(
			{ username, email, password },
			{
				onSuccess: () => {
					toast.success(t('signUp.success'));
					methods.reset();
					navigate('/login');
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
				onSubmit={methods.handleSubmit(onHandleSubmit)}
				sx={{ mt: 2 }}
			>
				<Typography
					variant="h6"
					component="h1"
					sx={{ textAlign: 'center', mb: '1.5rem' }}
				>
					{t('signUp.title')}
				</Typography>
				<Grid container justifyContent="center">
					<Stack sx={{ textAlign: 'center', width: '100%' }}>
						<FormInput
							label={t('labels.username')}
							type="text"
							name="username"
							required
						/>
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
						<FormInput
							type="password"
							label={t('labels.confirm_password')}
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
					{t('signUp.actions.register')}
				</LoadingButton>
			</Box>
		</FormProvider>
	);
};

export default RegisterForm;
