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
          <GoogleLogin :callback="loginCallback" prompt>
            <Avatar
              id="avatar"
              icon="pi pi-user"
              style="background-color: #dee9fc; color: #1a2551"
              shape="circle"
              v-tooltip.left="'Login with Google'"
            />
          </GoogleLogin>
        </div>
      </template>
    </Toolbar>
  </div>
</template>

<script>
import Toolbar from "primevue/toolbar";
import Avatar from "primevue/avatar";
import authService from "@/services/authService";
import { useAuthStore } from "@/store/auth";

export default {
  components: {
    Toolbar,
    Avatar,
  },
  methods: {
    data() {
      return {
        authStore: useAuthStore(), // Gọi store khi component được tạo
      };
    },
    async loginCallback(response) {
      try {
        //   console.log(response)
        //   console.log(response.credential)
        console.log("code", response.code);
        const res = await authService.googleLogin({ code: response.code });

        console.log("Backend Response:", res);

        if (res.status === 200) {
          this.authStore.setToken(res.data.token);
          this.authStore.setUser(res.data.user);
          // router.push("/");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
  },
};
</script>

<style scoped>
#avatar:hover {
  cursor: pointer;

  border: 2px solid #1a2551;
}
</style>
