import { Box, MenuItem, Select, InputLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useFilter } from '../context/FilterProvider';
import useGetColors from '../hooks/useGetColors';
import { Color } from '../types/Note';
import usePrivateRequest from '../hooks/usePrivateRequest';
import { useAuth } from '../context/AuthProvider';

const FilterByColor = () => {
	const { t } = useTranslation('translation');
	const { accessToken, changeAccessToken } = useAuth();
	const privateRequest = usePrivateRequest(accessToken, changeAccessToken);
	const { data: colors } = useGetColors(privateRequest);
	const { changeColorFilter, colorFilter } = useFilter();

	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<InputLabel id="colors" sx={{ mr: 2 }}>
				{t('filter_color.action')}
			</InputLabel>
			<Select
				label="Filter by color"
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
		</Box>
	);
};

export default FilterByColor;
