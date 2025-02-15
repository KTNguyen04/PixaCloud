<template>
  <div class="card flex justify-center">
    <Galleria
      v-model:activeIndex="activeIndex"
      v-model:visible="displayCustom"
      :value="images"
      :responsiveOptions="responsiveOptions"
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

    <div v-if="images" class="grid gap-4 me-auto" style="max-width: 100%">
      <div
        v-for="(image, index) of images"
        :key="index"
        class="col-12 sm:col-5 md:col-4 lg:col-3 xl:col-2"
      >
        <img
          :src="image.thumbnailImageSrc"
          :alt="image.alt"
          style="cursor: pointer"
          v-tooltip.top="image.alt"
          @click="imageClick(index)"
          class="image"
          width="100%"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Galleria from "primevue/galleria";

export default {
  components: {
    Galleria,
  },
  data() {
    return {
      images: [
        {
          itemImageSrc: "https://primefaces.org/cdn/primevue/images/galleria/galleria1.jpg",
          thumbnailImageSrc: "https://primefaces.org/cdn/primevue/images/galleria/galleria1.jpg",
          alt: "Ảnh 1",
        },
        {
          itemImageSrc: "https://primefaces.org/cdn/primevue/images/galleria/galleria11.jpg",
          thumbnailImageSrc: "https://primefaces.org/cdn/primevue/images/galleria/galleria11.jpg",
          alt: "Ảnh 2",
        },
        {
          itemImageSrc: "https://primefaces.org/cdn/primevue/images/galleria/galleria11.jpg",
          thumbnailImageSrc: "https://primefaces.org/cdn/primevue/images/galleria/galleria11.jpg",
          alt: "Ảnh 2",
        },
      ],
      activeIndex: 0,
      responsiveOptions: [
        {
          breakpoint: "1024px",
          numVisible: 5,
        },
        {
          breakpoint: "768px",
          numVisible: 3,
        },
        {
          breakpoint: "560px",
          numVisible: 1,
        },
      ],
      displayCustom: false,
    };
  },
  mounted() {
    // PhotoService.getImages().then((data) => (this.images = data));
  },
  methods: {
    imageClick(index) {
      this.activeIndex = index;
      this.displayCustom = true;
    },
  },
};
</script>

<style scoped>
.image {
  border-radius: 2%;
}
</style>
