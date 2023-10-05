<script setup lang="ts">
import base from '@renderer/assets/icons/nav-icon-base.svg';
import { useRouter } from "vue-router";
import NavIconActive from "@renderer/assets/icons/NavIconActive.vue";
import NavIconComplete from "@renderer/assets/icons/NavIconComplete.vue";

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
      <NavIconActive v-else-if="status === 'active'" :fill="setup ? '#7839EE': '#1570EF'"/>
      <NavIconActive v-else-if="status === 'incomplete'" :fill="setup ? '#7839EE': '#1570EF'" :complete="false" />
      <NavIconComplete v-else-if="status === 'complete'" :fill="setup ? '#7839EE': '#1570EF'"/>
    </div>

    <div @click="router.push(route)" class="cursor-pointer text-sm" :class="{'font-semibold': status === 'active'}">
      {{title}}
    </div>
  </div>
</template>
