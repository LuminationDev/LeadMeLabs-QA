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
  <div class="w-full border-2 border-black rounded-lg py-1 px-2 flex flex-col my-2">
    <div class="flex flex-row justify-between items-center h-full">
      <div class="flex flex-row items-center">
        <StatusIcon class="w-8 h-8 mr-2">
          <template v-slot:icon="{ fill }">
            <WolSvg :fill="fill" />
          </template>
        </StatusIcon>
        <span class="col-span-4">Attempt to wake the Station</span>
      </div>

      <div class="flex flex-row items-center">
        <WakeOnLan title="Wake Station" device-name="Station" :mac-addresses="macAddresses" :disabled="macAddresses.length === 0"/>
      </div>
    </div>
  </div>
</template>
