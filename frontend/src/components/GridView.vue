<template>
  <div class="card flex justify-center">
    <Galleria
      v-model:activeIndex="activeIndex"
      v-model:visible="displayCustom"
      :value="images"
      :numVisible="7"
      containerStyle="max-width: 850px"
      :circular="true"
      :fullScreen="true"
      :showItemNavigators="true"
      :showThumbnails="false"
    >
      <template #item="slotProps">
        <img
          :src="slotProps.item.itemImageSrc"
          :alt="slotProps.item.alt"
          style="width: 100%; display: block"
        />
      </template>
      <!-- <template #thumbnail="slotProps">
        <img
          :src="slotProps.item.thumbnailImageSrc"
          :alt="slotProps.item.alt"
          style="display: block"
        />
      </template> -->
    </Galleria>

    <div v-if="images" class="grid gap-4 justify-content-center" style="max-width: 100%">
      <div
        v-for="(image, index) of images"
        :key="index"
        class="col-12 sm:col-5 md:col-4 lg:col-3 xl:col-2"
      >
        <Card style="overflow: hidden">
          <template #header>
            <img
              :src="image.download_url"
              :alt="image.alt"
              style="cursor: pointer"
              v-tooltip.top="image.size"
              @click="imageClick(index)"
              class="image"
              width="100%"
            />
          </template>
          <template #title>{{ image.name }}</template>
          <template #subtitle
            >by {{ image.author }} -
            <i class="m-0">{{ image.date }}</i>
          </template>
        </Card>
        <!-- <img
          :src="image.thumbnailImageSrc"
          :alt="image.alt"
          style="cursor: pointer"
          v-tooltip.top="image.size"
          @click="imageClick(index)"
          class="image"
          width="100%"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import Galleria from "primevue/galleria";
import Card from "primevue/card";
import picService from "@/services/picService";

export default {
  components: {
    Galleria,
    Card,
  },
  data() {
    return {
      images: [],
      activeIndex: 0,

      displayCustom: false,
    };
  },

  methods: {
    imageClick(index) {
      this.activeIndex = index;
      this.displayCustom = true;
    },
    async fetchPics() {
      try {
        const response = await picService.getPics({ page: 1, limit: 10 });
        this.images = response.data;
      } catch (error) {
        console.error("Error: ", error);
      }
    },
  },
  mounted() {
    this.fetchPics();
  },
};
</script>

<style scoped>
.image {
  border-radius: 2%;
}
</style>
