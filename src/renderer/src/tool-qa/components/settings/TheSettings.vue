<script setup lang="ts">
import LauncherDetails from "@renderer/tool-qa/components/settings/LauncherDetails.vue";
import GenericButton from "@renderer/tool-qa/components/_generic/buttons/GenericButton.vue";
import {useRouter} from "vue-router";
import TcpServer from "@renderer/tool-qa/components/tcp/TcpServer.vue";
import TcpSetup from "@renderer/tool-qa/components/tcp/TcpSetup.vue";
import * as CONSTANT from "@renderer/assets/constants";

const loadCurrentProgress = async () => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.GENERATE_REPORT,
    type: CONSTANT.MESSAGE.LOAD_PROGRESS
  });
};

const router = useRouter();

const goBack = () => {
  router.back();
}
</script>

<template>
  <div class="w-full h-auto my-4 flex flex-col">
    <p class="text-lg text-black">Settings Page</p>

    <div class="w-full h-auto mb-4 flex flex-col">
      <hr class="my-4">

      <div class="flex flex-row justify-between">
        <div class="text-sm">
          If you have a previously unfinished report, load it here.
        </div>

        <div @click="loadCurrentProgress" class="w-32 h-8 mb-5 flex items-center justify-center rounded-lg bg-blue-500 text-white cursor-pointer hover:bg-blue-400">Load</div>
      </div>

      <hr class="my-4">

      <LauncherDetails />

      <TcpSetup />
    </div>

    <div class="flex justify-end">
      <GenericButton type="primary" :callback="goBack">
        Return
      </GenericButton>
    </div>
  </div>
</template>
