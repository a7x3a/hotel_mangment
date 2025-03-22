import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/userContext";

const PublicRoute = () => {
  const { user } = useContext(UserContext);
  return user ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
