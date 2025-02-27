<template>
  <div class="card">
    <ToolBar style="border-radius: 3rem; padding: 0rem 1rem 0rem 1.5rem">
      <template #start>
        <div class="flex items-center gap-2">
          <PVButton
            icon="pi pi-cloud"
            label="PixaCloud"
            text
            plain
            size="large"
            as="a"
            href="/"
            style="text-decoration: none"
          />
        </div>
        <PVButton
          v-if="authStore.loggedIn"
          label="My Collection"
          text
          plain
          @click="authStore.switchPersonal"
        ></PVButton>
        <PVButton
          v-else
          label="My Collection"
          text
          plain
          v-tooltip.bottom="'Please log in first'"
        ></PVButton>
      </template>

      <template #end>
        <div class="flex items-center gap-2">
          <GoogleLogin v-if="!authStore.loggedIn" :callback="loginCallback" prompt>
            <Avatar
              id="avatar"
              icon="pi pi-user"
              style="background-color: #dee9fc; color: #1a2551"
              shape="circle"
              v-tooltip.left="'Login with Google'"
            />
          </GoogleLogin>
          <template v-else>
            <Avatar
              id="avatar"
              icon="pi pi-user"
              style="background-color: #dee9fc; color: #1a2551"
              shape="circle"
              @click="toggle"
            />
            <Popover ref="op">
              <PVButton label="Log Out" icon="pi pi-sign-out" text plain @click="logOut"></PVButton>
            </Popover>
          </template>
        </div>
      </template>
    </ToolBar>
  </div>
</template>

<script>
import Avatar from "primevue/avatar";
import authService from "@/services/authService";
import { useAuthStore } from "@/store/auth";

import Popover from "primevue/popover";

export default {
  components: {
    Avatar,
    Popover,
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
  },
  methods: {
    async loginCallback(response) {
      try {
        const res = await authService.googleLogin({ code: response.code });

        if (res.status === 200) {
          this.authStore.setToken(res.data.token);
          this.authStore.setUser(res.data.user);
          this.$router.push("/");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
    toggle(event) {
      this.$refs.op.toggle(event);
    },
    logOut() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      this.authStore.$reset();
      this.$router.push("/");
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
