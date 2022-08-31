import { useMutation } from 'react-query';

import { register } from '../services/auth.services';
import { RegisterCredentials } from '../types/Auth';

const useRegister = (language: string) =>
	useMutation(
		async (credentials: RegisterCredentials) =>
			await register(credentials, language)
	);

export default useRegister;
