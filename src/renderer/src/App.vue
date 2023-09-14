<script setup lang="ts">
import NotificationModal from "@renderer/modals/NotificationModal.vue";
import BottomBar from "@renderer/layout/BottomBar.vue";
import Sidebar from "@renderer/layout/SideBar/Sidebar.vue";
import * as CONSTANT from './assets/constants/index';
import * as FULL from './assets/checks/_fullcheckValues';
import { TCPMessage, QaCheck } from "@renderer/interfaces";
import { RouterView, useRoute } from 'vue-router';
import { ref } from 'vue';
import { useQuickStore } from "@renderer/store/quickStore";
import { useStateStore } from './store/stateStore';
import { useFullStore } from "@renderer/store/fullStore";

// Sentry.init({
//   dsn: "https://93c089fc6a28856446c8de366ce9836e@o1294571.ingest.sentry.io/4505763516973056",
// });

const route = useRoute()
const stateStore = useStateStore();
const quickStore = useQuickStore();
const fullStore = useFullStore();

/**
 * Function to transform key-value pairs into QaCheck objects
  */
const transformToObject = (key: string, value: string): QaCheck => {
  return {
    passedStatus: null, // Default to null
    message: value,
    checkId: key,
  };
}

/**
 * Read the static _fullCheckValues and load them into the fullStore's reportTracker variable
 */
const populateFullReportTracker = () => {
  const objectValuesArray: { ReportTrackerItem } = {};

  // Iterate through the exported objects in index.ts
  for (const variableName in FULL) {
    if (Object.prototype.hasOwnProperty.call(FULL, variableName)) {
      const object = FULL[variableName];
      objectValuesArray[variableName] = Object.keys(object).map((key) =>
          transformToObject(key, object[key])
      );
    }
  }
  fullStore.reportTracker = objectValuesArray;
}
populateFullReportTracker();


/**
 * Populate the stationDetails in the quickStore with the data from a Station in the QaCheck interface format.
 * @param data An array of object strings.
 */
const populateQuickReportTracker = (data: string[]) => {
  const objectValuesArray: { ReportTrackerItem } = {};
  const combinedObject = data.reduce((result, jsonStr) => {
    const parsedObject = JSON.parse(jsonStr);
    return { ...result, ...parsedObject };
  }, {});

  for (const variableName in combinedObject) {
    objectValuesArray[variableName] = transformToObject(variableName, combinedObject[variableName]);
    objectValuesArray[variableName].passedCheck = isCorrectValue(variableName, combinedObject[variableName]);
  }
  quickStore.stationDetails = objectValuesArray;
};

/**
 * Check the value of a Station's key against the known correct values.
 * @param key A string of the object's key
 * @param value The current value to check if correct.
 */
const isCorrectValue = (key: string, value: any) => {
  const temp = key.toLowerCase();

  switch (temp) {
    case "id":
      return value === quickStore.correctStationValues['StationId'];

    case "name":
      return value === `Station ${quickStore.correctStationValues['StationId']}`;

    case "lablocation":
      return value === stateStore.labLocation;
  }

  if (quickStore.correctStationValues[key] === undefined) {
    return undefined;
  }

  return quickStore.correctStationValues[key] === value
}

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
  stateStore.isAwaitingResponse = false;

  //[0]Message type | [1]Message details
  const message = stateStore.splitStringWithLimit(info.mainText, ":", 2);


  if (info.mainText.includes("WindowChecks") || info.mainText.includes("SoftwareChecks") || info.mainText.includes("SteamConfigChecks")) {
    console.log(info.mainText.split(":::"))
    const qaChecks = JSON.parse(info.mainText.split(":::")[1]).map(element => {
      var qa = {} as QaCheck
      qa.passedStatus = element._passedStatus
      qa.message = element._message
      qa.checkId = element._checkId
      return qa
    });
    fullStore.qaChecks.push(...qaChecks)
    return
  }

  switch(message[0]) {
    case "Connected":
      const responseData = JSON.parse(message[1])
      fullStore.connected = true
      fullStore.ApplianceList = responseData.appliances
      fullStore.StationList = responseData.stations
      console.log(responseData)
      // stateStore.isServerRunning = JSON.parse(message[1]);
      break;
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
      const dataArray = message[1].split("::::");

      const objectValuesArray: { ReportTrackerItem } = {};
      const dataObject = JSON.parse(dataArray[1]);
      for (const variableName in dataObject) {
        objectValuesArray[variableName] = transformToObject(variableName, dataObject[variableName]);
        objectValuesArray[variableName].passedCheck = isCorrectValue(variableName, dataObject[variableName]);
      }
      quickStore[`station${dataArray[0]}Details`] = objectValuesArray;
      break;

    case "StationAll":
      const data = message[1].split("::::");
      populateQuickReportTracker(data);
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
  stateStore.isAwaitingResponse = false;

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
const notificationRef = ref<InstanceType<typeof NotificationModal> | null>(null)
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
  <NotificationModal ref="notificationRef" :title="title" :message="message"/>
</template>

<style lang="less">
@import './assets/css/styles.less';
</style>
