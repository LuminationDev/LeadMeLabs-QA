<script setup lang="ts">
import ToolSetup from "@renderer/components/_generic/welcome/ToolSetup.vue";
import ToolSelection from "@renderer/components/_generic/welcome/ToolSelection.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <ToolSetup v-if="route.name === 'welcome'"/>

  <ToolSelection v-else />
</template>
