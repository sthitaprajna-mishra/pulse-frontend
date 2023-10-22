import axios from "../api/axios";
import useAuth from "./useAuth";

const REFRESH_URL = "/api/auth/RefreshToken";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    console.log(auth);
    const response = await axios.post(REFRESH_URL, {
      Token: auth?.accessToken,
      RefreshToken: auth?.refreshToken,
    });

    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data);
      return {
        ...prev,
        roleIds: response.data?.roleIds,
        accessToken: response.data?.token,
        refreshToken: response.data?.refreshToken,
      };
    });

    return response.data?.refreshToken; // return response.data?.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
