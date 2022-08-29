import { useState } from 'react';
import { Box, MenuItem, Select, IconButton, Menu } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';

const lngs = [
	{ code: 'en', nativeName: 'English' },
	{ code: 'es', nativeName: 'Español' },
];

const SelectLanguage = () => {
	const { i18n } = useTranslation('translation');
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const changeHandler = (language: string) => {
		i18n.changeLanguage(language);
		handleClose();
	};

	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<IconButton
				size="large"
				aria-label="account of current user"
				aria-controls="menu-user"
				aria-haspopup="true"
				onClick={handleMenu}
				color="inherit"
			>
				<LanguageIcon />
			</IconButton>
			<Menu
				id="menu-user"
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				keepMounted
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				{lngs?.map((lng) => (
					<MenuItem
						onClick={(e) => changeHandler(lng.code)}
						sx={{ color: '#000000' }}
					>
						{lng.nativeName}
					</MenuItem>
				))}
			</Menu>
		</Box>
	);
};

export default SelectLanguage;
