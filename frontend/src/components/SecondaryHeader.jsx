import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';

import FilterByColor from './FilterByColor';
import SearchInputFilter from './SearchInputFilter';

const LinkItem = styled(Link)`
	text-decoration: none;
	color: #000000;
	&:visited {
		color: #000000;
	}
`;

const SecondaryHeader = () => {
	const notesLocation = useLocation().pathname === '/' ? true : false;

	return (
		<Box sx={{ flexGrow: 1, mb: 2 }}>
			<AppBar position="static" sx={{ backgroundColor: '#ffffff' }}>
				<Toolbar
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<Typography
						variant="h5"
						noWrap
						component="div"
						sx={{ color: '#000000' }}
					>
						{notesLocation ? 'My Notes' : 'Archived Notes'}
					</Typography>

					<FilterByColor />

					<SearchInputFilter />

					<Typography variant="h6" noWrap component="div">
						{notesLocation ? (
							<LinkItem to="/archived">Archived Notes</LinkItem>
						) : (
							<LinkItem to="/">My Notes</LinkItem>
						)}
					</Typography>
				</Toolbar>
			</AppBar>
		</Box>
	);
};

export default SecondaryHeader;
