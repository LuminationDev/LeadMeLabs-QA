<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {useStateStore} from "../../store/stateStore";
import {useRoute} from "vue-router";
import {QaCheckResult} from "../../types/_qaCheckResult";
import ItemHover from "../../components/statuses/ItemHover.vue";
import StatusHover from "../../components/statuses/StatusHover.vue";
import GenericLayout from "../../components/layouts/GenericLayout.vue";
import CheckStatus from "../../components/statuses/CheckStatus.vue";
import {useFullStore} from "../../src-qa/store/fullStore";
import fs from "fs";
import SpinnerButton from "../../components/buttons/SpinnerButton.vue";

const route = useRoute();
const stateStore = useStateStore();
const tempStore = stateStore.getStore

const checkingObj = ref({
  network_checks: {
    checkingStatus: 'unstarted',
  },
  security_checks: {
    checkingStatus: 'unstarted',
  },
  windows_checks: {
    checkingStatus: 'unstarted',
  },
  configuration_checks: {
    checkingStatus: 'unstarted',
  },
  software_checks: {
    checkingStatus: 'unstarted',
  },
  steam_config_checks: {
    checkingStatus: 'unstarted',
  },
  imvr_checks: {
    checkingStatus: 'unstarted',
  },
})
const isDone = computed(() => {
  return ['error', 'done'].includes(checkingObj.value.network_checks.checkingStatus) &&
  ['error', 'done'].includes(checkingObj.value.security_checks.checkingStatus) &&
  ['error', 'done'].includes(checkingObj.value.windows_checks.checkingStatus) &&
  ['error', 'done'].includes(checkingObj.value.configuration_checks.checkingStatus) &&
  ['error', 'done'].includes(checkingObj.value.software_checks.checkingStatus) &&
  ['error', 'done'].includes(checkingObj.value.steam_config_checks.checkingStatus) &&
  ['error', 'done'].includes(checkingObj.value.imvr_checks.checkingStatus)
})

const monitorCheck = () => {
  let stillRunning = false;
  let errorFound = false;

  tempStore.qaGroups
      .filter(group => group.id !== 'station_connection_checks')
      .forEach(group => {
        stillRunning = false;
        errorFound = false;
        group.checks.forEach(check => {
          [...check.stations, ...check.tablets, ...check.nuc, ...check.cbus].forEach(item => {
            if (item.checkingStatus === 'checking') {
              stillRunning = true;
            } else if (item.checkingStatus === 'timeout') {
              errorFound = true;
            }
          });
        });

        if (!stillRunning && errorFound) {
          checkingObj.value[group.id].checkingStatus = 'error'
        } else if (!stillRunning) {
          checkingObj.value[group.id].checkingStatus = 'done'
        } else {
          checkingObj.value[group.id].checkingStatus = 'testing'
        }
      });
}
watch(() => tempStore.qaGroups, monitorCheck, {deep: true});

const retryAutoCheck = () => {
  autoRun()
}

/**
 * On mount or route name change run the auto checks related to the current page. The route name change is necessary
 * as when two AutoCheck pages are back to page the onMounted is not triggered.
 */
const autoRun = () => {
  tempStore.startQa('network_checks');
  tempStore.startQa('windows_checks');
  tempStore.startQa('configuration_checks');
  tempStore.startQa('security_checks');
  tempStore.startQa('software_checks');
  tempStore.startQa('steam_config_checks');
  tempStore.startQa('imvr_checks');
}

/**
 * Start the auto test once the component has been mounted, check that the server and connection is up first.
 */
onMounted(() => {
  useFullStore().buildQaList()
  autoRun();
  startTime.value = new Date()
  updateDate()
});

const updateDate = function () {
  currentTime.value = new Date()
  setTimeout(() => {
    updateDate()
  }, 1000)
}

const startTime = ref(new Date())
const currentTime = ref(new Date())

function transformText(text: string) {
  text = text.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
  text = text.replace(/_/g, ' ')
  return text
}

const uploadState = ref('none')
const displayError = ref(false)
const displaySuccess = ref(false)
async function uploadReport() {
  uploadState.value = 'loading'
  displayError.value = false
  displaySuccess.value = false
  const response = await fetch("http://127.0.0.1:5001/leadme-labs/us-central1/simpleQaUpload", {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/plain",
      "SiteName": tempStore.reportTracker['labLocation']
    },
    body: JSON.stringify(tempStore.qaGroups.filter(group => group.id !== 'station_connection_checks'))
  })
  if (response.status !== 200) {
    displayError.value = true
  } else {
    displaySuccess.value = true
  }
  uploadState.value = 'done'
}

async function saveFile() {
  await api.ipcRenderer.invoke('save-simple-qa', { data: JSON.stringify(tempStore.qaGroups.filter(group => group.id !== 'station_connection_checks')) });
}


</script>

<template>
  <GenericLayout :separator="false">
    <template v-slot:content>
      <div class="flex flex-col justify-center items-center">

        <div class="flex flex-row justify-center items-center w-full py-24">
          <div class="scale-150" v-if="!isDone">
            <div class="scale-150">
              <div class="loader"></div>
            </div>
          </div>
          <div class="scale-150" v-else>
            <div class="wrapper scale-150" >
              <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="w-full items-center flex flex-col">
          <div
              v-for="group in tempStore.qaGroups.filter(group => group.id !== 'station_connection_checks')"
              :key="group.id"
              class="font-bold flex flex-row items-center justify-start w-72 h-12">
            <div v-if="checkingObj[group.id]?.checkingStatus === 'done' || checkingObj[group.id]?.checkingStatus === 'error'"
                 class="scale-50 w-12">
              <div class="wrapper" >
                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                  <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                  <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>
            </div>
            <div v-else class="w-12">
              <div class="scale-50">
                <div class="loader"></div>
              </div>
            </div>
            <span>{{ transformText(group.id) }}</span>
            <span v-if="checkingObj[group.id]?.checkingStatus !== 'done' && checkingObj[group.id]?.checkingStatus !== 'error'">
              &nbsp;({{ Math.floor((currentTime.getTime() -  startTime.getTime()) / 1000) }}s)
            </span>
          </div>
        </div>

        <div v-if="isDone" class="flex flex-col justify-center items-center">
          <SpinnerButton v-if="tempStore.reportTracker['labType'] === 'Online'" :callback="uploadReport" text="Upload Report" :state="uploadState" class="w-48"/>
          <div v-if="displayError" class="text-red-800">Upload error. Please click&nbsp;<span class="underline cursor-pointer" @click="saveFile">here</span>&nbsp;to save the file.</div>
          <div v-if="displaySuccess" class="text-green-800">Upload successful</div>
          <div v-if="tempStore.reportTracker['labType'] === 'Offline'">Please click&nbsp;<span class="underline cursor-pointer" @click="saveFile">here</span>&nbsp;to save the file.</div>
        </div>
      </div>
    </template>
  </GenericLayout>
</template>

<style lang="css" scoped>
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #FFF;
  border-bottom-color: #3274E4;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}



* {
  padding: 0;
  margin: 0
}

.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #7ac142;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards
}

.checkmark {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  margin: 10% auto;
  box-shadow: inset 0px 0px 0px #7ac142;
  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0
  }
}

@keyframes scale {
  0%, 100% {
    transform: none
  }
  50% {
    transform: scale3d(1.1, 1.1, 1)
  }
}

@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 30px #7ac142
  }
}

</style>
