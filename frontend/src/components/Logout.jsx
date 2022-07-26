import useLogout from '../hooks/useLogout';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { toast } from 'react-toastify';

const Logout = () => {
	const { logoutUser, isLoading } = useLogout();
	const navigate = useNavigate();
	const { setAuth } = useAuth();

	const handleClick = () => {
		logoutUser(null, {
			onSuccess: (data) => {
				setAuth((prev) => ({ ...prev, email: '', accessToken: '' }));
				toast.success('Logout successfuly');
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
