<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <router-link class="hover:no-underline" to="/check/quick">
    <img @click="" class="cursor-pointer hover:bg-blue-200" alt="quick station check" src="../../../assets/deleteLater/qsc.png">
  </router-link>

  <router-link class="hover:no-underline" to="/check/full">
    <img class="cursor-pointer hover:bg-blue-200" alt="quick station check" src="../../../assets/deleteLater/flc.png">
  </router-link>
</template>
