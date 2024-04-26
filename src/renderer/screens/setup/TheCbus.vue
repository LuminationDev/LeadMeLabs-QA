<script setup lang="ts">
import CbusSvg from "../../assets/icons/CbusSvg.vue";
import StatusIcon from "../../components/statuses/StatusIcon.vue";
import { useFullStore } from "../../src-qa/store/fullStore";

const fullStore = useFullStore();
</script>

<template>
  <div class="w-full border-2 border-gray-200 rounded-xl p-4 flex flex-col mb-4">
    <div class="flex flex-row items-center h-full">
      <StatusIcon :status="fullStore.getCbusConnection ? 'green' : 'yellow'" class="w-16 h-16 mr-8">
        <template v-slot:icon="{ fill }">
          <CbusSvg :fill="fill" />
        </template>
      </StatusIcon>
      <span class="text-lg font-semibold col-span-4">{{
          fullStore.getCbusConnection ? 'C-Bus is connected' : 'C-Bus is not connected'
        }}</span>
    </div>
  </div>
</template>
