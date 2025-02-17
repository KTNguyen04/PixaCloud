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
          :src="slotProps.item.download_url"
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
        <Card style="overflow: hidden" class="pb-0">
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
          <template #subtitle v-if="isPersonal"
            >by {{ image.author }} -
            <i class="m-0">{{ image.createAt }}</i>
          </template>
          <template #subtitle v-else>
            <i class="mr-auto">{{ image.createAt }}</i>
            <PVToast />
            <ConfirmPopup></ConfirmPopup>
            <div class="card flex flex-wrap gap-2 mt-2 mb-0 justify-content-center">
              <PVButton
                label="Edit"
                @click="
                  visible = true;
                  currentId = image.id;
                "
                outlined
              />

              <PVDialog
                v-model:visible="visible"
                header="Edit Picture's title"
                :style="{ width: '25rem' }"
              >
                <span class="text-surface-500 dark:text-surface-400 block mb-5"
                  >Edit your picture's name.</span
                >
                <PVToast />
                <PVForm :resolver @submit="onFormSubmit">
                  <div class="flex gap-4 mb-4">
                    <label for="title" class="font-semibold w-3 mt-1">New title</label>
                    <div class="flex flex-column gap-1">
                      <InputText
                        id="title"
                        autocomplete="off"
                        type="text"
                        v-model="title"
                        required
                      />
                    </div>
                  </div>

                  <div class="flex justify-content-end gap-2">
                    <PVButton
                      type="button"
                      label="Cancel"
                      severity="secondary"
                      @click="visible = false"
                    ></PVButton>
                    <PVButton type="submit" label="Edit"></PVButton>
                  </div>
                </PVForm>
              </PVDialog>
              <PVButton
                @click="
                  confirm2($event);
                  currentId = image.id;
                "
                label="Delete"
                severity="danger"
                outlined
              ></PVButton>
            </div>
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
import InputText from "primevue/inputtext";
import ConfirmPopup from "primevue/confirmpopup";

export default {
  components: {
    Galleria,
    Card,
    ConfirmPopup,
    InputText,
  },
  data() {
    return {
      images: [],
      isPersonal: false,
      activeIndex: 0,
      visible: false,
      displayCustom: false,
      currentId: "",
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

    confirm2(event) {
      this.$confirm.require({
        target: event.currentTarget,
        message: "Do you want to delete this picture?",
        icon: "pi pi-info-circle",
        rejectProps: {
          label: "Cancel",
          severity: "secondary",
          outlined: true,
        },
        acceptProps: {
          label: "Delete",
          severity: "danger",
        },
        accept: () => {
          console.log(this.currentId);
          this.onDelete();
        },
        reject: () => {
          this.$toast.add({
            severity: "error",
            summary: "Rejected",
            detail: "You have rejected",
            life: 3000,
          });
        },
      });
    },
    async onFormSubmit() {
      console.log(this.title);
      if (this.title) {
        const formData = new FormData();
        formData.append("title", this.title);
        console.log(formData);
        try {
          await picService.editPic(this.currentId, formData);

          this.currentID = null;
          this.$toast.add({
            severity: "info",
            summary: "Confirmed",
            detail: "Edited",
            life: 3000,
          });
        } catch (error) {
          this.$toast.add({
            severity: "warn",
            summary: error,
            life: 3000,
          });
        }
        // this.initialValues = {
        //   title: "",
        //   picture: null,
        // };
      } else {
        this.$toast.add({
          severity: "warn",
          summary: "Please enter a title ",
          life: 3000,
        });
      }
    },

    async onDelete() {
      try {
        await picService.deletePic(this.currentId);
        this.$toast.add({
          severity: "info",
          summary: "Confirmed",
          detail: "Picture deleted",
          life: 3000,
        });
      } catch (error) {
        this.$toast.add({
          severity: "warn",
          summary: error,
          life: 3000,
        });
      }
      // this.initialValues = {
      //   title: "",
      //   picture: null,
      // };
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
