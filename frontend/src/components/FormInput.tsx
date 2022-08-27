import { useFormContext, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

const FormInput = ({
	name,
	...otherProps
}: {
	name: string;
	type: string;
	label: string;
	required: boolean;
	multiline?: boolean;
	rows?: number;
}) => {
	const {
		control,
		formState: { errors },
	} = useFormContext();

	return (
		<Controller
			control={control}
			name={name}
			defaultValue=""
			render={({ field }) => (
				<TextField
					{...field}
					{...otherProps}
					variant="outlined"
					sx={{ mb: '1.5rem' }}
					error={!!errors[name]}
					helperText={errors[name] ? (errors[name]?.message as string) : ''}
				/>
			)}
		/>
	);
};

export default FormInput;
