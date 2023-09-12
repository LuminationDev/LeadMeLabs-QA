<script setup lang="ts">
import Description from "@renderer/components/checks/Description.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div class="w-full h-auto my-4 flex flex-col">
    <!--TODO replace with the proper section below when design is ready-->
    <!--<p class="text-lg text-black mb-3">Quick Station Check</p>-->
    <img alt="title" src="../../assets/deleteLater/qscTitle.png" class="w-96"/>

    <hr class="my-4">

    <div class="w-full h-auto mb-4 flex flex-col">
      <!--TODO replace with the proper section when design is ready-->
      <!--Text describing the process?-->
      <img alt="title" src="../../assets/deleteLater/placeholder.png" class="w-full mb-4"/>

      <Description v-if="route.name === 'quick-description'"/>
    </div>
  </div>
</template>
