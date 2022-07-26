import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryHeader from '../components/SecondaryHeader';
import Container from '@mui/material/Container';
import { useAuth } from '../context/AuthProvider';

const Layout = () => {
	console.log('layout');
	const { auth } = useAuth();
	return (
		<>
			<Header />
			{auth?.accessToken && <SecondaryHeader />}

			<Container>
				<Outlet />
			</Container>
		</>
	);
};

export default Layout;
