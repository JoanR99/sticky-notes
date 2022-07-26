import { useMutation } from 'react-query';
import { login } from '../services/auth.services';

const useLogin = () =>
	useMutation(async (credentials) => await login(credentials));

export default useLogin;
