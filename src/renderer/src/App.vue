<script setup lang="ts">
import Notification from './modals/Notification.vue';
import BottomBar from "@renderer/layout/BottomBar.vue";
import Sidebar from "@renderer/layout/Sidebar.vue";
import * as CONSTANT from './assets/constants/index';
import { TCPMessage } from "@renderer/interfaces";
import { RouterView, useRoute } from 'vue-router';
import { ref } from 'vue';
import { useQuickStore } from "@renderer/store/quickStore";
import { useStateStore } from './store/stateStore';
import { useFullStore } from "@renderer/store/fullStore";
import * as Sentry from '@sentry/electron';

// Sentry.init({
//   dsn: "https://93c089fc6a28856446c8de366ce9836e@o1294571.ingest.sentry.io/4505763516973056",
// });

const route = useRoute()
const stateStore = useStateStore();
const quickStore = useQuickStore();
const fullStore = useFullStore();

/**
 * Backend listener, any messages from the node backend are directed to this listener and then
 * triaged for the appropriate follow through.
 */
// @ts-ignore
api.ipcRenderer.on('backend_message', (event, info) => {
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

    case "ApplianceList":
      fullStore.ApplianceList = JSON.parse(message[1]);
      break;

    case "StationList":
      fullStore.NucStationList = JSON.parse(message[1]);
      break;

    case "StationDetails":
      fullStore.StationList.push(JSON.parse(message[1]));
      break;

    case "StationWindows":
    case "StationNetwork":
    case "StationSoftware":
    case "StationConfig":
      quickStore.stationDetails = JSON.parse(message[1]);
      break;

    case "StationAll":
      const data = message[1].split("::::");
      console.log(data);
      const combinedObject = data.reduce((result, jsonStr) => {
        const parsedObject = JSON.parse(jsonStr);
        return { ...result, ...parsedObject };
      }, {});

      console.log(combinedObject);
      quickStore.stationDetails = combinedObject;
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
  stateStore.ipAddress = info.ipAddress;
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
  <div class="flex flex-row w-full justify-between max-h-[95vh] h-[95vh]">
    <div class="flex-col bg-white min-w-[220px] rounded-3xl">
      <Sidebar />
    </div>
    <div
        class="content flex-col bg-white ml-2 rounded-3xl w-full min-w-[30rem] justify-between overflow-auto pt-0"
    >
      <RouterView class="px-4" />
      <div
          class="sticky bottom-0 w-full h-20 flex-row justify-between items-center border-t-2 px-4 bg-white"
      >
        <BottomBar :meta="route.meta" />
      </div>
    </div>
  </div>

  <!--Modal to handle error messages from the backend-->
  <Notification ref="notificationRef" :title="title" :message="message"/>
</template>

<style lang="less">
@import './assets/css/styles.less';
</style>
