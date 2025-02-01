import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRouteSignup = () => {
    const permanentId = Cookies.get("permanentId");

    return permanentId ?<Navigate to="/" replace />: <Outlet /> ;
};

export default PrivateRouteSignup;
