import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';

import Logout from './Logout';
import { useAuth } from '../context/AuthProvider';

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
