import { jwtDecode } from "jwt-decode";

export const verifiedUser = () => {
  const accessToken = localStorage.getItem("accessToken");
  let userData = null;
  if (accessToken) {
    userData = jwtDecode(accessToken);
  }

  return userData;
};
