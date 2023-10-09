<script setup lang="ts">
import base from '@renderer/assets/icons/nav-icon-base.svg';
import NavIconActive from "@renderer/assets/icons/NavIconActive.vue";
import NavIconComplete from "@renderer/assets/icons/NavIconComplete.vue";
import { useRouter } from "vue-router";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { computed } from "vue";

const props = defineProps({
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

const fullStore = useFullStore();
const router = useRouter();

/**
 * Only allow the user to navigate to a new menu item if they have progressed to that point already.
 */
const attemptToPushRoute = () => {
  const pageRoute = router.getRoutes().find(entry => entry.path.includes(props.route));
  const pageProgress = pageRoute.meta['progress'];

  if(pageProgress <= fullStore.maxProgress) {
    router.push(props.route)
  }
}

/**
 * Check if a user is able to click on link.
 */
const clickable = computed(() => {
  const pageRoute = router.getRoutes().find(entry => entry.path.includes(props.route));
  const pageProgress = pageRoute.meta['progress'];

  return pageProgress <= fullStore.maxProgress;
});
</script>

<template>
  <div class="flex flex-row items-center my-3">
    <div class="mr-2">
      <img v-if="status === 'pending'" :src="base" alt="base"/>
      <NavIconActive v-else-if="status === 'active'" :fill="setup ? '#7839EE': '#1570EF'"/>
      <NavIconActive v-else-if="status === 'incomplete'" :fill="setup ? '#7839EE': '#1570EF'" :complete="false" />
      <NavIconComplete v-else-if="status === 'complete'" :fill="setup ? '#7839EE': '#1570EF'"/>
    </div>

    <div @click="attemptToPushRoute" class="text-sm" :class="{'font-semibold': status === 'active', 'cursor-pointer': clickable}">
      {{title}}
    </div>
  </div>
</template>
