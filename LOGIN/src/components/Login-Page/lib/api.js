export const api = {
  auth: {
    me: { path: "/api/auth/me" },
    login: { path: "/api/auth/login", method: "POST" },
    register: { path: "/api/auth/signup", method: "POST" },
    logout: { path: "/api/auth/logout", method: "POST" },
  },
}

export default api
