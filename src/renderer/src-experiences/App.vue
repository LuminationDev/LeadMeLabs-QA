<script setup lang="ts">
import router from './router/router';
import NotificationModal from "@renderer/modals/NotificationModal.vue";
import BottomBar from "@renderer/layout/BottomBar.vue";
import Sidebar from "../layout/SideBar/Sidebar.vue";
import { RouterView, useRoute } from 'vue-router';
import { computed, onBeforeMount } from 'vue';
import { useStateStore } from '../store/stateStore';
import { initialise, listeners } from "./apiListeners";

const pushRoute = (value: string) => {
  router.push(value);
}

// Sentry.init({
//   dsn: "https://93c089fc6a28856446c8de366ce9836e@o1294571.ingest.sentry.io/4505763516973056",
// });

const route = useRoute()

const title = computed(() => {
  return useStateStore().title;
});

const message = computed(() => {
  return useStateStore().message;
});

/**
 * Backend listener, any messages from the node backend are directed to this listener and then
 * triaged for the appropriate follow through.
 */
//@ts-ignore
api.ipcRenderer.on('backend_message', (event, info) => {
  listeners(info);
});

onBeforeMount(() => {
  initialise();
});
</script>

<template>
  <div class="flex flex-row w-full justify-between max-h-[95vh] h-[95vh]">
    <div class="flex-col bg-white min-w-[220px] rounded-xl">
      <Sidebar />
    </div>

    <div class="content flex-col bg-white ml-2 rounded-xl w-full min-w-[30rem] justify-between overflow-auto pt-0">
      <RouterView class="px-4" />

      <div class="sticky bottom-0 shrink-0 w-full h-20 flex-row justify-between items-center border-t-2 px-4 bg-white">
        <BottomBar :meta="route.meta" @push-route="pushRoute" />
      </div>
    </div>
  </div>

  <!--Modal to handle error messages from the backend-->
  <NotificationModal ref="notificationRef" :title="title" :message="message"/>
</template>

<style>
@import '../assets/css/styles.css';
</style>
