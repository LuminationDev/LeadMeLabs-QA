<script setup lang="ts">
import ApplianceDisplay from "@renderer/tool-qa/components/fullCheck/Appliances/ApplianceDisplay.vue";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { computed, ref } from "vue";
import { Appliance } from "@renderer/tool-qa/interfaces";

const stateStore = useStateStore();
const expanded = ref(false);

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  appliances: {
    type: Array<Appliance>,
    required: true
  }
});

const numberOfChecks = computed(() => {
  return props.appliances.length;
});

const currentlyCorrect = computed(() => {
  return props.appliances
      .filter(item => item['correct'] === true)
      .length;
});

const currentlyUnanswered = computed(() => {
  return props.appliances
      .filter(item => item['correct'] === undefined || item['correct'] === null)
      .length;
});

const hasPassed = computed(() => {
  if (currentlyUnanswered.value === numberOfChecks.value) {
    return ""
  }

  if (currentlyUnanswered.value > 0) {
    return "Verification needed";
  }

  return currentlyCorrect.value === numberOfChecks.value ? "Passed" : "Failed";
});
</script>

<template>
  <div class="flex flex-col">
    <table>
      <tr class="flex flex-row">
        <td class="w-40">
          <div>{{stateStore.capitalizeFirstLetter(typeof type === "string" ? type : "Unknown")}}</div>
        </td>
        <td class="w-48 flex justify-center">
          <div>{{stateStore.formattedDate()}}</div>
        </td>
        <td class="w-56">
          <div>Status: {{hasPassed}}</div>
        </td>
        <td class="w-40 flex justify-center">
          <div @click="$emit('retest', type)" class="inline-block w-auto text-blue-500 hover:text-blue-300 cursor-pointer">Test Again</div>
        </td>
        <td class="w-10 flex justify-end">
          <div @click="expanded = !expanded" class="inline-block w-auto text-gray-500 hover:text-gray-300 cursor-pointer">{{expanded ? "X" : "V"}}</div>
        </td>
      </tr>
    </table>

    <div v-if="expanded" class="flex flex-col">
      <ApplianceDisplay v-for="(appliance) in appliances" :key="appliance['id']" :appliance="appliance"/>
    </div>
  </div>
</template>
