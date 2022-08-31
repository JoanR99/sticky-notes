import { useMutation } from 'react-query';

import { logout } from '../services/auth.services';

const useLogout = (language: string) =>
	useMutation(async (undefined) => await logout(language), {
		onSuccess: (data) => {
			localStorage.setItem('persist', JSON.stringify(false));
		},
	});

export default useLogout;
