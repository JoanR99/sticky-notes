import { Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useFilter } from '../context/FilterProvider';
import useGetColors from '../hooks/useGetColors';
import { Color } from '../types/Note';
import usePrivateRequest from '../hooks/usePrivateRequest';
import { useAuth } from '../context/AuthProvider';

const FilterByColor = () => {
	const { t, i18n } = useTranslation('translation');
	const { accessToken, changeAccessToken } = useAuth();
	const privateRequest = usePrivateRequest(
		accessToken,
		changeAccessToken,
		i18n.language
	);
	const { data: colors } = useGetColors(privateRequest, i18n.language);
	const { changeColorFilter, colorFilter } = useFilter();

	return (
		<FormControl sx={{ m: 1, minWidth: 80 }}>
			<InputLabel id="colors" sx={{ mr: 2 }}>
				Color
			</InputLabel>
			<Select
				label={t('labels.select_color')}
				labelId="colors"
				onChange={(e) => changeColorFilter(e.target.value)}
				value={colorFilter}
			>
				<MenuItem key={0} value="all">
					{t(`colors.all`)}
				</MenuItem>
				{colors?.map((color: Color) => (
					<MenuItem key={color.id} value={color.name}>
						<Box
							component="span"
							sx={{
								height: 20,
								width: 20,
								backgroundColor: color.hex,
								mr: 2,
								border: '1px solid black',
							}}
						></Box>
						{t(`colors.${color.name}`)}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default FilterByColor;
