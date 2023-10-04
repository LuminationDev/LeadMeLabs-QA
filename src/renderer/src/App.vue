<script setup lang="ts">
import NotificationModal from "@renderer/tool-qa/modals/NotificationModal.vue";
import BottomBar from "@renderer/layout/BottomBar.vue";
import Sidebar from "@renderer/layout/SideBar/Sidebar.vue";
import * as CONSTANT from './assets/constants/index';
import { TCPMessage, QaCheck } from "tool-qa/interfaces";
import { RouterView, useRoute } from 'vue-router';
import { ref } from 'vue';
import { useQuickStore } from "@renderer/tool-qa/store/quickStore";
import { useStateStore } from './tool-qa/store/stateStore';
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { useConfigStore } from "@renderer/tool-config/store/configStore";
import { storeToRefs } from "pinia";
import { Station } from "./tool-qa/types/_station";
import ShowState from "@renderer/tool-config/components/helpers/showState.vue";

// Sentry.init({
//   dsn: "https://93c089fc6a28856446c8de366ce9836e@o1294571.ingest.sentry.io/4505763516973056",
// });

const route = useRoute()
const stateStore = useStateStore();
const quickStore = useQuickStore();
const fullStore = useFullStore();
const configStore = useConfigStore()
const { showPreview } = storeToRefs(configStore)

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
      displayName: ""
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
//@ts-ignore
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

    case CONSTANT.MESSAGE.LOAD_PROGRESS:
      fullStore.reportTracker = info.data;
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
  switch(message[0]) {
    case "ServerStatus":
      stateStore.isServerRunning = message[1].includes("true");
      break;
    case "ApplianceList":
      fullStore.ApplianceList = JSON.parse(message[1]);
      break;
    case "StationNetwork":
    case "StationConfig":
    case "StationWindows":
    case "StationSoftware":
      populateQuickReportTracker(message[1]);
      break;
  }


  console.log(info.mainText)
  const response = JSON.parse(info.mainText) // todo expected response type
  switch (response.response) {
    case "RunGroup": {
      const group = response.responseData.group
      const id = response.source.split(",")[1]

      const qaChecks = JSON.parse(response.responseData.data).map(element => {
        var qa = {} as QaCheck
        qa.passedStatus = element._passedStatus ?? element.passedStatus
        qa.message = element._message ?? element.message
        qa.id = element._id ?? element.id
        return qa
      });
      fullStore.qaChecks.push(...qaChecks)
      const index = fullStore.stations.findIndex(element => element.expectedDetails.id == id)
      if (index !== -1) {
        fullStore.stations[index].qaChecks.push(...qaChecks)
      }

      fullStore.updateQaChecks(id, group, qaChecks)

      const groupsToRun = fullStore.processQaList()
      groupsToRun.forEach(group => {
        fullStore.startQa(group)
        fullStore.sendMessage({
          action: CONSTANT.ACTION.RUN_STATION_GROUP,
          actionData: {
            group,
            stationIds: ['all']
          }
        })
      })
      break;
    }
    case "ExperienceLaunchAttempt": {
      const status = response.responseData.result
      const message = response.responseData.message
      const stationId = response.source.split(",")[1]
      const experienceId = response.responseData.experienceId
      fullStore.updateExperienceCheck(stationId, experienceId, status, message)
      break;
    }
    case "ExperienceLaunched": {
      const stationId = response.source.split(",")[1]
      const experienceId = response.responseData.experienceId
      fullStore.updateExperienceCheck(stationId, experienceId, "passed", "")
      break;
    }
    case "ExperienceLaunchFailed": {
      const stationId = response.source.split(",")[1]
      const experienceId = response.responseData.experienceId
      fullStore.updateExperienceCheck(stationId, experienceId, "failed", "")
      break;
    }
    case "GetVrStatuses": {
      const stationId = response.source.split(",")[1]
      fullStore.updateStationVrStatuses(stationId, response.responseData.result)
      break;
    }
    case "Connected": {
      fullStore.connected = true
      fullStore.ApplianceList = response.responseData.appliances;
      fullStore.cbusConnection = response.responseData.cbus;

      response.responseData.stations.forEach(station => {
        const s = new Station(station.id + "");
        s.expectedDetails = {
          ipAddress: station.ipAddress,
          nucIpAddress: "",
          name: station.name,
          installedApplications: station.installedApplications,
          id: station.id + "",
          room: station.room,
          macAddress: station.macAddress,
          ledRingId: station.ledRingId,
          labLocation: ""
        }
        fullStore.stations.push(s)
        fullStore.sendStationMessage(s.id, {
          action: CONSTANT.ACTION.CONNECT_STATION,
          actionData: {
            expectedStationId: s.id
          }
        })
      })
      fullStore.buildQaList(); //Build the QaList on connection response
      break;
    }
    case "TabletConnected": {
      fullStore.tabletConnected(response.ipAddress)
      break;
    }
    case "StationConnected": {
      console.log('stationConnected')
      fullStore.stationConnected(response.responseData.expectedStationId, response.responseData)
      break;
    }
    case "TabletChecks": {
      fullStore.tabletConnected(response.ipAddress)
      console.log(response.responseData)
      break;
    }
    case "CbusConnectionValidation": {
      fullStore.cbusConnection = response.responseData.result;
    }
    case "CbusValidation": {
      const details = response.responseData.result;
      const foundItem = fullStore.ApplianceList.find(item =>
          item.automationBase == details.automationBase &&
          item.automationGroup == details.automationGroup &&
          item.automationId == details.automationId
      );

      if (!foundItem) return;

      const correct = foundItem.id === `${foundItem.type}-${details.address}`;
      if (correct !== null) {
        foundItem.correctId = correct;

        if (correct === false) {
          foundItem.correct = correct;
        }
      }
      break;
    }
  }

  // if (info.mainText.includes("StationChecks")) {
  //   const split = info.mainText.split(":::")
  //   console.log(split)
  //   const expectedId = split[2]
  //   const group = split[4]
  //   const qaChecks = JSON.parse(split[5]).map(element => {
  //     var qa = {} as QaCheck
  //     qa.passedStatus = element._passedStatus ?? element.passedStatus
  //     qa.message = element._message ?? element.message
  //     qa.id = element._id ?? element.id
  //     return qa
  //   });
  //   fullStore.qaChecks.push(...qaChecks)
  //   const index = fullStore.Stations.findIndex(element => element.expectedDetails.id == expectedId)
  //   if (index !== -1) {
  //     fullStore.Stations[index].qaChecks.push(...qaChecks)
  //   }
  //
  //   fullStore.updateQaChecks(expectedId, group, qaChecks)
  //
  //   const groupsToRun = fullStore.processQaList()
  //   groupsToRun.forEach(group => {
  //     fullStore.startQa(group)
  //     fullStore.sendMessage({
  //       action: CONSTANT.ACTION.RUN_STATION_GROUP,
  //       actionData: {
  //         group,
  //         stationIds: ['all']
  //       }
  //     })
  //   })
  //
  //   return
  // }

  // if (info.mainText.includes("StationDetails")) {
  //   const split = info.mainText.split(":::")
  //   console.log(split)
  //   const expectedId = split[2]
  //   const index = fullStore.Stations.findIndex(element => element.expectedDetails.id == expectedId)
  //   let stationDetails = {} as StationDetails
  //   const qaDetails = JSON.parse(split[4]).map(element => {
  //     var qa = {} as QaDetail
  //     qa.value = element._value ?? element.value
  //     qa.message = element._message ?? element.message
  //     qa.id = element._id ?? element.id
  //     if (index !== -1) {
  //       console.log(qa.id, qa.value, fullStore.Stations[index].details)
  //       stationDetails[qa.id] = qa.value
  //       // todo go from key to detail
  //     }
  //     return qa
  //   });
  //   if (fullStore.Stations[index].details) {
  //     fullStore.Stations[index].details = { ...stationDetails, ...fullStore.Stations[index].details }
  //   } else {
  //     fullStore.Stations[index].details = stationDetails
  //   }
  //   fullStore.qaDetails.push(...qaDetails)
  //
  //   return
  // }
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
    <div class="flex-col bg-white min-w-[220px] rounded-xl">
      <Sidebar />
    </div>

    <div class="content flex-col bg-white ml-2 rounded-xl w-full min-w-[30rem] justify-between overflow-auto pt-0">
      <RouterView class="px-4" />

      <div class="sticky bottom-0 shrink-0 w-full h-20 flex-row justify-between items-center border-t-2 px-4 bg-white">
        <BottomBar :meta="route.meta" />
      </div>
    </div>

    <div v-if="showPreview" class="content flex flex-col bg-white w-96 flex-shrink-0 max-h-[98vh] rounded-xl ml-2">
      <ShowState />
    </div>
  </div>

  <!--Modal to handle error messages from the backend-->
  <NotificationModal ref="notificationRef" :title="title" :message="message"/>
</template>

<style lang="less">
@import './assets/css/styles.less';
</style>
