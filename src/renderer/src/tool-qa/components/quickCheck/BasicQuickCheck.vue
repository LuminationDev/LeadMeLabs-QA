<script setup lang="ts">
import InformationRow from "@renderer/tool-qa/components/checks/InformationRow.vue";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { useQuickStore } from "@renderer/tool-qa/store/quickStore";
import { computed, ref } from "vue";

const stateStore = useStateStore();
const quickStore = useQuickStore();
const expanded = ref(false);

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  details: {
    type: Object,
    required: true
  }
});

const keyAnswered = (key: string, value: boolean) => {
  if (props.details[key] !== undefined) {
    props.details[key]['passStatus'] = value ? 'passed' : 'failed';
  }
}

const numberOfChecks = computed(() => {
  return Object.keys(props.details).length;
});

const currentlyCorrect = computed(() => {
  return Object.values(props.details)
      .filter(item => item['passedStatus'] === 'passed')
      .length;
});

const currentlyUnanswered = computed(() => {
  return Object.values(props.details)
      .filter(item => item['passedStatus'] === undefined)
      .length;
});

/**
 * Return the correct value or undefined for the supplied key.
 * @param key
 */
const correctValue = (key: string) => {
  const temp = key.toLowerCase();

  switch (temp) {
    case "id":
      return quickStore.correctStationValues['StationId'].toString();

    case "name":
      return `Station ${quickStore.correctStationValues['StationId']}`;

    case "lablocation":
      return stateStore.labLocation;
  }

  if (quickStore.correctStationValues[key] === undefined) {
    return undefined;
  }

  return quickStore.correctStationValues[key];
}

const hasPassed = computed(() => {
  if (currentlyUnanswered.value > 0) {
    return "Verification needed";
  }

  return currentlyCorrect.value === numberOfChecks.value ? "Passed" : "Failed";
});
</script>

<template>
  <div class="flex flex-col mb-4">
    <table>
      <tr class=" flex flex-row">
        <td class="w-40">
          <div>{{title}} Settings</div>
        </td>
        <td class="w-48 flex justify-center">
          <div>{{stateStore.formattedDate(false)}}</div>
        </td>
        <td class="w-56">
          <div>Status: {{hasPassed}}</div>
        </td>
        <td class="w-40 flex justify-center">
          <div @click="$emit('retest', title)" class="inline-block w-auto text-blue-500 hover:text-blue-300 cursor-pointer">Test Again</div>
        </td>
        <td class="w-10 flex justify-end">
          <div @click="expanded = !expanded" class="inline-block w-auto text-gray-500 hover:text-gray-300 cursor-pointer">{{expanded ? "X" : "V"}}</div>
        </td>
      </tr>
    </table>

    <div v-if="expanded" class="flex flex-col">
      <div v-for="(check, index) in props.details" :key="index" class="flex flex-col">
        <InformationRow
            @answered="keyAnswered"
            :title="check['id']"
            :text="check['message'] ?? 'No message supplied'"
            :correct="check['passedStatus']"/>

        <div v-if="correctValue(check.id) !== undefined && correctValue(check.id) !== check.message">
          <div class="w-52 text-red-500">
            Expected value:
          </div>
          <div class="text-red-500">
            {{correctValue(check.id)}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
