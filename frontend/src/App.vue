<script>
import NavBar from "./components/NavBar.vue";
import GridView from "./components/GridView.vue";
import FileUpload from "./components/MenuBar.vue";

export default {
  components: {
    NavBar,
    GridView,
    FileUpload,
  },
};
</script>

<template>
  <NavBar />
  <FileUpload />
  <GridView class="mt-7" />
</template>
