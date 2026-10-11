import axios from "axios";
import toast from "react-hot-toast";
import { toApiError } from "./api-error";

// One Axios instance for the whole app.
// withCredentials lets the browser send the httpOnly sessionId cookie.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://crm-backend-blush-one.vercel.app",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

let redirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error);
    const isLoginRequest = error.config?.url === "/auth/login";

    // Not logged in or session expired: go back to the login page (once, even if
    // several requests fail together). A wrong password on the login form is not
    // a session problem, so it is left to the form.
    if (apiError.status === 401 && !isLoginRequest && !redirecting) {
      redirecting = true;
      toast.error(apiError.message);
      // A full page load also clears any state left from the expired session
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/login");
    }

    return Promise.reject(apiError);
  },
);

export default api;
