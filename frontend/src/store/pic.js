import { defineStore } from "pinia";
import PicService from "@/services/picService";

export const usePicStore = defineStore("pic", {
  state: () => ({
    allPic: null,
  }),
  //   getters: {
  //     doubleCount: (state) => state.count * 2,
  //   },
  actions: {
    async fetchPics(params = {}) {
      try {
        const response = await PicService.getPics(params);
        this.allPic = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    addPic(pic) {
      this.allPic.push(pic);
    },
    deletePic(id) {
      this.allPic = this.allPic.filter((pic) => pic.id !== id);
    },
    updatePic(updatedPic) {
      const index = this.allPic.findIndex((pic) => pic.id === updatedPic.id);
      this.allPic[index] = updatedPic;
    },
  },
  strict: true,
});
