import { Outlet } from 'react-router-dom';
import Container from '@mui/material/Container';

import Header from '../components/Header';
import SecondaryHeader from '../components/SecondaryHeader';
import { useAuth } from '../context/AuthProvider';

const Layout = () => {
	console.log('layout');
	const { accessToken } = useAuth();
	return (
		<>
			<Header />
			{accessToken && <SecondaryHeader />}

			<Container>
				<Outlet />
			</Container>
		</>
	);
};

export default Layout;
