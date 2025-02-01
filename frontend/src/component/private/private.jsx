import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie'; 

const PrivateRoute = () => {
    const permanentId = Cookies.get("permanentId");

  return permanentId ?  <Outlet /> :<Navigate to="/sign-in" replace /> ;
};

export default PrivateRoute;
