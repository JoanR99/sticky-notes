import { createContext, useContext } from 'react';
import usePrivateRequest from '../hooks/usePrivateRequest';

const RequestContext = createContext(() => {});

export const RequestProvider = ({ children }) => {
	const privateRequest = usePrivateRequest();

	return (
		<RequestContext.Provider value={privateRequest}>
			{children}
		</RequestContext.Provider>
	);
};

export const useRequest = () => useContext(RequestContext);
