<script setup lang="ts">
import GenericButton from '@renderer/components/_generic/buttons/GenericButton.vue'
import router from '../router/router'
import { computed } from "vue";
import { useStateStore } from "@renderer/store/stateStore";

const stateStore = useStateStore();
const props = defineProps({
    meta: {
        type: Object,
        required: true
    }
})

const goPrevLink = (): void => {
  const { prev } = props.meta;
  router.push(prev)
}
const goNextLink = (): void => {
  const { next } = props.meta;
  router.push(next)
}

/**
 * If the route requires user input, check the stateStore to see if the user has
 * entered the correct information. Block the next route until they do.
 */
const canProceed = computed(() => {
  return props.meta['userInput'] !== true || stateStore.canProceed;
});
</script>
<template>
  <!--TODO replace with the proper section below when design is ready-->
  <img class="w-32 cursor-pointer hover:bg-blue-400" v-if="props.meta['prev']" @click="goPrevLink" alt="previous" src="../assets/deleteLater/back.png">

  <div class="grow"></div>

  <img class="w-32 cursor-pointer hover:bg-blue-400" v-if="props.meta['next'] && canProceed" @click="goNextLink" alt="previous" src="../assets/deleteLater/next.png">
  <img class="w-32" v-if="props.meta['next'] && !canProceed" alt="previous" src="../assets/deleteLater/next_disabled.png">


  <!--<GenericButton v-if="props.meta['prev']" type="light" :callback="goPrevLink"-->
  <!-- >Previous-->
  <!--</GenericButton>-->
  <!--<div class="grow"></div>-->
  <!--<GenericButton v-if="props.meta['next']" type="secondary" :callback="goNextLink"-->
  <!-- >Next-->
  <!--</GenericButton>-->
</template>
<style></style>
