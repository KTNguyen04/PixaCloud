import apiAuth from "./apiAuth";

export default {
  async googleLogin(credentials) {
    return await apiAuth.post("/auth/google", credentials);
  },
};
