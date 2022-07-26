import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const RequireAuth = () => {
	const { auth } = useAuth();
	console.log(auth?.accessToken);
	const location = useLocation();

	return auth?.accessToken ? (
		<Outlet />
	) : (
		<Navigate to="/login" state={{ from: location }} replace />
	);
};

export default RequireAuth;
