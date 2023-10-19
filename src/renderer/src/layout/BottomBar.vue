<script setup lang="ts">
import GenericButton from '@renderer/tool-qa/components/_generic/buttons/GenericButton.vue'
import SkipCheckModal from "@renderer/tool-qa/modals/SkipCheckModal.vue";
import CommentModal from "@renderer/tool-qa/modals/CommentModal.vue";
import router from '../router/router'
import * as FULL from '../assets/checks/_fullcheckValues';
import { computed } from "vue";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { useRoute } from "vue-router";
import { QaCheckResult } from "../tool-qa/types/_qaCheckResult";
import {Comment} from "@renderer/tool-qa/interfaces/_report";

const fullStore = useFullStore();
const stateStore = useStateStore();
const route = useRoute();
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
  if (route.name === 'full-setup-devices-tablets') {
    fullStore.buildQaList();
    populateFullReportTrackerWithAutoChecks();
  }
}

/**
 * Run through each of the automatic checks in each section. Adding the required details and target devices to the
 * fullStore.reportTracker. The specific devices are then added on the auto check page when the results come in.
 */
const populateFullReportTrackerWithAutoChecks = () => {
  fullStore.qaGroups
      .forEach(group => {
        if (group.section !== null) {
          group.checks.forEach(check => {
            const targetDevices = determineTargetDevices(check);
            const checkItems = {key: check.id, description: check.extendedDescription}
            fullStore.addCheckToReportTracker(group.section, group.id, checkItems, targetDevices);
          });
        }
      });
}

const determineTargetDevices = (check: QaCheckResult) => {
  return {
    "station": check.targets['station'],
    "tablet": check.targets['tablet'],
    "nuc": check.targets['nuc'],
    "cbus": check.targets['cbus']
  };
};

/**
 * If the route requires user input, check the stateStore to see if the user has
 * entered the correct information. Block the next route until they do.
 */
const canProceed = computed(() => {
  return props.meta['userInput'] !== true || stateStore.canProceed || true;
});

const addComment = (comment: string) => {
  const sectionName = route.meta['parent']; //Auto check
  const pageName: string = <string>route.meta['page'] || <string>route.meta['checkType'];

  if (!sectionName && !pageName) {
    return; // Neither sectionName nor pageName is defined
  }

  const key = sectionName || FULL[pageName?.toUpperCase()]?.parent; //Manual check

  if (key) {
    const section = fullStore.reportTracker[key][<string>pageName];
    section['comments'] ||= [];
    section['comments'].push({ date: stateStore.formattedDate(true), content: comment });
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

  return (key && fullStore.reportTracker[key]?.[<string>pageName]?.comments) ?? [];
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
