import axios from "axios";
import toast from "react-hot-toast";
import { toApiError } from "./api-error";

const api = axios.create({
  baseURL: "https://crm-backend-blush-one.vercel.app", //intentionally harcoded by me.
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

let redirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error);
    // a wrong password on the login form is not an expired session
    const isLoginRequest = error.config?.url === "/auth/login";

    if (apiError.status === 401 && !isLoginRequest && !redirecting) {
      redirecting = true;
      toast.error(apiError.message);
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/login");
    }

    return Promise.reject(apiError);
  },
);

export default api;
