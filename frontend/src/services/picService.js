import apiPublic from "./apiPublic";

export default {
  getPics(params = {}) {
    return apiPublic.get("/v2/list", { params });
  },
};
