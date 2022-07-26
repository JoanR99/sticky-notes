import { refreshAccessTokenFn } from '../services/baseRequest';
import { useAuth } from '../context/AuthProvider';

const useRefreshToken = () => {
	const { setAuth } = useAuth();

	const refresh = async () => {
		const { accessToken } = await refreshAccessTokenFn();
		setAuth((prev) => ({ ...prev, accessToken }));
		return accessToken;
	};

	return refresh;
};

export default useRefreshToken;
