import {  useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  if (!isAuthenticated || user?.block) {
    return <Navigate to="/logIn" />;
  }

  if (user.role === "client" && window.location.pathname.startsWith("/client")) {
    return children;
  }

  if (user.role === "freelancer" && window.location.pathname.startsWith("/freelancer")) {
    return children;
  }

  return <Navigate to={user.role === "client" ? "/client/home" : "/freelancer/home"} />;
};


export const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  if (isAuthenticated && !user?.block) {
    if (user.role === "client") return <Navigate to="/client/home" />;
    if (user.role === "freelancer") return <Navigate to="/freelancer/home" />;
  }

  return children;
};


export const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, admin } = useSelector((state) => state.admin);

  if (!isAuthenticated || !admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export const AdminPublicRoute = ({ children }) => {
  const { isAuthenticated, admin } = useSelector((state) => state.admin);

  if (isAuthenticated && admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};
