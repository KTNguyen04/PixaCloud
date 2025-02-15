import "./assets/main.css";

import { createApp } from "vue";
import PrimeVue from "primevue/config";
import App from "./App.vue";
import Button from "primevue/button";
import Aura from "@primevue/themes/aura";
import "@/assets/styles.scss";

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

app.mount("#app");
