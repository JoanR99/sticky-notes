import { useMutation } from 'react-query';

import { login } from '../services/auth.services';
import { LoginCredentials } from '../types/Auth';

const useLogin = (language: string) =>
	useMutation(
		async (credentials: LoginCredentials) => await login(credentials, language)
	);

export default useLogin;
