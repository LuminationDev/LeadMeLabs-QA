<script setup lang="ts">
import { ref } from "vue";
import { Station } from "@renderer/interfaces";
import { useFullStore } from "@renderer/store/fullStore";

const fullStore = useFullStore();

defineProps({
  station: Object as () => Station,
  nucAddress: {
    type: String,
    required: false,
    default: ""
  },
});
</script>

<template>
  <div class="flex flex-col">
    <div>
      <span class="w-32 font-semibold">Name:</span>
      {{station.name}}
    </div>

    <div>
      <span class="w-32 font-semibold">Id:</span>
      {{station.id}}
    </div>

    <div>
      <span class="w-32 font-semibold">Room:</span>
      {{station.room}}
    </div>

    <div>
      <span class="w-32 font-semibold">IP Address:</span>
      {{station.ipAddress}}
    </div>

    <div>
      <span class="w-32 font-semibold">Mac Address:</span>
      {{station.macAddress}}
    </div>

    <!--Show the Station's set NUC address or load the saved NUC address-->
    <div :class="{'text-red-500': nucAddress.length === 0 && fullStore.nucAddress !== station.nucIpAddress}">
      <span class="w-32 font-semibold">NUC Address:</span>
      {{nucAddress.length === 0 ? station.nucIpAddress : nucAddress}}
    </div>

    <div>
      <span class="w-32 font-semibold">LED ring:</span>
      {{station.ledRingId ?? "N/A"}}
    </div>

    <div>
      <span class="w-32 font-semibold">Lab Location:</span>
      {{station.labLocation ?? "N/A"}}
    </div>
  </div>
</template>
