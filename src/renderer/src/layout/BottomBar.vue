<script setup lang="ts">
import GenericButton from '@renderer/components/_generic/buttons/GenericButton.vue'
import SkipCheckModal from "@renderer/modals/SkipCheckModal.vue";
import router from '../router/router'
import { computed, ref } from "vue";
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
 * Go to the next link but show the comment modal before moving on.
 */
const goNextLinkWithComment = (): void => {
  openSkipCheckModal();
}

/**
 * If the route requires user input, check the stateStore to see if the user has
 * entered the correct information. Block the next route until they do.
 */
const canProceed = computed(() => {
  return props.meta['userInput'] !== true || stateStore.canProceed;
});

const skipCheckRef = ref<InstanceType<typeof SkipCheckModal> | null>(null)
const openSkipCheckModal = () => {
  skipCheckRef.value?.openModal();
}
</script>
<template>
  <!--TODO replace with the proper section below when design is ready-->
  <img class="w-32 cursor-pointer hover:bg-blue-400" v-if="props.meta['prev']" @click="goPrevLink" alt="previous" src="../assets/deleteLater/back.png">

  <div class="grow"></div>

  <img v-if="props.meta['canSkip'] !== undefined && props.meta['next']" @click="goNextLinkWithComment" class="w-32 cursor-pointer bg-gray-600 hover:bg-blue-500" alt="previous" src="../assets/deleteLater/skip.png">
  <img v-if="props.meta['next'] && canProceed" @click="goNextLink" class="w-32 cursor-pointer hover:bg-blue-400" alt="previous" src="../assets/deleteLater/next.png">
  <img v-if="props.meta['next'] && !canProceed" class="w-32" alt="previous" src="../assets/deleteLater/next_disabled.png">


  <!--<GenericButton v-if="props.meta['prev']" type="light" :callback="goPrevLink"-->
  <!-- >Previous-->
  <!--</GenericButton>-->
  <!--<div class="grow"></div>-->
  <!--<GenericButton v-if="props.meta['canSkip'] !== undefined && props.meta['next']" type="secondary" :callback="goNextLinkWithComment"-->
  <!-- >Skip-->
  <!--</GenericButton>-->
  <!--<GenericButton v-if="props.meta['next'] && !canProceed" type="secondary" :callback="goNextLink"-->
  <!-- >Next-->
  <!--</GenericButton>-->

  <!--Modal to handle the skip check comment-->
  <SkipCheckModal ref="skipCheckRef" :callback="goNextLink"/>
</template>
<style></style>
