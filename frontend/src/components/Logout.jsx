import { useQueryClient } from 'react-query';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { toast } from 'react-toastify';
import useLogout from '../hooks/useLogout';

const Logout = () => {
	const { logoutUser, isLoading } = useLogout();
	const navigate = useNavigate();
	const { setAccessToken } = useAuth();
	const queryClient = useQueryClient();

	const handleClick = () => {
		logoutUser(null, {
			onSuccess: (data) => {
				setAccessToken('');
				toast.success('Logout successfuly');
				queryClient.clear();
				navigate('/login');
			},
			onError: (error) => {
				toast.error(error.response.data.message, {
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
