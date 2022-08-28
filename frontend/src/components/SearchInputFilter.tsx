import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';

import { useFilter } from '../context/FilterProvider';

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: 2,
	backgroundColor: '#e8eaed',
	'&:hover': {
		backgroundColor: '#d8eaed',
	},
	color: 'black',
	marginLeft: 0,
	width: '100%',
	[theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(1),
		width: 'auto',
	},
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: '12ch',
			'&:focus': {
				width: '20ch',
			},
		},
	},
}));

const SearchInputFilter = () => {
	const { t } = useTranslation('translation');
	const { searchFilter, changeSearchFilter } = useFilter();
	return (
		<Search>
			<SearchIconWrapper>
				<SearchIcon />
			</SearchIconWrapper>
			<StyledInputBase
				placeholder={t('search.placeholder')}
				inputProps={{ 'aria-label': t('search.placeholder') }}
				value={searchFilter}
				onChange={(e) => changeSearchFilter(e.target.value)}
			/>
		</Search>
	);
};

export default SearchInputFilter;
