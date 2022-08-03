import React from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import { useAuth } from '../context/AuthProvider';
import { styled } from '@mui/material/styles';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';

const LinkItem = styled(Link)`
	text-decoration: none;
	color: #fffff;
	&:visited {
		color: #ffffff;
	}
`;

const Header = () => {
	const { accessToken } = useAuth();

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<Typography variant="h6" noWrap component="div">
						<LinkItem to="/">MUI</LinkItem>
					</Typography>
					<Box>{accessToken && <Logout />}</Box>
				</Toolbar>
			</AppBar>
		</Box>
	);
};

export default Header;
