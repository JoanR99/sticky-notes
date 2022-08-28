import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';

import { AuthProvider } from './context/AuthProvider';
import { FilterProvider } from './context/FilterProvider';
import './locales/i18n';
import App from './App';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			retry: 1,
			staleTime: 5 * 1000,
		},
	},
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<FilterProvider>
					<Router>
						<Routes>
							<Route path="/*" element={<App />} />
						</Routes>
					</Router>
				</FilterProvider>
			</AuthProvider>
		</QueryClientProvider>
	</React.StrictMode>
);
