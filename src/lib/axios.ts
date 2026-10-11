import axios from "axios";

// One Axios instance for the whole app.
// withCredentials lets the browser send/receive the httpOnly sessionId cookie.
const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
  baseURL: "https://crm-backend-blush-one.vercel.app",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export default api;
