import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const AdminRouteSingup = () => {
    const token = Cookies.get("token");

    return token ?<Navigate to="/admin-dashboard" replace />: <Outlet /> ;
};

export default AdminRouteSingup;
