import { AxiosInstance } from 'axios';
import { createContext, useContext } from 'react';

import usePrivateRequest from '../hooks/usePrivateRequest';
import { ProviderProps } from '../types/ProviderProps';

const voidFunction: unknown = () => {};

const RequestContext = createContext<AxiosInstance>(
	voidFunction as AxiosInstance
);

export const RequestProvider = ({ children }: ProviderProps) => {
	const privateRequest = usePrivateRequest();

	return (
		<RequestContext.Provider value={privateRequest}>
			{children}
		</RequestContext.Provider>
	);
};

export const useRequest = () => useContext(RequestContext);
