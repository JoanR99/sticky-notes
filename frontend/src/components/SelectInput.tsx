import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Controller, useFormContext } from 'react-hook-form';

interface Props {
	id: string;
	name: string;
	label: string;
	defaultValue?: string;
	required: boolean;
	children: React.ReactNode;
}

const SelectInput = ({
	name,
	label,
	defaultValue,
	children,
	...props
}: Props) => {
	const labelId = `${name}-label`;
	const { control } = useFormContext();

	return (
		<FormControl {...props}>
			<InputLabel id={labelId}>{label}</InputLabel>
			<Controller
				render={({ field }) => (
					<Select {...field} {...props} labelId={labelId} label={label}>
						{children}
					</Select>
				)}
				name={name}
				control={control}
				defaultValue={defaultValue}
			/>
		</FormControl>
	);
};
export default SelectInput;
