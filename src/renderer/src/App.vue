<script setup lang="ts">
import NotificationModal from "@renderer/modals/NotificationModal.vue";
import BottomBar from "@renderer/layout/BottomBar.vue";
import Sidebar from "@renderer/layout/SideBar/Sidebar.vue";
import * as CONSTANT from './assets/constants/index';
import * as FULL from './assets/checks/_fullcheckValues';
import { TCPMessage, QaCheck, QaDetail } from "@renderer/interfaces";
import { RouterView, useRoute } from 'vue-router';
import { ref } from 'vue';
import { useQuickStore } from "@renderer/store/quickStore";
import { useStateStore } from './store/stateStore';
import { useFullStore } from "@renderer/store/fullStore";
import { Station, StationDetails } from "./types/_station";

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
    id: key,
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
const populateQuickReportTracker = (data: string) => {
  const items = JSON.parse(data);
  const qaChecks = items.map((element) => {
    const qa: QaCheck = {
      passedStatus: element._passedStatus || element.passedStatus,
      message: element._message || element.message || element._value || element.value,
      id: element._id || element.id,
    };

    //If no status is supplied check the local known values
    if (qa.passedStatus === undefined) {
      const correct = isCorrectValue(qa.id, qa.message);
      qa.passedStatus = correct !== undefined ? (correct ? 'passed' : 'failed') : undefined;
    }

    return qa;
  });

  const existingCheckIds = quickStore.stationDetails.map(item => item.id);
  const uniqueQAChecks = qaChecks.filter(item => !existingCheckIds.includes(item.id));

  quickStore.stationDetails = quickStore.stationDetails.concat(uniqueQAChecks);
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
      return value == quickStore.correctStationValues['StationId'];

    case "name":
      return value == `Station ${quickStore.correctStationValues['StationId']}`;

    case "lablocation":
      return value == stateStore.labLocation;
  }

  if (quickStore.correctStationValues[key] === undefined) {
    return undefined;
  }
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

  if (info.mainText.includes("StationChecks")) {
    const split = info.mainText.split(":::")
    console.log(split)
    const expectedId = split[2]
    const group = split[4]
    const qaChecks = JSON.parse(split[5]).map(element => {
      var qa = {} as QaCheck
      qa.passedStatus = element._passedStatus ?? element.passedStatus
      qa.message = element._message ?? element.message
      qa.id = element._id ?? element.id
      return qa
    });
    fullStore.qaChecks.push(...qaChecks)
    const index = fullStore.Stations.findIndex(element => element.expectedDetails.id == expectedId)
    if (index !== -1) {
      fullStore.Stations[index].qaChecks.push(...qaChecks)
    }

    fullStore.updateQaChecks(expectedId, group, qaChecks)

    const groupsToRun = fullStore.processQaList()
    groupsToRun.forEach(group => {
      fullStore.startQa(group)
      api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
        channelType: CONSTANT.CHANNEL.TCP_CLIENT_CHANNEL,
        key: stateStore.key,
        address: fullStore.nucAddress,
        port: 55556,
        data: CONSTANT.MESSAGE.RUN_GROUP + stateStore.getServerDetails + ":" + group
      });
    })

    return
  }

  if (info.mainText.includes("StationDetails")) {
    const split = info.mainText.split(":::")
    console.log(split)
    const expectedId = split[2]
    const index = fullStore.Stations.findIndex(element => element.expectedDetails.id == expectedId)
    let stationDetails = {} as StationDetails
    const qaDetails = JSON.parse(split[4]).map(element => {
      var qa = {} as QaDetail
      qa.value = element._value ?? element.value
      qa.message = element._message ?? element.message
      qa.id = element._id ?? element.id
      if (index !== -1) {
        console.log(qa.id, qa.value, fullStore.Stations[index].details)
        stationDetails[qa.id] = qa.value
        // todo go from key to detail
      }
      return qa
    });
    if (fullStore.Stations[index].details) {
      fullStore.Stations[index].details = { ...stationDetails, ...fullStore.Stations[index].details }
    } else {
      fullStore.Stations[index].details = stationDetails
    }
    fullStore.qaDetails.push(...qaDetails)

    return
  }

  switch(message[0]) {
    case "Connected":
      const responseData = JSON.parse(message[1])
      fullStore.connected = true
      fullStore.ApplianceList = responseData.appliances;
      fullStore.NucStationList = responseData.stations;
      fullStore.cbusConnection = responseData.cbus;

      console.log(responseData.stations)
      responseData.stations.forEach(station => {
        var s = new Station()
        s.expectedDetails = {
          ipAddress: station.ipAddress,
          nucIpAddress: "",
          name: station.name,
          installedApplications: station.installedApplications,
          id: station.id,
          room: station.room,
          macAddress: station.macAddress,
          ledRingId: station.ledRingId,
          labLocation: ""
        }
        fullStore.Stations.push(s)
        console.log(s)
      })
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

    case "StationNetwork":
    case "StationConfig":
    case "StationWindows":
    case "StationSoftware":
      populateQuickReportTracker(message[1]);
      break;

    case "cbusConnectionChecks":
      fullStore.cbusConnection = message[1];
      break;

    case "CbusValidation":
      const details = message[1].split(":");
      const foundItem = fullStore.ApplianceList.find(item =>
          item.automationBase == details[0] &&
          item.automationGroup == details[1] &&
          item.automationId == details[2]
      );

      if (!foundItem) return;

      const correct = foundItem.id === `${foundItem.type}-${details[3]}`;
      if(correct !== null) {
        foundItem.correctId = correct;

        if(correct === false) {
          foundItem.correct = correct;
        }
      }
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
    <div class="flex-col bg-white min-w-[122px] rounded-3xl">
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
