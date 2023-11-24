<script setup lang="ts">
import Landing from "./views/Landing.vue";
import router from './router/router';
const pushRoute = (value: string) => {
  router.push(value);
}
</script>

<template>
  <Landing @push-route="pushRoute"/>
</template>
