<script setup lang="ts">
import { useStateStore } from "../../src-qa/store/stateStore";
import { useNetworkStore } from "../store/networkStore";
import { computed } from "vue";

const stateStore = useStateStore();
const networkStore = useNetworkStore();

const props = defineProps({
  category: {
    type: String,
    required: true
  }
})

const status = computed(() => {
  return networkStore.generateCategoryStatus(props.category);
});
</script>

<template>
  <td class="p-3 text-sm h-12 w-28 font-semibold">
    <div v-if="status !== 'not_started'" class="rounded-xl w-fit px-2"
       :class="{
        'bg-blue-100 border-[1px] border-blue-300 text-blue-700': status === 'testing...',
        'bg-red-100 border-[1px] border-red-300 text-red-700': status === 'failed',
        'bg-green-100 border-[1px] border-green-300 text-green-700': status === 'passed',
        'bg-yellow-100 border-[1px] border-yellow-300 text-yellow-600': status !== 'failed'
                                                                      && status !== 'passed'
                                                                      && status !== 'testing...',
    }">
      {{stateStore.capitalizeFirstLetter(typeof status === "string" ? status : "Skipped") ?? 'Skipped'}}
    </div>
  </td>
</template>
