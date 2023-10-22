import axios from "axios";
import { encryptToken, decryptToken } from "../components/Utility/AESLogic";

const BASE_URL = "https://closeconnect.azurewebsites.net";

export default axios.create({
  baseURL: BASE_URL,
});

const secretKey = "Amlan@123456789";

const encryptedAccessToken = localStorage?.getItem("accessToken");
const encryptedRefreshToken = localStorage?.getItem("refreshToken");

let decryptedAccessToken = "";
let decryptedRefreshToken = "";

if (encryptedAccessToken != null) {
  decryptedAccessToken = decryptToken(encryptedAccessToken, secretKey);
}

if (encryptedRefreshToken != null) {
  decryptedRefreshToken = decryptToken(encryptedRefreshToken, secretKey);
}

// let decryptedAccessToken = AES.decrypt(
//   encryptedAccessToken,
//   secretKey
// ).toString(enc.Utf8); //decryptToken(encryptedAccessToken, secretKey);
// let decryptedRefreshToken = AES.decrypt(
//   encryptedRefreshToken,
//   secretKey
// ).toString(enc.Utf8); //decryptToken(encryptedRefreshToken, secretKey);

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${decryptToken(
      localStorage?.getItem("accessToken"),
      secretKey
    )}`,
  },
  withCredentials: true,
});

let isTokenRefreshing = false;
const refreshQueue = [];

const enqueueTokenRefresh = () => {
  return new Promise((resolve, reject) => {
    refreshQueue.push({ resolve, reject });
  });
};

const processTokenRefreshQueue = (newToken) => {
  refreshQueue.forEach((request) => {
    request.resolve(newToken);
  });
  refreshQueue.length = 0; // Clear the queue
};

axiosPrivate.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.log(error);

    if (error.response.status === 403 && !originalRequest._retry) {
      console.log("403 forbidden");
      originalRequest._retry = true;

      if (!isTokenRefreshing) {
        isTokenRefreshing = true;

        try {
          // Call your backend API to refresh the token
          const refreshResponse = await axios.post(
            "https://closeconnect.azurewebsites.net/api/auth/RefreshToken",
            {
              Token: decryptToken(
                localStorage?.getItem("accessToken"),
                secretKey
              ),
              RefreshToken: decryptToken(
                localStorage?.getItem("refreshToken"),
                secretKey
              ),
            }
          );

          console.log(refreshResponse);

          if (refreshResponse.data.token.trim() !== "") {
            // Update the access token in localStorage
            const accessToken = refreshResponse.data.token;
            const encryptedAccessToken = encryptToken(accessToken, secretKey);

            // console.log(
            //   `new access token received: ${refreshResponse.data.token}`
            // );
            // console.log(
            //   `new refresh token received: ${refreshResponse.data.refreshToken}`
            // );

            localStorage.setItem("accessToken", encryptedAccessToken);

            const newAccessToken = localStorage?.getItem("accessToken");

            const refreshToken = refreshResponse.data.refreshToken;
            const encryptedRefreshToken = encryptToken(refreshToken, secretKey);

            // console.log(`encryptedAccessToken: ${encryptedAccessToken}`);
            // console.log(`encryptedRefreshToken: ${encryptedRefreshToken}`);

            localStorage.setItem("refreshToken", encryptedRefreshToken);

            // console.log(
            //   `encryptedAccessToken in localstorage: ${newAccessToken}`
            // );
            // console.log(
            //   `encryptedRefreshToken in localstorage: ${localStorage?.getItem(
            //     "refreshToken"
            //   )}`
            // );

            // Process the token refresh queue with the new access token
            processTokenRefreshQueue(newAccessToken);

            // Retry the original request with the new access token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosPrivate(originalRequest);
          }
        } catch (refreshError) {
          // Handle token refresh error, e.g., redirect to login page
          // You can also reject the token refresh queue promises here if needed
          // or clear the token and log out the user
          console.log(refreshError);
        } finally {
          isTokenRefreshing = false;
        }
      } else {
        // If token refresh is already in progress, enqueue the request and wait
        try {
          const newToken = await enqueueTokenRefresh();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosPrivate(originalRequest);
        } catch (enqueueError) {
          // Handle enqueue error, e.g., redirect to login page
          // or clear the token and log out the user
          console.log(enqueueError);
        }
      }
    }

    return Promise.reject(error);
  }
);
