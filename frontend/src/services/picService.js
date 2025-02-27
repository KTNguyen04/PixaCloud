import apiPublic from "./apiPublic";
import apiAuth from "./apiAuth";

export default {
  async getPics(params = {}, isPersonal = false) {
    if (isPersonal) {
      return apiAuth.get("/pics/personal", { params });
    }
    return apiPublic.get("/pics", { params });
  },
  // async uploadPic(data) {
  //   return apiAuth.post("/pics", data);
  // },
  async editPic(id, data) {
    return apiAuth.put(`/pics/${id}`, data);
  },
  async deletePic(id) {
    return apiAuth.delete(`/pics/${id}`);
  },
  async getPresignedUrl(data) {
    return apiAuth.post("/pics", data);
  },
  async uploadPicToS3(url, file) {
    return apiPublic.put(url, file, {
      headers: { "Content-Type": file.type },
    });
  },
};
