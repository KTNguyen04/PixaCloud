import "./assets/main.css";

import { createApp } from "vue";
import PrimeVue from "primevue/config";
import App from "./App.vue";
import Button from "primevue/button";
import Aura from "@primevue/themes/aura";
import "@/assets/styles.scss";
import Tooltip from "primevue/tooltip";

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.component("PVButton", Button);
app.directive("tooltip", Tooltip);

app.mount("#app");
