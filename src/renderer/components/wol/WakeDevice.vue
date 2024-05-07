<script setup lang="ts">
import StatusIcon from "../statuses/StatusIcon.vue";
import WakeOnLan from "./WakeOnLan.vue";
import WolSvg from "../../assets/icons/vue/WolSvg.vue";
import { computed, ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "Attempt to wake a device"
  },
  buttonTitle: {
    type: String,
    default: "Wake Device"
  },
  deviceName: {
    type: String,
    default: "Device"
  }
});

const expanded = ref(false);
const deviceMacAddress = ref("");

// A computed property to convert single MAC address string to a list
const macAddressList = computed(() => {
  return [{ mac: deviceMacAddress.value }];
});
</script>

<template>
  <div class="w-full border-2 border-gray-200 rounded-xl p-4 flex flex-col mb-4">
    <div class="flex flex-row justify-between items-center h-full">
      <div class="flex flex-row items-center">
        <StatusIcon class="w-16 h-16 mr-8">
          <template v-slot:icon="{ fill }">
            <WolSvg :fill="fill" />
          </template>
        </StatusIcon>
        <span class="text-lg font-semibold col-span-4">{{title}}</span>
      </div>

      <div class="h-7 w-7 cursor-pointer" @click="expanded = !expanded">
        <img v-if="expanded" src="../../assets/icons/arrowUp.svg" alt="up"/>
        <img v-else src="../../assets/icons/arrowDown.svg" alt="down"/>
      </div>
    </div>

    <div v-if="expanded" class="flex flex-col justify-center col-span-4 ml-24">
      <div class="flex flex-col">
        <label for="nucAddress" class="text-sm font-semibold">Mac address</label>
        <input type="text" name="nucAddress" v-model="deviceMacAddress" placeholder="AA-AA-AA-AA-AA-AA" class="w-80 h-10 my-2 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"/>

        <div class="flex flex-row items-center">
          <WakeOnLan :title="buttonTitle" :device-name="deviceName" :mac-addresses="macAddressList" :disabled="deviceMacAddress.length === 0"/>
        </div>
      </div>
    </div>
  </div>
</template>
