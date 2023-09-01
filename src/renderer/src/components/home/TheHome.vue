<script setup lang="ts">
import NetworkSettings from '../checks/networkSettings/NetworkSettings.vue';
import WindowSettings from "../checks/windowSettings/WindowSettings.vue";
import SoftwareSettings from "../checks/softwareSettings/SoftwareSettings.vue";
</script>

<template>
    <div class="w-full h-auto my-4 flex flex-col">
      <p class="text-lg text-black mb-3">Home Page</p>

      <div class="w-full h-auto mb-4 flex flex-col">
        <hr class="my-4">

        <!--<NetworkSettings />-->
        <!--<WindowSettings />-->
        <SoftwareSettings />
      </div>
    </div>
</template>
