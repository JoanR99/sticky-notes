import { useMutation } from 'react-query';
import { logout } from '../services/auth.services';

const useLogout = () => {
	const { mutate: logoutUser, isLoading } = useMutation(
		async () => await logout()
	);

	return {
		logoutUser,
		isLoading,
	};
};

export default useLogout;
