<script setup lang="ts">
import ApplianceTitle from "@renderer/components/fullCheck/Appliances/ApplianceTitle.vue";
import { useStateStore } from "@renderer/store/stateStore";
import { Appliance } from "@renderer/interfaces";

const stateStore = useStateStore();

defineProps({
  appliance: {
    type: Object as () => Appliance,
    required: true
  },
});
</script>

<template>
  <div class="flex flex-col mb-4">
    <ApplianceTitle :title="appliance['name']" :id="appliance['id']"/>

    <span v-for="(value, key) in appliance" :key="key" class="ml-2">
      <span v-if="value !== null && value !== '' && key !== 'correct' && key !== 'correctId'"
        class="flex flex-row"
        :class="{
          'text-green-500': key === 'id' && appliance['correctId'] === true,
          'text-red-500': key === 'id' && appliance['correctId'] === false,
        }"
      >
        <span class="w-40">{{ stateStore.capitalizeFirstLetter(key) }}:</span>
        <span>{{ value ?? "Not found" }}</span>
      </span>
    </span>
  </div>
</template>
