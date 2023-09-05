<script setup lang="ts">
import NUCSettings from "@renderer/components/checks/nucSettings/NUCSettings.vue";
</script>

<template>
    <div class="w-full h-auto my-4 flex flex-col">
      <p class="text-lg text-black mb-3">Home Page</p>

      <div class="w-full h-auto mb-4 flex flex-col">
        <hr class="my-4">

        <!--Show the Stations from the NUC/station_list.json-->
        <NUCSettings />
      </div>
    </div>
</template>
