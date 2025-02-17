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
app.directive("tooltip", Tooltip);

app.mount("#app");
