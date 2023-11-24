<script setup lang="ts">
import GenericButton from '@renderer/src-qa/components/_generic/buttons/GenericButton.vue'
import SkipCheckModal from "@renderer/src-qa/modals/SkipCheckModal.vue";
import CommentModal from "@renderer/src-qa/modals/CommentModal.vue";
import * as FULL from '../assets/checks/_fullcheckValues';
import { computed } from "vue";
import { useFullStore } from "../src-qa/store/fullStore";
import { useStateStore } from "../src-qa/store/stateStore";
import { useRoute } from "vue-router";
import { QaCheckResult } from "../src-qa/types/_qaCheckResult";
import { Comment } from "../src-qa/interfaces/_report";
import { ALL_VALUES, HANDOVER } from "../assets/checks/_fullcheckValues";

const fullStore = useFullStore();
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
    populateFullReportTrackerWithManualChecks();
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
 * Populate the fullStore.reportTracker with the basic sections and categories as laid out in the _fullcheckValues.ts
 * The individual checks will be added when that page is visited. If no checks are present in a section or category it
 * is considered skipped.
 */
const populateFullReportTrackerWithManualChecks = () => {
  if (fullStore.reportTracker["labType"] === "Offline") {
    HANDOVER.category[0]['Handover details'].checks["Timezone"] = {
      description: "Has the time zone been set to the correct location.",
      guide: [
        {
          imageSource: null,
          text: '<h3>Open Settings</h3><p>Check the timezone dropdown.</p>'
        }
      ]
    }

    HANDOVER.category[0]['Handover details'].checks["Date time"] = {
      description: "Is the date and time set correctly.",
      guide: [
        {
          imageSource: null,
          text: '<h3>Open Settings</h3><p>Check the current date and time section.</p>'
        }
      ]
    }
  }

  for (const { parent, page, category } of ALL_VALUES.flat()) {
    fullStore.reportTracker[parent] ??= {};
    fullStore.reportTracker[parent][page] ??= {};

    for (const subCategory of category) {
      const checks = Object.entries(subCategory[Object.keys(subCategory)[0]].checks);

      for (const [check, { description }] of checks) {
        fullStore.reportTracker[parent][page][check] ??= {
          description,
          comments: [],
          targets: subCategory[Object.keys(subCategory)[0]].targets,
          devices: {}
        };
      }
    }
  }
};
populateFullReportTrackerWithManualChecks();

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
