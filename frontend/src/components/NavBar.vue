<template>
  <div class="card">
    <Toolbar style="border-radius: 3rem; padding: 1rem 1rem 1rem 1.5rem">
      <template #start>
        <div class="flex items-center gap-2">
          <PVButton icon="pi pi-cloud" label="PixaCloud" text plain size="large" />
        </div>
      </template>

      <template #end>
        <div class="flex items-center gap-2">
          <Avatar
            id="avatar"
            icon="pi pi-user"
            style="background-color: #dee9fc; color: #1a2551"
            shape="circle"
          />
        </div>
      </template>
    </Toolbar>
  </div>
</template>

<script>
import Toolbar from "primevue/toolbar";
import Avatar from "primevue/avatar";
export default {
  components: {
    Toolbar,
    Avatar,
  },
};
</script>

<style scoped>
#avatar:hover {
  cursor: pointer;

  border: 2px solid #1a2551;
}
</style>
