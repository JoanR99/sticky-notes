import { useEffect } from 'react';

import { privateRequest } from '../services/baseRequest';
import { getRefreshToken } from '../services/auth.services';

const usePrivateRequest = (
	accessToken: string,
	changeAccessToken: (token: string) => void
) => {
	useEffect(() => {
		const requestIntercept = privateRequest.interceptors.request.use(
			(config) => {
				if (config.headers) {
					if (!config.headers['Authorization']) {
						config.headers['Authorization'] = `Bearer ${accessToken}`;
					}
				}

				return config;
			},
			(error) => Promise.reject(error)
		);

		const responseIntercept = privateRequest.interceptors.response.use(
			(response) => response,
			async (error) => {
				const prevRequest = error?.config;
				if (error?.response?.status === 403 && !prevRequest?.sent) {
					prevRequest.sent = true;
					console.log('intercept');
					const { accessToken: newAccessToken } = await getRefreshToken();
					changeAccessToken(newAccessToken);
					prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

					return privateRequest(prevRequest);
				}
				return Promise.reject(error);
			}
		);

		return () => {
			privateRequest.interceptors.request.eject(requestIntercept);
			privateRequest.interceptors.response.eject(responseIntercept);
		};
	}, [accessToken]);

	return privateRequest;
};

export default usePrivateRequest;
