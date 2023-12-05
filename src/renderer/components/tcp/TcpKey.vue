<script setup lang="ts">
import { useStateStore } from '../../src-qa/store/stateStore';

const stateStore = useStateStore();
</script>

<template>
  <div class="flex flex-col">
    <input v-model="stateStore.key" class="bg-gray-100 w-56 h-8 mb-4 px-4 rounded" placeholder="Encryption key"/>
  </div>
</template>
