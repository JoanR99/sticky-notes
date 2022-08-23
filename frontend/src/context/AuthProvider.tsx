import { createContext, useContext, useState } from 'react';

import { ProviderProps } from '../types/ProviderProps';

interface AuthContext {
	accessToken: string;
	changeAccessToken: (token: string) => void;
}

const INITIAL_STATE: AuthContext = {
	accessToken: '',
	changeAccessToken: () => {},
};

const AuthContext = createContext(INITIAL_STATE);

export const AuthProvider = ({ children }: ProviderProps) => {
	const [accessToken, setAccessToken] = useState('');

	const changeAccessToken = (token: string) => setAccessToken(token);

	return (
		<AuthContext.Provider value={{ accessToken, changeAccessToken }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
