<script setup lang="ts">
import Description from "@renderer/components/checks/Description.vue";
import BasicFullCheck from "@renderer/components/checks/BasicFullCheck.vue";
import GenericLayout from "@renderer/components/fullCheck/GenericLayout.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <!--TODO replace with the proper section below when design is ready-->
      <!--<p class="text-lg text-black mb-3">Quick Station Check</p>-->
      <img alt="title" src="../../../assets/deleteLater/networkTitle.png" class="w-56"/>
    </template>

    <template v-slot:content>
      <Description v-if="route.name === 'full-networking'"/>
      <BasicFullCheck v-if="route.name === 'full-cabling'" title="Cabling" object-name="CABLING"/>
      <BasicFullCheck v-if="route.name === 'full-network'" title="Network" object-name="NETWORK"/>
      <BasicFullCheck v-if="route.name === 'full-cbus'" title="CBus" object-name="CBUS"/>
      <BasicFullCheck v-if="route.name === 'full-security'" title="Security" object-name="SECURITY"/>
    </template>
  </GenericLayout>
</template>
