import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";

const roles = [
  {
    role: "admin",
    code: "A",
  },
  {
    role: "user",
    code: "C",
  },
  {
    role: "expert",
    code: "E",
  },
];

const useAuthentication = () => {
  const token = Cookies.get("token");
  const role = Cookies.get("role");
  const location = useLocation().pathname.split("/")[1];
  const navigate = useNavigate();

  const roleObj = roles.filter(role => role.role === location);
  if (roleObj.length > 0 && roleObj[0].code !== role) {
      navigate("/");
      return false;
  }

  if (token) {
    return true;
  } else {
    navigate("/");
    return false;
  }
};

export default useAuthentication;
