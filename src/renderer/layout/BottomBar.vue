<script setup lang="ts">
import GenericButton from '@renderer/components/buttons/GenericButton.vue'
import SkipCheckModal from "@renderer/modals/SkipCheckModal.vue";
import CommentModal from "@renderer/modals/CommentModal.vue";
import { computed } from "vue";
import { useStateStore } from "../store/stateStore";
import { useRoute } from "vue-router";
import { addReportComment, initialiseFullReport } from "../src-qa/setup";
import { addExperienceComment, initialiseExperienceReport } from "../src-experiences/setup";
import { TOOL } from "../assets/constants"
import {Comment} from "../src-qa/interfaces/_report";
import * as FULL from "../assets/checks/_fullcheckValues";
import { useExperienceStore } from "../src-experiences/store/experienceStore";
import { useFullStore } from "../src-qa/store/fullStore";

const stateStore = useStateStore();
const route = useRoute();
const props = defineProps({
    meta: {
        type: Object,
        required: true
    }
})

const emit = defineEmits<{
  (e: 'pushRoute', value: string): void
}>()

const goPrevLink = (): void => {
  const { prev } = props.meta;
  emit('pushRoute', prev);
}

const goNextLink = (): void => {
  const { next } = props.meta;
  emit('pushRoute', next);
  if (route.name === 'full-setup-devices-tablets') {
    initialiseFullReport();
  }

  if (route.name === 'experiences-setup-devices-stations') {
    initialiseExperienceReport();
  }
}

const addComment = (comment: string) => {
  if (stateStore.toolType === TOOL.EXPERIENCE_LAUNCHER) {
    addExperienceComment(comment, <string>route.meta['parent'], <string>route.meta['page'], <string>route.meta['checkType']);
  } else {
    addReportComment(comment, <string>route.meta['parent'], <string>route.meta['page'], <string>route.meta['checkType']);
  }
}

const currentComments = computed((): Comment[] => {
  const sectionName = route.meta['parent'];
  const pageName: string = <string>route.meta['page'] || <string>route.meta['checkType'];
  let key;

  if (sectionName) {
    key = sectionName;
  } else if (pageName) {
    key = FULL[pageName?.toUpperCase()]?.parent;
  }

  if (stateStore.toolType === TOOL.EXPERIENCE_LAUNCHER) {
    return (key && useExperienceStore().reportTracker[key]?.[<string>pageName]?.comments) ?? [];
  } else {
    return (key && useFullStore().reportTracker[key]?.[<string>pageName]?.comments) ?? [];
  }
});

/**
 * If the route requires user input, check the stateStore to see if the user has
 * entered the correct information. Block the next route until they do.
 */
const canProceed = computed(() => {
  return props.meta['userInput'] !== true || stateStore.canProceed || true;
});
</script>

<template>
  <GenericButton v-if="props.meta['prev']" type="light" :callback="goPrevLink"
   >Back
  </GenericButton>

  <div class="grow"></div>

  <!--Skip without a comment-->
  <GenericButton class="mr-3" v-if="props.meta['canSkip'] !== undefined && props.meta['noComment'] !== undefined && props.meta['next']" type="text" :callback="goNextLink"
  >Skip
  </GenericButton>

  <!--Modal to handle the skip check comment-->
  <SkipCheckModal v-if="props.meta['canSkip'] !== undefined && props.meta['noComment'] === undefined && props.meta['next']" :callback="goNextLink"/>

  <!--Modal to handle adding a comment-->
  <CommentModal v-if="props.meta['addComment'] !== undefined" :current-comments="currentComments" :callback="addComment" />

  <GenericButton v-if="props.meta['next']" type="blue" :disabled="!canProceed" :callback="goNextLink" class="w-auto px-4"
   > {{props.meta['nextText'] ?? 'Next'}}
  </GenericButton>
</template>
<style></style>
