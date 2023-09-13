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
  <GenericButton v-if="props.meta['prev']" type="light" :callback="goPrevLink"
   >Previous
  </GenericButton>

  <div class="grow"></div>

  <GenericButton v-if="props.meta['canSkip'] !== undefined && props.meta['next']" type="secondary" :callback="goNextLinkWithComment"
   >Skip
  </GenericButton>

  <GenericButton v-if="props.meta['next']" type="secondary" :disabled="!canProceed" :callback="goNextLink"
   >Next
  </GenericButton>

  <!--Modal to handle the skip check comment-->
  <SkipCheckModal ref="skipCheckRef" :callback="goNextLink"/>
</template>
<style></style>
