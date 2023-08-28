<script setup lang="ts">
import { RouterView } from 'vue-router';
import Header from './layout/Header.vue';
import Notification from './modals/Notification.vue';
import * as CONSTANT from './assets/constants/index';
import { useStateStore } from './store/stateStore';
import { ref } from 'vue';
import * as Sentry from '@sentry/electron';

// Sentry.init({
//   dsn: "https://93c089fc6a28856446c8de366ce9836e@o1294571.ingest.sentry.io/4505763516973056",
// });

const stateStore = useStateStore();

//First this to do is check if any applications are installed - only register and trigger it on start up.
// @ts-ignore
api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
  channelType: CONSTANT.MESSAGE.QUERY_INSTALLED
});

//Backend listener
// @ts-ignore
api.ipcRenderer.on('backend_message', (event, info) => {
  switch(info.channelType) {
    case CONSTANT.CHANNEL.TCP_SERVER_CHANNEL:
      console.log(info); //Message from the TCP server
      break;

    case CONSTANT.CHANNEL.APPLICATION_CHANNEL:
      updateApplicationSettings(info);
      break;

    case CONSTANT.CHANNEL.ERROR_CHANNEL:
      openNotificationModal(info.title, info.message);
      break;

    case CONSTANT.CHANNEL.UPDATE_CHANNEL:
      console.log(info); //Details about the electron update check
      break;

    default:
      console.log(info);
      break;
  }
});

/**
 * Update the Library store's details, these are shown on the settings page.
 * @param info
 */
const updateApplicationSettings = (info: any) => {
  stateStore.version = info.version;
}

const title = ref("");
const message = ref("");
const notificationRef = ref<InstanceType<typeof Notification> | null>(null)
const openNotificationModal = (title: string, message: string) => {
  this.title.value = title;
  this.message.value = message;
  notificationRef.value?.openModal();
}
</script>

<template>
  <div class="flex flex-col bg-white rounded-3xl mb-2">
    <Header />
  </div>
  <div class="content flex flex-row w-full">
    <RouterView />
  </div>

  <!--Modal to handle error messages from the backend-->
  <Notification ref="notificationRef" :title="title" :message="message"/>
</template>

<style lang="less">
@import './assets/css/styles.less';
</style>
