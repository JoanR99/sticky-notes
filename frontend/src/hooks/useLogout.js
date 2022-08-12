import { useMutation } from 'react-query';

import { logout } from '../services/auth.services';

const useLogout = () => {
	const { mutate: logoutUser, isLoading } = useMutation(
		async () => await logout(),
		{
			onSuccess: (data) => {
				localStorage.setItem('persist', JSON.stringify(false));
			},
		}
	);

	return {
		logoutUser,
		isLoading,
	};
};

export default useLogout;
