<template>
  <div class="card mt-3">
    <ToolBar>
      <template #start>
        <ToggleButton
          v-model="checked"
          onLabel="Date Uploaded"
          offLabel="Date Uploaded"
          onIcon="pi pi-arrow-up"
          offIcon="pi pi-arrow-down"
          class="w-5 mr-2"
          aria-label="Do you confirm"
        />

        <DatePicker
          v-model="dates"
          selectionMode="range"
          :manualInput="false"
          placeholder="Date Range"
          showButtonBar
        />
      </template>

      <template #end>
        <PVButton
          v-if="authStore.loggedIn"
          icon="pi pi-upload"
          severity="secondary"
          text
          label="Upload"
          @click="visible = true"
        />
        <PVButton
          v-else
          icon="pi pi-upload"
          severity="secondary"
          text
          label="Upload"
          v-tooltip.left="'Please login to upload'"
        />

        <PVDialog v-model:visible="visible" header="Upload Picture" :style="{ width: '25rem' }">
          <span class="text-surface-500 dark:text-surface-400 block mb-5"
            >Upload your beautiful picture.</span
          >
          <PVToast />
          <PVForm :resolver @submit="onFormSubmit">
            <div class="flex gap-4 mb-4">
              <label for="title" class="font-semibold w-2 mt-1">Title</label>
              <div class="flex flex-column gap-1">
                <InputText id="title" autocomplete="off" type="text" v-model="title" required />
              </div>
            </div>
            <FileUpload
              mode="basic"
              @select="onFileSelect"
              customUpload
              severity="secondary"
              class="p-button-outlined mb-3"
              v-model="picture"
              :required="true"
            />
            <img v-if="src" :src="src" :alt="src" class="shadow-md rounded-xl w-full mb-3" />
            <div class="flex justify-content-end gap-2">
              <PVButton
                type="button"
                label="Cancel"
                severity="secondary"
                @click="visible = false"
              ></PVButton>
              <PVButton type="submit" label="Upload"></PVButton>
            </div>
          </PVForm>
        </PVDialog>
      </template>
    </ToolBar>
  </div>
</template>

<script>
import ToggleButton from "primevue/togglebutton";

import DatePicker from "primevue/datepicker";
import InputText from "primevue/inputtext";

import FileUpload from "primevue/fileupload";
import { useAuthStore } from "@/store/auth";
import picService from "@/services/picService";
import { usePicStore } from "@/store/pic";

export default {
  components: {
    ToggleButton,
    DatePicker,
    InputText,

    FileUpload,
  },
  data() {
    return {
      dates: null,
      checked: false,
      visible: false,
      src: null,
      fromDate: null,
      toDate: null,
      sort: "desc",
      // authStore: useAuthStore(),
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    picStore() {
      return usePicStore();
    },
  },
  watch: {
    checked(val) {
      if (val) {
        this.sort = "ASC";
      } else {
        this.sort = "DESC";
      }
      if (this.fromDate && this.toDate) {
        this.picStore.fetchPics({
          sort: this.sort,
          startDate: this.fromDate,
          endDate: this.toDate,
        });
      } else {
        this.picStore.fetchPics({ sort: this.sort });
      }
    },
    dates(val) {
      console.log(val);
      if (!val || !val[1]) {
        this.fromDate = null;
        this.toDate = null;
        this.picStore.fetchPics({ sort: this.sort });
        return;
      }
      this.fromDate = val[0];
      this.toDate = val[1];

      console.log(this.fromDate, this.toDate);
      const formatToYYYYMMDD = (d) => {
        const [day, month, year] = d.toLocaleDateString("vi-VN").split("/");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      };
      this.fromDate = formatToYYYYMMDD(this.fromDate);
      this.toDate = formatToYYYYMMDD(this.toDate);

      this.picStore.fetchPics({ sort: this.sort, startDate: this.fromDate, endDate: this.toDate });
    },
  },
  methods: {
    async onFormSubmit() {
      console.log(this.title, this.picture);
      if (this.title && this.picture) {
        const file = this.picture;
        try {
          const response = await picService.getPresignedUrl({
            originalname: file.name,
            contentType: file.type,
          });
          const { presignedUrl, pic } = response.data;
          await picService.uploadPicToS3(presignedUrl, file);
          await this.picStore.addPic(pic);

          this.$toast.add({
            severity: "success",
            summary: "Picture is uploaded successfully.",
            life: 3000,
          });

          this.picture = null;
          this.title = null;
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
          summary: "Please enter a title and choose a picture.",
          life: 3000,
        });
      }
    },

    onFileSelect(event) {
      this.picture = event.files[0];
      console.log(this.picture);
      const reader = new FileReader();
      reader.onload = async (e) => {
        this.src = e.target.result;
      };
      console.log("pic", this.picture);
      reader.readAsDataURL(this.picture);
    },
  },
};
</script>
