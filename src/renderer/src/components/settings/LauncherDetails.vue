<script setup lang="ts">
import { useStateStore } from "../../store/stateStore";
const stateStore = useStateStore();
</script>

<template>
  <div class="flex flex-col">
    <div class="font-bold mb-2">Details</div>

    <div class="ml-2">Version Number: {{stateStore.version}}</div>

    <hr class="my-4">
  </div>
</template>
