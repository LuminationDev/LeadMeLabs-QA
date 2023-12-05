<script setup lang="ts">
import Modal from "./Modal.vue";
import { computed, ref } from "vue";
import { useNetworkStore } from "../src-network/store/networkStore";
import TickComponent from "../assets/icons/NetworkIconTick.vue";
import FailedComponent from "../assets/icons/NetworkIconAlert.vue";
import WifiComponent from "../assets/icons/NetworkIconWifi.vue";
import SignalComponent from "../assets/icons/NetworkIconSignal.vue";
import LinkComponent from "../assets/icons/NetworkIconLink.vue";
import DownloadComponent from "../assets/icons/NetworkIconDownload.vue";
import UploadComponent from "../assets/icons/NetworkIconUpload.vue";
import LatencyComponent from "../assets/icons/NetworkIconLatency.vue";
import DefaultComponent from "../assets/icons/NetworkIconTick.vue";
import {Check} from "../src-network/interfaces/_report";
import {DESCRIPTIONS} from "../assets/checks/_networkValues";

const props = defineProps({
  category: {
    type: String,
    required: true
  }
});

const networkStore = useNetworkStore();
const showModal = ref(false);

function openModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

const computedCategory = computed(() => {
  return networkStore.reportTracker[props.category];
});

const status = computed(() => {
  return networkStore.generateCategoryStatus(props.category);
});

const currentCheckMessage = (check: Check) => {
  if (check.checkingStatus === 'not_started') {
    return "Waiting";
  }

  return check.message.length !== 0 ? check.message : 'Testing';
}

const currentIconStatus = (status: string) => {
  switch (status) {
    case "passed":
      return "green";

    case "failed":
      return "red";

    default:
      return "blue";
  }
}

const dynamicIcon = (type: string) => {
  const iconMapping = {
    Network: WifiComponent,
    Ports: SignalComponent,
    Firewall: LinkComponent,
    Download: DownloadComponent,
    Upload: UploadComponent,
    Latency: LatencyComponent,
    // Add more mappings as needed
  };

  return iconMapping[type] || DefaultComponent; // Provide a default source if the type is not found
};
</script>

<template>
  <td class="text-center">
    <div @click="openModal" class="w-fit mx-auto font-semibold text-blue-600 cursor-pointer">More info</div>
  </td>

  <Teleport to="body">
    <Modal :show="showModal" @close="closeModal">
      <template v-slot:header>
        <header class="h-32 p-5 w-96 bg-white flex flex-col rounded-t-lg">
          <div class="flex flex-row justify-between">
            <div class="w-10 h-10 border border-zinc-200 rounded-lg items-center justify-center">
              <TickComponent v-if="status === 'passed'" fill="green" class="w-6 h-6"/>
              <FailedComponent v-else fill="red" class="w-6 h-6"/>
            </div>

            <img class="hover:cursor-pointer" v-on:click="showModal = false" src="../assets/icons/close.svg" alt="close"/>
          </div>

          <div class="bg-white flex flex-col mt-3">
            <span class="text-lg font-semibold text-gray-900 mb-1">{{category}}</span>
            <span class="text-xs font-medium text-black" v-html="DESCRIPTIONS[category][status]"/>
          </div>
        </header>
      </template>

      <template v-slot:content>
        <div class="bg-white px-5 w-96 max-h-96 overflow-auto pt-3 flex flex-col pb-3">
          <div class="flex flex-col border border-zinc-200 rounded-lg p-4 text-sm">
            <div v-for="(check, index) in computedCategory" :key="index"
                 class="w-full items-center flex justify-between mb-2 last:mb-0 text-blue-500"
                 :class="{
                'text-green-500': check.passedStatus === 'passed',
                'text-red-500': check.passedStatus === 'failed',
              }">

              <div class="items-center">
                <div class="w-8 h-8 mr-3 border border-zinc-200 rounded-lg items-center justify-center">
                  <component class="w-5 h-5" :is="dynamicIcon(check.type)" :fill="currentIconStatus(check.passedStatus)" />
                </div>

                <div>
                  {{check.id}}
                </div>
              </div>

              <div>
                {{currentCheckMessage(check)}}
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <footer class="bg-white h-20 px-5 rounded-xl text-right flex flex-row items-center">
          <button class="w-1/2 h-12 mr-4 border border-gray-300 text-gray-700 text-base rounded-lg hover:bg-gray-200 font-semibold"
                  v-on:click="showModal = false"
          >Back</button>

          <button class="w-1/2 h-12 bg-blue-500 text-white text-base rounded-lg hover:bg-blue-300 font-semibold"
                  v-on:click="showModal = false"
          >Confirm</button>
        </footer>
      </template>
    </Modal>
  </Teleport>
</template>
