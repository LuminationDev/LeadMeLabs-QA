<script setup lang="ts">
import StatusIcon from "../statuses/StatusIcon.vue";
import WakeOnLan from "./WakeOnLan.vue";
import WolSvg from "../../assets/icons/vue/WolSvg.vue";

defineProps({
  macAddresses: {
    type: Array<string>,
    default: []
  }
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
        <span class="text-lg font-semibold col-span-4">Attempt to wake the Stations</span>
      </div>

      <div class="flex flex-row items-center">
        <WakeOnLan title="Wake Stations" device-name="Stations" :mac-addresses="macAddresses" :disabled="macAddresses.length === 0"/>
      </div>
    </div>
  </div>
</template>
