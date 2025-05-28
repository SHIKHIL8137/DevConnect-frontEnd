import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/userSlice";
import { logout as adminLogout } from "../../redux/slices/adminSlice";
import { useNavigate } from "react-router-dom";

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logout());
    dispatch(adminLogout());

    localStorage.removeItem("refreshToken");

    navigate("/login");
  }, [dispatch, navigate]);

  return <div>Logging out...</div>;
}

export default Logout;
