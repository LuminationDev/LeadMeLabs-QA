<script setup lang="ts">
import { computed, ref} from "vue";
import * as CONSTANT from "../../../assets/constants";
import SpinnerButton from "../../../components/buttons/SpinnerButton.vue";
import { useNetworkStore } from "../../store/passwordStore";

const networkStore = useNetworkStore();
const deviceIp = ref("");

const attemptDeviceConnection = () => {
  networkStore.connectionState = "loading";

  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.NETWORK_CHANNEL, {
    channelType: "attempt_device_connection",
    id: "deviceConnection",
    value: deviceIp.value
  });
}

const buttonText = computed(() => {
  switch (networkStore.connectionState) {
    case "waiting":
      return "Test connection";
    case "loading":
      return "Testing connection";
    default:
      return "Test again";
  }
});

const connectionState = computed(() => {
  return networkStore.connectionState;
});
</script>

<template>
  <div class="w-full border-2 border-gray-200 rounded-xl p-4 flex flex-col">
    <div class="flex flex-row items-center mb-3">
      <img class="h-12 w-12 mr-4" src="../../../assets/icons/network-icon.svg" alt="network"/>
      <div class="text-base font-semibold">Enter a device's IP Address</div>
    </div>
    <div class="flex flex-row">
      <div class="ml-16 flex flex-col">
        <label for="deviceIp" class="text-sm font-semibold">IP Address</label>

        <div class="relative">
          <input type="text" name="deviceIp" v-model="deviceIp" placeholder="192.168.1.99" class="w-80 h-10 my-2 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"
              :class="{
                'border-red-400': connectionState === 'failed',
                'border-green-400': connectionState === 'passed',
              }"
          />

          <img v-if="connectionState === 'failed' || connectionState === 'passed'" class="absolute h-4 right-0 top-5 mr-3"
               :src="connectionState === 'failed' ? '../../../assets/icons/auto-checked-failed.svg' : '../../../assets/icons/auto-checked-passed.svg'"
               alt="icon"/>
        </div>

        <div v-if="connectionState === 'failed' || connectionState === 'passed'" class="text-xs"
            :class="{
              'text-red-400': connectionState === 'failed',
              'text-green-400': connectionState === 'passed',
            }">
          {{connectionState === 'failed' ? 'Could not connect to device.' : 'Connection successful.'}}
        </div>

        <div class="flex flex-row items-center mt-7">
          <SpinnerButton :text="buttonText" :state="connectionState" :callback="attemptDeviceConnection"/>
        </div>
      </div>
    </div>
  </div>
</template>
