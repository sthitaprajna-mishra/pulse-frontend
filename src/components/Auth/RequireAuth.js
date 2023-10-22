import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  //   console.log(`auth?.loginid: ${auth?.loginid}`);

  console.log(`auth?.roleIds: ${auth?.roleIds}`);
  console.log(
    `auth?.roleIds?.find((role) => allowedRoles?.includes(role)): ${auth?.roleIds?.find(
      (role) => allowedRoles?.includes(role)
    )}`
  );

  return auth?.roleIds?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.login ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
