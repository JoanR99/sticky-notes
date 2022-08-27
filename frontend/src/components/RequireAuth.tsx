import { useLocation, Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthProvider';

const RequireAuth = () => {
	const { accessToken } = useAuth();
	const location = useLocation();

	return accessToken ? (
		<Outlet />
	) : (
		<Navigate to="/login" state={{ from: location }} replace />
	);
};

export default RequireAuth;
