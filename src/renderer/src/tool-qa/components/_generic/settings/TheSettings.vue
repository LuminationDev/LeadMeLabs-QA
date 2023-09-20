<script setup lang="ts">
import LauncherDetails from "@renderer/tool-qa/components/_generic/settings/LauncherDetails.vue";
import GenericButton from "@renderer/tool-qa/components/_generic/buttons/GenericButton.vue";
import {useRouter} from "vue-router";
import TcpServer from "@renderer/tool-qa/components/tcp/TcpServer.vue";
import TcpSetup from "@renderer/tool-qa/components/tcp/TcpSetup.vue";

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
