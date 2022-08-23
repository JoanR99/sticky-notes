import { useMutation } from 'react-query';

import { login } from '../services/auth.services';
import { LoginCredentials } from '../types/Auth';

const useLogin = () =>
	useMutation(
		async (credentials: LoginCredentials) => await login(credentials)
	);

export default useLogin;
