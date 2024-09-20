<script setup lang="ts">
import router from './router/router';
import NotificationModal from "../modals/NotificationModal.vue";
import BottomBar from "../layout/BottomBar.vue";
import Sidebar from "../layout/SideBar/Sidebar.vue";
import ShowState from "../src-setup/components/helpers/showState.vue";
import * as CONSTANT from "../assets/constants";
import { RouterView, useRoute } from 'vue-router';
import {computed, onBeforeMount, watch} from 'vue';
import { useConfigStore } from "../src-setup/store/configStore";
import { storeToRefs } from "pinia";
import { useStateStore } from "../store/stateStore";
import { listeners as qaListeners, initialise as qaInitialise } from "../src-qa/apiListeners";
import { listeners as networkListeners, initialise as networkInitialise } from "../src-network/apiListeners";
import { listeners as passwordListeners, initialise as passwordInitialise } from "../src-password/apiListeners";
import {getAuth, signOut} from "firebase/auth";
import {FULL_TOOL} from "../assets/constants/_tool";

const pushRoute = (value: string) => {
  router.push(value);
}

// Sentry.init({
//   dsn: "https://93c089fc6a28856446c8de366ce9836e@o1294571.ingest.sentry.io/4505763516973056",
// });

const route = useRoute()
const configStore = useConfigStore()
const { showPreview } = storeToRefs(configStore)

const title = computed(() => {
  return useStateStore().title;
});

const message = computed(() => {
  return useStateStore().message;
});

//Update the users progress
const stateStore = useStateStore();
//Manually set the tool type
stateStore.toolType = CONSTANT.TOOL.FULL_TOOL;
const tempStore = stateStore.getStore;
const updateOverallProgress = () => {
  if (route.meta['progress']) {
    tempStore.updateMaxProgress(<number>route.meta['progress']);
  }
}

watch(route, updateOverallProgress);

/**
 * Backend listener, any messages from the node backend are directed to this listener and then
 * triaged for the appropriate follow through.
 */
//@ts-ignore
api.ipcRenderer.on('backend_message', (event, info) => {
  qaListeners(info);
  networkListeners(info);
  passwordListeners(info);
});

onBeforeMount(() => {
  qaInitialise();
  networkInitialise();
  passwordInitialise();
});

/**
 * Check if there is a current user session on start up and log them out if there is. A user should have to login each
 * time they use the application.
 */
const auth = getAuth();
signOut(auth)
    .then(() => {
      console.log("User logged out");
      router.push("/");
    })
    .catch((error) => {
      console.error("Error signing out:", error.message);
    });
</script>

<template>
  <div class="flex flex-row w-full justify-between max-h-[95vh] h-[95vh]">
    <div class="flex-col bg-white min-w-[220px] rounded-xl" v-if="route.meta.tool !== 'client-qa'">
      <Sidebar />
    </div>

    <div class="content flex-col bg-white ml-2 rounded-xl w-full min-w-[30rem] justify-between overflow-auto pt-0">
      <RouterView class="px-4" />

      <div v-if="route.name !== 'network-diagnostic' && route.name !== 'password-login' && route.name !== 'password-generation' && route.meta.tool !== 'client-qa'" class="sticky bottom-0 shrink-0 w-full h-20 flex-row justify-between items-center border-t-2 px-4 bg-white">
        <BottomBar :meta="route.meta" @push-route="pushRoute" />
      </div>
    </div>

    <div v-if="showPreview && route.meta.tool !== 'client-qa'" class="content flex flex-col bg-white w-96 flex-shrink-0 max-h-[98vh] rounded-xl ml-2">
      <ShowState />
    </div>
  </div>

  <!--Modal to handle error messages from the backend-->
  <NotificationModal ref="notificationRef" :title="title" :message="message"/>
</template>

<style>
@import '../assets/css/styles.css';
</style>
