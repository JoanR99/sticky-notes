import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useRefreshToken from '../hooks/useRefreshToken';
import { useAuth } from '../context/AuthProvider';
import FullScreenLoader from './FullScreenLoader';

const PersistLogin = () => {
	const refresh = useRefreshToken();
	const { auth } = useAuth();
	const persist = JSON.parse(localStorage.getItem('persist'));
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;
		const verifyRefreshToken = async () => {
			try {
				await refresh();
			} catch (e) {
				console.log(e);
			} finally {
				isMounted && setIsLoading(false);
			}
		};

		!auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

		return () => {
			isMounted = false;
		};
	}, []);

	return !persist ? <Outlet /> : isLoading ? <FullScreenLoader /> : <Outlet />;
};

export default PersistLogin;
