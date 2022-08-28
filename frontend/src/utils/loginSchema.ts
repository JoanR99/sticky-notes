import { object, string, boolean } from 'zod';
import { useTranslation } from 'react-i18next';

export const loginSchema = () => {
	const { t } = useTranslation('translation');

	return object({
		email: string({
			required_error: t('validation.email.required'),
		})
			.min(1, t('validation.email.required'))
			.email(t('validation.email.invalid')),
		password: string({
			required_error: t('validation.password.required'),
		}).min(1, t('validation.password.required')),
		persist: boolean(),
	});
};

export const defaultValues = {
	email: '',
	password: '',
	persist: false,
};
