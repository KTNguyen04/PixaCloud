import "./assets/main.css";

import { createApp } from "vue";
import PrimeVue from "primevue/config";
import App from "./App.vue";
import Button from "primevue/button";
import Aura from "@primevue/themes/aura";
import "@/assets/styles.scss";
import Tooltip from "primevue/tooltip";
import vue3GoogleLogin from "vue3-google-login";
import { createPinia } from "pinia";
import Toolbar from "primevue/toolbar";
import ToastService from "primevue/toastservice";
import FileUpload from "primevue/fileupload";

import ConfirmationService from "primevue/confirmationservice";

import Toast from "primevue/toast";

import Dialog from "primevue/dialog";
import { Form } from "@primevue/forms";
const pinia = createPinia();

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_CLIENT_ID,
  flow: "implicit",
});
app.use(pinia);
app.component("PVButton", Button);
app.component("PVFileUpload", FileUpload);
app.component("ToolBar", Toolbar);
app.component("PVToast", Toast);
app.use(ToastService);
app.component("PVDialog", Dialog);
app.component("PVForm", Form);
app.directive("tooltip", Tooltip);
app.use(ConfirmationService);

app.mount("#app");
