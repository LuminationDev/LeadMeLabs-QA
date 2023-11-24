<script setup lang="ts">
import { RouterLink } from "vue-router";

defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  }
});
</script>

<template>
  <router-link
      class="w-full h-full flex flex-col justify-center items-center rounded-2xl border-2 border-gray-200 hover:bg-gray-50"
      :to="to"
  >
    <slot></slot>
    <div class="font-semibold text-base mb-1">
      {{title}}
    </div>

    <div class="text-sm text-gray-400">
      {{subtitle}}
    </div>
  </router-link>
</template>
