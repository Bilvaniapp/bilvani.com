import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const NotLoginPrivateAdmin = () => {
    const token = Cookies.get("token");

    // If no token is found, redirect to the login page
    return token ? <Outlet /> : <Navigate to="/admin-bilvani" replace />;
};

export default NotLoginPrivateAdmin;
