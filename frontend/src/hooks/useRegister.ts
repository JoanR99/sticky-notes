import { useMutation } from 'react-query';

import { register } from '../services/auth.services';
import { RegisterCredentials } from '../types/Auth';

const useRegister = () =>
	useMutation(
		async (credentials: RegisterCredentials) => await register(credentials)
	);

export default useRegister;
