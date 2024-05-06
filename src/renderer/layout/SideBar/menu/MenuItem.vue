<script setup lang="ts">
import base from '../../../assets/icons/nav-icon-base.svg';
import NavIconActive from "../../../assets/icons/vue/NavIconActive.vue";
import NavIconComplete from "../../../assets/icons/vue/NavIconComplete.vue";
import { useRouter } from "vue-router";
import { useExperienceStore } from "../../../src-experiences/store/experienceStore";
import { computed } from "vue";
import {useStateStore} from "../../../store/stateStore";

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

const stateStore = useStateStore();
const tempStore = stateStore.getStore;
const router = useRouter();

/**
 * Only allow the user to navigate to a new menu item if they have progressed to that point already.
 */
const attemptToPushRoute = () => {
  const pageRoute = router.getRoutes().find(entry => entry.path.includes(props.route));
  const pageProgress = pageRoute?.meta['progress'];

  if (pageProgress === undefined || pageProgress === null) {
    return;
  }

  if(pageProgress <= tempStore.maxProgress) {
    router.push(props.route)
  }
}

/**
 * Check if a user is able to click on link.
 */
const clickable = computed(() => {
  const pageRoute = router.getRoutes().find(entry => entry.path.includes(props.route));
  const pageProgress = <number|undefined>pageRoute?.meta['progress'];

  if (pageProgress === undefined) {
    return false;
  }

  return pageProgress <= tempStore.maxProgress;
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
