<script setup lang="ts">
import CommentModal from "@renderer/tool-qa/modals/CommentModal.vue";
import ItemHover from "@renderer/tool-qa/components/_generic/statuses/ItemHover.vue";
import StatusHover from "@renderer/tool-qa/components/_generic/statuses/StatusHover.vue";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { computed, ref } from "vue";
import { Check } from "@renderer/tool-qa/interfaces/_report";

const props = defineProps({
  checkId: {
    type: String,
    required: true
  },
  check: {
    type: Object as () => Check,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});

const fullStore = useFullStore();
const stateStore = useStateStore();
const currentlySelected = ref("");
const expanded = ref(false);

/**
 * Add a comment to the fullStore reportTracker item that has been selected
 */
const addComment = (comment: string) => {
  props.check.comments.push({
    date: stateStore.formattedDate(true),
    content: comment
  });
}

//TODO ask Matt for clarification if a device that is not part of that test should be shown?
/**
 * Generate a message from a passed in device object. The message is displayed when hovered over a devices passedStatus.
 * @param device
 */
const generateMessage = (device: any) => {
  if (!props.check.targets[device.type]) {
    return "Not applicable";
  }

  return device.checks[props.checkId]?.message ?? 'No details provided';
}

/**
 * Show the user a quick view of if the tests were passed by all devices.
 */
const generateCategoryStatus = computed(() => {
  let { failed, skipped, passed, total } = { failed: 0, skipped: 0, passed: 0, total: 0 };

  const devices = props.check.devices;
  const deviceIds = Object.keys(devices);

  total += deviceIds.length;

  for (const deviceId of deviceIds) {
    const { passedStatus: status } = devices[deviceId];

    if (status === 'passed') passed++;
    else if (status === 'failed') failed++;
    else if (status === 'skipped') skipped++;
  }

  if (total === 0 || skipped > 0) return 'skipped';
  if (failed > 0) return 'failed';
  if (passed === total) return 'passed';

  return 'unknown';
});

const getCheckStatus = (status: string | undefined, required: any) => {
  if( status !== undefined){
    return status
  }

  return required ? 'skipped' : 'unknown';
}
</script>

<template>
  <tr class="h-12 text-sm border border-gray-200">
    <td class="flex flex-row items-center">
      <div class="h-5 w-5 ml-1 -mr-2 cursor-pointer" @click="expanded = !expanded">
        <img v-if="expanded" src="../../../../../assets/icons/chevron-down.svg" alt="close" />
        <img v-else src="../../../../../assets/icons/chevron-right.svg" alt="expand" />
      </div>
      <ItemHover :title="stateStore.generateTitle(checkId)" :message="check.description "/>
    </td>

    <td class="p-3 w-36 text-center">
      {{check.date ?? "-"}}
    </td>

    <td class="p-3 w-28 font-semibold">
      <div class="flex mx-auto justify-center rounded-xl w-20 px-2" :class="{
                  'bg-red-100 border-[1px] border-red-300 text-red-700': generateCategoryStatus === 'failed',
                  'bg-green-100 border-[1px] border-green-300 text-green-700': generateCategoryStatus === 'passed',
                  'bg-yellow-100 border-[1px] border-yellow-300 text-yellow-600': generateCategoryStatus !== 'failed' && generateCategoryStatus !== 'passed',
                }">
        {{ stateStore.capitalizeFirstLetter(generateCategoryStatus ?? "Skipped") }}
      </div>
    </td>

    <td class="pl-6 p-3 w-28" v-on:click="currentlySelected = checkId">
      <CommentModal :mode="check['comments'] !== undefined && check['comments'].length > 0 ? 'icon' : 'icon-empty'"
                    :title="stateStore.generateTitle(checkId)"
                    :current-comments="check['comments']"
                    :callback="addComment"/>
    </td>
  </tr>

  <tr v-if="expanded" class="h-12 bg-gray-100 border border-gray-200">
    <td colspan="4" class="pl-8 text-xs">
      <div class="flex flex-row items-center">
        <div class="mr-4">
          Devices:
        </div>

        <div v-for="(device, index) in fullStore.orderedDevices" :key="index" class="flex flex-row items-center">
          {{device.prefix}}{{device.id}}
          <StatusHover class="w-9"
                       :message="generateMessage(device)"
                       :checking-status="device.checks[checkId]?.checkingStatus ?? 'not checked'"
                       :passed-status="getCheckStatus(device.checks[checkId]?.passedStatus, check.targets[device.type])"/>
        </div>
      </div>
    </td>
  </tr>
</template>

