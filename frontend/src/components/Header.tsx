import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';

import i18n from '../locales/i18n';
import Logout from './Logout';
import { useAuth } from '../context/AuthProvider';

const LinkItem = styled(Link)`
	text-decoration: none;
	color: #fffff;
	&:visited {
		color: #ffffff;
	}
`;

const lngs = [
	{ code: 'en', nativeName: 'English' },
	{ code: 'es', nativeName: 'Español' },
];

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
						<LinkItem to="/">Sticky Notes</LinkItem>
					</Typography>

					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Box sx={{ mr: 2 }}>
							<div>
								{lngs.map((lng) => {
									return (
										<button
											className="m-4 p-2 bg-blue-600 rounded"
											key={lng.code}
											type="submit"
											onClick={() => i18n.changeLanguage(lng.code)}
										>
											{lng.nativeName}
										</button>
									);
								})}
							</div>
						</Box>
						<Box>{accessToken && <Logout />}</Box>
					</Box>
				</Toolbar>
			</AppBar>
		</Box>
	);
};

export default Header;
