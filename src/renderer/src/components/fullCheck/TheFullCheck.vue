<script setup lang="ts">
import LabParameters from "@renderer/components/fullCheck/LabParameters.vue";
import GenericLayout from "@renderer/components/fullCheck/GenericLayout.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <!--TODO replace with the proper section below when design is ready-->
      <!--<p class="text-lg text-black mb-3">Quick Station Check</p>-->
      <img alt="title" src="../../assets/deleteLater/flcTitle.png" class="w-96"/>
    </template>

    <template v-slot:content>
      <!--TODO replace with the proper section when design is ready-->
      <!--Text describing the process?-->
      <img alt="title" src="../../assets/deleteLater/placeholder.png" class="w-full mb-4"/>

      <!--Set the station parameters-->
      <LabParameters v-if="route.name === 'full-setup'" />
    </template>
  </GenericLayout>
</template>
