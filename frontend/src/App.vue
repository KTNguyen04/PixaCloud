<script>
import NavBar from "./components/NavBar.vue";
import GridView from "./components/GridView.vue";
// import Button from "primevue/button";

// import Menubar from "primevue/menubar";

export default {
  components: {
    NavBar,
    GridView,
  },
};
</script>

<template>
  <NavBar />
  <GridView class="mt-7" />
</template>
