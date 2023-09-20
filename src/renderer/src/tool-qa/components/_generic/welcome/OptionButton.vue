<script setup lang="ts">
import { RouterLink } from "vue-router";

defineProps({
  title: {
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
      class="w-full h-full flex justify-center items-center rounded-2xl border-2 border-gray-300
      bg-gradient-to-br from-white to-gray-100 text-gray-600 hover:no-underline hover:bg-gradient-to-br
      hover:from-gray-100  hover:text-gray-800 transition-all duration-300 ease-in-out shadow-md"
      :to="to"
  >
    {{title}}
  </router-link>
</template>
