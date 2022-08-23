import { useFormContext, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import { styled } from '@mui/material';

// 👇 Styled Material UI TextField Component
const CssTextField = styled(TextField)({
	'& label.Mui-focused': {
		color: '#5e5b5d',
		fontWeight: 400,
	},
	'& .MuiInputBase-input': {
		borderColor: '#c8d0d4',
	},
	'& .MuiInput-underline:after': {
		border: 'none',
	},
	'& .MuiOutlinedInput-root': {
		'&.Mui-error': {
			'& .MuiOutlinedInput-notchedOutline': {
				borderColor: '#d32f2f',
			},
		},
		'& fieldset': {
			borderColor: '#c8d0d4',
			borderRadius: 0,
		},
		'&:hover fieldset': {
			border: '1px solid #c8d0d4',
		},
		'&.Mui-focused fieldset': {
			border: '1px solid #c8d0d4',
		},
	},
});

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
				<CssTextField
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
