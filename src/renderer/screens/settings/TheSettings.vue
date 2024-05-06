<script setup lang="ts">
import LauncherDetails from "./LauncherDetails.vue";
import GenericButton from "../../components/buttons/GenericButton.vue";
import TcpSetup from "../../components/tcp/TcpSetup.vue";
import * as CONSTANT from "../../assets/constants";
import { useRouter } from "vue-router";
import { getAuth, signOut } from "firebase/auth";
import { computed } from "vue";
import { useStateStore } from "../../store/stateStore";
import ConfirmationModal from "../../modals/ConfirmationModal.vue";
import WakeDevice from "../../components/wol/WakeDevice.vue";

const stateStore = useStateStore();
const auth = getAuth();
const router = useRouter();
const goBack = () => {
  router.back();
}

const loadCallback = () => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.GENERATE_REPORT,
    type: CONSTANT.MESSAGE.LOAD_PROGRESS
  });
}

/**
 * Check if a user is currently logged in and that the report has not already been uploaded.
 * Otherwise, attempt to upload the report data.
 */
const checkUserStatus = computed(() => {
  const user = auth.currentUser;
  return !!user;
});

const logout = () => {
  const auth = getAuth();
  signOut(auth)
      .then(() => {
        console.log("User logged out");
        router.push("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error.message);
      });
}
</script>

<template>
  <div class="sidebar flex flex-col w-full bg-white rounded-3xl px-6 py-2">
    <div class="w-full h-auto my-3 flex flex-col">
      <div class="flex flex-row justify-between">
        <p class="text-lg text-black">Settings Page</p>

        <GenericButton type="primary" :callback="goBack">
          Return
        </GenericButton>
      </div>

      <div class="w-full h-auto mb-4 flex flex-col">
        <hr class="my-4">

        <div class="flex flex-row justify-between">
          <div v-if="checkUserStatus" class="text-sm">
            If you wish to log out of a current session
          </div>
          <div v-else class="text-sm">
            No user is currently logged in.
          </div>

          <div @click="logout" class="w-32 h-8 flex items-center justify-center rounded-lg text-white"
            :class="{
              'bg-blue-500 hover:bg-blue-400': checkUserStatus,
              'bg-slate-500 hover:bg-slate-500 cursor-not-allowed': !checkUserStatus,
            }"
          >Logout</div>
        </div>

        <hr class="my-4">

        <div class="flex flex-row justify-between">
          <div class="text-sm">
            If you have a previously unfinished report, load it here.
          </div>

          <!--Modal to show loading warning-->
          <ConfirmationModal ref="confirmationRef"
                             :title="'Warning'"
                             :message="'Please make sure you have connected to the same CBus, NUC, Stations & Tablets ' +
                              'before loading a previously saved report, otherwise they will not be shown in the tests ' +
                              'correctly. The QA tool cannot automatically connect to the saved devices.'"
                             :callback="loadCallback"/>
        </div>

        <hr class="my-4">

        <div class="flex flex-row justify-between">
          <TcpSetup class="w-72"/>

          <LauncherDetails class="w-96" />
        </div>

        <hr class="mb-4">

        <WakeDevice title="Attempt to wake a Device" button-title="Wake Device" />

      </div>
    </div>
  </div>
</template>
