import { useContext } from "react";
import { UserContext } from "../context/UserProvider";

const useUserAuth = () => {
  return useContext(UserContext);
};

export default useUserAuth;
