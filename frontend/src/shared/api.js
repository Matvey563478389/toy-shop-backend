import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? "/api",
  withCredentials: true,
});

let refreshPromise = null;

function getRefreshPromise() {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/user/refresh", {}, { skipAuthRefresh: true })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.request.use((config) => {
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const cfg = err.config;
    if (!cfg || cfg.skipAuthRefresh) {
      return Promise.reject(err);
    }
    if (err.response?.status !== 401) {
      return Promise.reject(err);
    }
    const url = cfg.url || "";
    if (
      url.includes("/user/refresh") ||
      url.includes("/user/sign-in") ||
      url.includes("/user/sign-up")
    ) {
      return Promise.reject(err);
    }
    try {
      await getRefreshPromise();
      return api.request({ ...cfg, skipAuthRefresh: true });
    } catch {
      return Promise.reject(err);
    }
  }
);

export default api;
