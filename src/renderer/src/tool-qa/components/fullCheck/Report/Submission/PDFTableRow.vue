<script setup lang="ts">
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { computed } from "vue";
import { Check } from "@renderer/tool-qa/interfaces/_report";
import PDFDeviceStatus from "@renderer/tool-qa/components/fullCheck/Report/Submission/PDFDeviceStatus.vue";

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

    if (status === 'passed') passed++;
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

const getTargetData = (type: string): boolean => {
 if (!props.check.hasOwnProperty('targets')) {
   return false;
 }

  if (props.check.targets.hasOwnProperty(type)) {
    return props.check.targets[type];
  }

  return false;
}

const getCheckStatus = (status: string | undefined, required: any) => {
  if( status !== undefined){
    return status
  }

  return required ? 'skipped' : 'unknown';
}
</script>

<template>
  <tr class="h-12 w-full text-sm border-l border-t border-r border-gray-200">
    <td class="flex flex-row items-center">
      <div class="p-3 font-semibold mr-1">{{ stateStore.generateTitle(checkId) }}</div>
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
  </tr>

  <tr class="text-xs">
    <td colspan="3" class="px-3 pb-2">
      {{check.description}}
    </td>
  </tr>

  <tr class="h-12 bg-gray-100 border border-gray-200">
    <td colspan="3" class="pl-8 text-xs">
      <div class="flex flex-row items-center">
        <div class="mr-4">
          Devices:
        </div>

        <div v-for="(device, index) in fullStore.orderedDevices" :key="index" class="flex flex-row items-center">
          <div class="flex flex-row items-center" v-if="getTargetData(device.type)">
            <div>
              {{device.prefix}}{{device.id}}
            </div>
            <PDFDeviceStatus class="w-9"
                         :message="generateMessage(device)"
                         :checking-status="device.checks[checkId]?.checkingStatus ?? 'not checked'"
                         :passed-status="getCheckStatus(device.checks[checkId]?.passedStatus, check.targets[device.type])"/>
          </div>
        </div>
      </div>
    </td>
  </tr>

  <tr class="bg-gray-50 text-xs" v-for="(device, index) in fullStore.orderedDevices" :key="index">
    <td v-if="(device.checks[checkId]?.passedStatus === 'failed' ||
              device.checks[checkId]?.passedStatus === 'warning') &&
              device.checks[checkId]?.message !== undefined"
        colspan="3" class="pl-8 p-3">
      <div>
        {{device.prefix}}{{device.id}}
      </div>
      <div>
        <span class="font-semibold mr-1">Message:</span> {{device.checks[props.checkId]?.message}}
      </div>
    </td>
  </tr>

  <tr class="bg-gray-50 text-xs" v-for="comment in check['comments']">
    <td colspan="3" class="pl-8 p-3">
      <div>
        {{comment.date}}
      </div>
      <div>
        <span class="font-semibold mr-1">Comment:</span> {{comment.content}}
      </div>
    </td>
  </tr>
</template>
