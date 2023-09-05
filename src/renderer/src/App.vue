<script setup lang="ts">
import { RouterView } from 'vue-router';
import Header from './layout/Header.vue';
import Notification from './modals/Notification.vue';
import * as CONSTANT from './assets/constants/index';
import { TCPMessage } from "@renderer/interfaces";
import { useStateStore } from './store/stateStore';
import { ref } from 'vue';
import * as Sentry from '@sentry/electron';

// Sentry.init({
//   dsn: "https://93c089fc6a28856446c8de366ce9836e@o1294571.ingest.sentry.io/4505763516973056",
// });

const stateStore = useStateStore();

//Backend listener
// @ts-ignore
api.ipcRenderer.on('backend_message', (event, info) => {
  // @ts-ignore
  switch(info.channelType) {
    case CONSTANT.CHANNEL.APPLICATION_CHANNEL:
      updateApplicationSettings(info); //Software version number
      break;

    case CONSTANT.CHANNEL.TCP_SERVER_CHANNEL:
      handleTCPMessage(info as TCPMessage); //Message from the TCP server
      break;

    case CONSTANT.CHANNEL.TCP_CLIENT_CHANNEL:
      handleTCPClientError(info as TCPMessage); //Message from the TCP client (Error states)
      break;

    case CONSTANT.CHANNEL.NETWORK_PORT_CHANNEL:
      stateStore.PortDetails = info.data; // Data sent back as port details
      break;

    case CONSTANT.CHANNEL.ERROR_CHANNEL:
      openNotificationModal(info.title, info.message);
      break;

    case CONSTANT.CHANNEL.UPDATE_CHANNEL:
      console.log(info);
      break;

    default:
      console.log(info);
      break;
  }
});

/**
 * The NUC or Station has sent a message via the TCP server, determine what it is and how to handle it.
 */
const handleTCPMessage = (info: any) => {
  //[0]Message type | [1]Message details
  const message = stateStore.splitStringWithLimit(info.mainText, ":", 2);

  switch(message[0]) {
    case "ServerStatus":
      stateStore.isServerRunning = JSON.parse(message[1]);
      break;

    case "StationList":
      stateStore.NucStationList = JSON.parse(message[1]);
      break;

    case "StationDetails":
      stateStore.StationList.push(JSON.parse(message[1]));
      break;

    default:
      console.log(`Unknown type: ${message[0]}. Data: ${message[1]}`);
      break;
  }
}

/**
 * The electron Socket client has encountered an error, handle the type and required flow.
 */
const handleTCPClientError = (info: any) => {
  switch(info.headerMessage) {
    case "TimedOut":
      console.log(`Socket timed out on: ${info.mainText}`);
      break;
  }
}

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
