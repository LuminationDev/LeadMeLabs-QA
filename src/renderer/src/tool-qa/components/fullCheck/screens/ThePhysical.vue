<script setup lang="ts">
import Description from "@renderer/tool-qa/components/checks/Description.vue";
import BasicFullCheck from "@renderer/tool-qa/components/fullCheck/BasicFullCheck.vue";
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-lg text-black mb-3">Physical</p>
    </template>

    <template v-slot:content>
      <Description v-if="route.name === 'full-physical'"/>
      <BasicFullCheck v-if="route.name === 'full-keyboard'" title="Keyboard" object-name="KEYBOARD"/>
      <BasicFullCheck v-if="route.name === 'full-vive'" title="Vive Console" object-name="VIVE"/>
      <BasicFullCheck v-if="route.name === 'full-projector'" title="Projector" object-name="PROJECTOR"/>
    </template>
  </GenericLayout>
</template>
