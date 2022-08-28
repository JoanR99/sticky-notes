import { useQueryClient } from 'react-query';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../context/AuthProvider';
import useLogout from '../hooks/useLogout';
import { AxiosError } from 'axios';

const Logout = () => {
	const { t } = useTranslation('translation');
	const { mutate: logoutUser, isLoading } = useLogout();
	const navigate = useNavigate();
	const { changeAccessToken } = useAuth();
	const queryClient = useQueryClient();

	const handleClick = () => {
		//Pass undefined because mutate requires some kind of variable to add additional options even when not needed
		logoutUser(undefined, {
			onSuccess: (data) => {
				changeAccessToken('');
				toast.success(t('logout.success'));
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
			variant="outlined"
			sx={{ color: '#ffffff', border: 'solid 1px #ffffff' }}
			onClick={handleClick}
			loading={isLoading}
		>
			{t('logout.action')}
		</LoadingButton>
	);
};

export default Logout;
