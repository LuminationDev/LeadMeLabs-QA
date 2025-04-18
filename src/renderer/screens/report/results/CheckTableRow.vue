<script setup lang="ts">
import CommentModal from "../../../modals/CommentModal.vue";
import ItemHover from "../../../components/statuses/ItemHover.vue";
import StatusHover from "../../../components/statuses/StatusHover.vue";
import { useStateStore } from "../../../store/stateStore";
import { computed, ref } from "vue";
import { Check } from "../../../interfaces/_report";

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

const stateStore = useStateStore();
const tempStore = stateStore.getStore;
const currentlySelected = ref("");
const expanded = ref(false);

/**
 * Add a comment to the tempStore reportTracker item that has been selected
 */
const addComment = (comment: string) => {
  props.check.comments.push({
    date: stateStore.formattedDate(true),
    content: comment
  });
}

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
  let { failed, skipped, passed, warning, not_applicable, total } =
      { failed: 0, skipped: 0, passed: 0, warning: 0, not_applicable: 0, total: 0 };

  const devices = props.check.devices;
  if(devices === undefined || devices === null) return;
  const deviceIds = Object.keys(devices);

  total += deviceIds.length;

  for (const deviceId of deviceIds) {
    const { passedStatus: status } = devices[deviceId];

    if (status === 'passed' || status === 'detail') passed++;
    else if (status === 'warning') warning++;
    else if (status === 'failed') failed++;
    else if (status === 'not_applicable') not_applicable++;
    else if (status === 'skipped' || status === undefined || 'unchecked') skipped++;
  }

  if (failed > 0) return 'failed';
  if (warning > 0) return 'warning';
  if (skipped > 0 && (failed > 0 || passed > 0)) return 'incomplete';
  if (skipped > 0) return 'skipped';
  if (passed > 0 && passed + not_applicable === total) return 'passed';
  if (total === 0 || not_applicable > 0) return 'N/A';

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
        <img v-if="expanded" src="../../../assets/icons/chevron-down.svg" alt="close" />
        <img v-else src="../../../assets/icons/chevron-right.svg" alt="expand" />
      </div>
      <ItemHover :title="stateStore.generateTitle(checkId)" :message="check.description "/>
    </td>

    <td class="p-3 w-36 text-center">
      {{check.date ?? "-"}}
    </td>

    <td class="p-3 w-28 font-semibold">
      <div class="flex mx-auto justify-center items-center rounded-xl w-24 px-2" :class="{
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

        <div v-for="(device, index) in tempStore.orderedDevices" :key="index" class="flex flex-row items-center">
          <div class="flex flex-row items-center" v-if="props.check.targets[device.type]">
            <ItemHover v-if="device.type === 'tablet'" :title="`${device.prefix}${device.id}`" :message="device.ipAddress" :padding="false"/>
            <span v-else>{{device.prefix}}{{device.id}}</span>
            <StatusHover class="w-9"
                         :message="generateMessage(device)"
                         :checking-status="device.checks[checkId]?.checkingStatus ?? 'not checked'"
                         :passed-status="getCheckStatus(device.checks[checkId]?.passedStatus, check.targets[device.type])"/>
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>
