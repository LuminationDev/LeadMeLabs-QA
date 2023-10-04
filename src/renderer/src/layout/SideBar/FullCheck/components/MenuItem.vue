<script setup lang="ts">
import base from '@renderer/assets/icons/nav-icon-base.svg';
import active from '@renderer/assets/icons/nav-icon-active.svg';
import complete from '@renderer/assets/icons/nav-icon-complete.svg';
import incomplete from '@renderer/assets/icons/nav-icon-incomplete.svg';
import activeSetup from '@renderer/assets/icons/nav-icon-active-setup.svg';
import completeSetup from '@renderer/assets/icons/nav-icon-complete-setup.svg';
import { useRouter } from "vue-router";

defineProps({
  title: {
    type: String,
    required: true
  },
  route: {
    type: String,
    required: true
  },
  current: {
    type: Boolean,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  //Loads the purple icons instead of the normal blue
  setup: {
    type: Boolean,
    required: false,
    default: false
  }
});

const router = useRouter();
</script>

<template>
  <div class="flex flex-row items-center my-3">
    <div class="mr-2">
      <img v-if="status === 'pending'" :src="base" alt="base"/>
      <img v-else-if="status === 'active'" :src="setup ? activeSetup : active" alt="active"/>
      <img v-else-if="status === 'incomplete'" :src="incomplete" alt="active"/>
      <img v-else-if="status === 'complete'" :src="setup ? completeSetup : complete" alt="complete"/>
    </div>

    <div @click="router.push(route)" class="cursor-pointer text-sm" :class="{'font-semibold': status === 'active'}">
      {{title}}
    </div>
  </div>
</template>
