<script setup lang="ts">
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import { useRoute } from "vue-router";
import { useStateStore } from "../../store/stateStore";
import { useFullStore } from "../../store/fullStore";

const route = useRoute();

const stateStore = useStateStore();
const fullStore = useFullStore();
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-xl font-semibold text-black mb-3">Stations</p>
    </template>

    <template v-slot:content>
      {{ fullStore.stations }}
    </template>
  </GenericLayout>
</template>