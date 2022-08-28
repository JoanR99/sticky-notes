import { Box, Typography, Grid, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

import LoginForm from '../components/LoginForm';

const LinkItem = styled(Link)`
	text-decoration: none;
	color: #3683dc;
	background-color: #00000;
	&:hover {
		text-decoration: underline;
		color: #5ea1b6;
	}
`;

const Login = () => {
	const { t } = useTranslation('translation');

	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			sx={{ width: '100%', height: '100%', mt: 2 }}
		>
			<Box
				sx={{
					maxWidth: '35rem',
					width: '100%',
					backgroundColor: '#fff',
					mt: 2,
				}}
			>
				<LoginForm />
				<Grid container justifyContent="center" sx={{ mt: 2 }}>
					<Stack sx={{ textAlign: 'center' }}>
						<Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
							{t('login.action_call')}{' '}
							<LinkItem to="/register">{t('login.actions.register')}</LinkItem>
						</Typography>
					</Stack>
				</Grid>
			</Box>
		</Box>
	);
};

export default Login;
