import { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
	const [accessToken, setAccessToken] = useState('');

	return (
		<AuthContext.Provider value={{ accessToken, setAccessToken }}>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
