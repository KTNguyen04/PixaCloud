import { defineStore } from "pinia";

export const useAuthStore = defineStore("user", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    loggedIn: localStorage.getItem("token") !== null,
    isPersonal: false,
  }),

  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem("token", this.token);
      if (token) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    },
    setUser(user) {
      this.user = user;
      localStorage.setItem("user", JSON.stringify(this.user));
    },
    setPersonal(isPersonal) {
      this.isPersonal = isPersonal;
    },
  },
  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user,
  },
  strict: true,
});
