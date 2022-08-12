import { createContext, useContext } from 'react';

import usePrivateRequest from '../hooks/usePrivateRequest';

const RequestContext = createContext(() => {});

const RequestProvider = ({ children }) => {
	const privateRequest = usePrivateRequest();

	return (
		<RequestContext.Provider value={privateRequest}>
			{children}
		</RequestContext.Provider>
	);
};

const useRequest = () => useContext(RequestContext);

export { RequestProvider, useRequest };
