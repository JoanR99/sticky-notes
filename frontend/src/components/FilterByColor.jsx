import { Box, MenuItem, Select, InputLabel } from '@mui/material';
import { useFilter } from '../context/FilterProvider';
import useGetColors from '../hooks/useGetColors';

const FilterByColor = () => {
	const { colors, isLoading, error } = useGetColors();
	const { setColor, color } = useFilter();

	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<InputLabel id="colors" sx={{ mr: 2 }}>
				Filter by color
			</InputLabel>
			<Select
				label="Filter by color"
				labelId="colors"
				onChange={(e) => setColor(e.target.value)}
				value={color}
			>
				<MenuItem key={0} value="all">
					All
				</MenuItem>
				{colors?.map((color) => (
					<MenuItem key={color.id} value={color.name}>
						<Box
							component="span"
							sx={{
								height: 20,
								width: 20,
								backgroundColor: color.hex,
								mr: 2,
							}}
						></Box>
						{color.name}
					</MenuItem>
				))}
			</Select>
		</Box>
	);
};

export default FilterByColor;
