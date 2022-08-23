import { useQueryClient } from 'react-query';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth } from '../context/AuthProvider';
import useLogout from '../hooks/useLogout';
import { AxiosError } from 'axios';

const Logout = () => {
	const { logoutUser, isLoading } = useLogout();
	const navigate = useNavigate();
	const { changeAccessToken } = useAuth();
	const queryClient = useQueryClient();

	const handleClick = () => {
		//Pass undefined because mutate requires some kind of variable to add additional options even when not needed
		logoutUser(undefined, {
			onSuccess: (data) => {
				changeAccessToken('');
				toast.success('Logout successfully');
				queryClient.clear();
				navigate('/login');
			},
			onError: (error) => {
				if (error instanceof AxiosError)
					toast.error(error.response?.data.message, {
						position: 'top-right',
					});
			},
		});
	};

	return (
		<LoadingButton
			sx={{ color: '#ffff' }}
			onClick={handleClick}
			loading={isLoading}
		>
			Logout
		</LoadingButton>
	);
};

export default Logout;
