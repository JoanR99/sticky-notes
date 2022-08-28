import { object, string } from 'zod';
import { useTranslation } from 'react-i18next';

export const registerSchema = () => {
	const { t } = useTranslation('translation');
	return object({
		username: string({
			required_error: t('validation.username.required'),
		})
			.min(1, t('validation.username.required'))
			.max(20, t('validation.username.max')),
		email: string({
			required_error: t('validation.email.required'),
		}).email(t('validation.email.invalid')),
		password: string({
			required_error: t('validation.password.required'),
		})
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%])/,
				t('validation.password.invalid')
			)
			.min(8, t('validation.password.min'))
			.max(24, t('validation.password.max')),
		passwordConfirm: string({
			required_error: t('validation.password_confirm.required'),
		}).min(1, t('validation.password_confirm.required')),
	}).refine((data) => data.password === data.passwordConfirm, {
		path: ['passwordConfirm'],
		message: t('validation.password.match'),
	});
};

export const defaultValues = {
	username: '',
	email: '',
	password: '',
	passwordConfirm: '',
};
