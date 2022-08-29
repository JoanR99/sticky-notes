import { Box, Grid, Stack, Button, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FormInput from './FormInput';
import SelectInput from './SelectInput';
import { Color } from '../types/Note';

interface Props {
	handleClose: () => void;
	onHandleSubmit: () => void;
	methods: UseFormReturn<
		{
			title: string;
			content: string;
			color: number;
		},
		any
	>;
	colors: Color[];
	isLoading: boolean;
	buttonDesc: string;
}

const NoteForm = ({
	handleClose,
	methods,
	onHandleSubmit,
	colors,
	isLoading,
	buttonDesc,
}: Props) => {
	const { t } = useTranslation('translation');

	return (
		<FormProvider {...methods}>
			<Box
				display="flex"
				flexDirection="column"
				component="form"
				noValidate
				autoComplete="off"
				onSubmit={onHandleSubmit}
				sx={{ mt: 2 }}
			>
				<Grid container justifyContent="center">
					<Stack sx={{ textAlign: 'center', width: '80%', mb: 2 }}>
						<FormInput
							label={t('labels.title')}
							type="text"
							name="title"
							required
						/>
						<FormInput
							type="text"
							multiline
							rows={4}
							label={t('labels.content')}
							name="content"
							required
						/>

						<SelectInput
							id="color"
							name="color"
							label={t('labels.color')}
							required
						>
							{colors?.map((color) => {
								return (
									<MenuItem key={color.id} value={color.id}>
										<Box
											component="span"
											sx={{
												height: 20,
												width: 20,
												backgroundColor: color.hex,
												mr: 2,
											}}
										></Box>
										{t(`colors.${color.name}`)}
									</MenuItem>
								);
							})}
						</SelectInput>
					</Stack>
				</Grid>

				<Stack direction="row" spacing={2} sx={{ ml: 'auto' }}>
					<Button variant="contained" color="error" onClick={handleClose}>
						{t('actions.cancel')}
					</Button>

					<LoadingButton
						fullWidth
						variant="contained"
						type="submit"
						loading={isLoading}
						sx={{ width: '100px' }}
					>
						{t(`actions.${buttonDesc}`)}
					</LoadingButton>
				</Stack>
			</Box>
		</FormProvider>
	);
};

export default NoteForm;
