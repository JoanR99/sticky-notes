import { useMutation } from 'react-query';

import { logout } from '../services/auth.services';

const useLogout = () =>
	useMutation(async (undefined) => await logout(), {
		onSuccess: (data) => {
			localStorage.setItem('persist', JSON.stringify(false));
		},
	});

export default useLogout;
