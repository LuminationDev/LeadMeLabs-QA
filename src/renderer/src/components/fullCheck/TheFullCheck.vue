<script setup lang="ts">
import Description from "@renderer/components/checks/Description.vue";
import GenericLayout from "@renderer/components/checks/GenericLayout.vue";
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
      <Description v-if="route.name === 'full-description'"/>
    </template>
  </GenericLayout>
</template>
