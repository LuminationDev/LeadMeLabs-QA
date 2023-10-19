<script setup lang="ts">
import LauncherDetails from "@renderer/tool-qa/components/settings/LauncherDetails.vue";
import GenericButton from "@renderer/tool-qa/components/_generic/buttons/GenericButton.vue";
import TcpSetup from "@renderer/tool-qa/components/_generic/tcp/TcpSetup.vue";
import * as CONSTANT from "@renderer/assets/constants";
import { useRouter } from "vue-router";
import { getAuth, signOut } from "firebase/auth";

const router = useRouter();
const goBack = () => {
  router.back();
}

const loadCurrentProgress = async () => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.GENERATE_REPORT,
    type: CONSTANT.MESSAGE.LOAD_PROGRESS
  });
};

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
  <div class="w-full h-auto my-4 flex flex-col">
    <p class="text-lg text-black">Settings Page</p>

    <div class="w-full h-auto mb-4 flex flex-col">
      <hr class="my-4">

      <div class="flex flex-row justify-between">
        <div class="text-sm">
          If you wish to log out of a current session
        </div>

        <div @click="logout" class="w-32 h-8 flex items-center justify-center rounded-lg bg-blue-500 text-white cursor-pointer hover:bg-blue-400">Logout</div>
      </div>

      <hr class="my-4">

      <div class="flex flex-row justify-between">
        <div class="text-sm">
          If you have a previously unfinished report, load it here.
        </div>

        <div @click="loadCurrentProgress" class="w-32 h-8 flex items-center justify-center rounded-lg bg-blue-500 text-white cursor-pointer hover:bg-blue-400">Load</div>
      </div>

      <hr class="my-4">

      <LauncherDetails />

      <div class="flex flex-row justify-between">
        <TcpSetup />

        <div class="flex items-end">
          <GenericButton type="primary" :callback="goBack">
            Return
          </GenericButton>
        </div>
      </div>

    </div>
  </div>
</template>
