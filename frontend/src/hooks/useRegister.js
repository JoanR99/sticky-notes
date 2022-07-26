import { useMutation } from 'react-query';
import { register } from '../services/auth.services';

const useRegister = () =>
	useMutation(async (credentials) => await register(credentials));

export default useRegister;
