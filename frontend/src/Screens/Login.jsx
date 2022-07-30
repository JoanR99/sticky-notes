import { Box, Typography, Grid, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import styled from '@emotion/styled';

export const LinkItem = styled(Link)`
	text-decoration: none;
	color: #3683dc;
	background-color: #00000;
	&:hover {
		text-decoration: underline;
		color: #5ea1b6;
	}
`;

const Login = () => {
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
							Need an account? <LinkItem to="/register">Sign up here</LinkItem>
						</Typography>
					</Stack>
				</Grid>
			</Box>
		</Box>
	);
};

export default Login;
