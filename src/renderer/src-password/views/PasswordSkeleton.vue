<script setup lang="ts">
import PasswordHeader from "./PasswordHeader.vue";
import PasswordFooter from "./PasswordFooter.vue";
import PasswordLogin from "../components/screen/PasswordLogin.vue";
import { useRoute } from "vue-router";
import PasswordGeneration from "../components/screen/PasswordGeneration.vue";

const route = useRoute();
</script>

<template>
  <div class="w-full h-full flex flex-col justify-between overflow-hidden">
    <div class="flex flex-row">
      <PasswordHeader/>
    </div>

    <div class="flex flex-row w-full h-full relative">
      <PasswordLogin v-if="route.name === 'password-login' || route.name === 'password-login-main'" />
      <PasswordGeneration v-if="route.name === 'password-generation'"/>
    </div>

    <PasswordFooter :prev="route.meta['prev']" :next="route.meta['next']" />
  </div>
</template>
