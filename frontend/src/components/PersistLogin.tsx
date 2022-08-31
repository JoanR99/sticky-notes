import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { getRefreshToken } from '../services/auth.services';
import { useAuth } from '../context/AuthProvider';
import FullScreenLoader from './FullScreenLoader';

const PersistLogin = () => {
	const { accessToken, changeAccessToken } = useAuth();
	const item: string | null = localStorage.getItem('persist');
	const persist = item ? JSON.parse(item) : '';
	const [isLoading, setIsLoading] = useState(true);
	const { i18n } = useTranslation();

	useEffect(() => {
		let isMounted = true;
		const verifyRefreshToken = async () => {
			try {
				const { accessToken: newAccessToken } = await getRefreshToken(
					i18n.language
				);
				console.log(newAccessToken);
				changeAccessToken(newAccessToken);
			} catch (e) {
				console.log(e);
			} finally {
				isMounted && setIsLoading(false);
			}
		};

		!accessToken ? verifyRefreshToken() : setIsLoading(false);

		return () => {
			isMounted = false;
		};
	}, []);

	return !persist ? <Outlet /> : isLoading ? <FullScreenLoader /> : <Outlet />;
};

export default PersistLogin;
