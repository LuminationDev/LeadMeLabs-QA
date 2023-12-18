<script setup lang="ts">
import { Station } from "../types/_station";
import { computed } from "vue";
import Spinner from "../../components/buttons/Spinner.vue";

const props = defineProps({
  station: {
    type: Object as () => Station,
    required: true
  }
});

const isNumeric = (value: string|number): boolean => {
  return !isNaN(Number(value));
}

const isPasswordLongerThanZero = computed(() => props.station.password.length > 0);
</script>

<template>
  <div class="flex flex-col mb-4">
    <div class="font-semibold text-lg">
      {{isNumeric(station.index) ? `Station ${station.index}` : station.index}}
    </div>

    <div class="flex flex-row">
      <div class="w-24">
        Username:
      </div>
      {{station.username}}
    </div>

    <div class="flex flex-row items-center">
      <div class="w-24">
        Password:
      </div>

      <div v-if="isPasswordLongerThanZero">
        {{station.password}}
      </div>
      <spinner v-else/>
    </div>
  </div>
</template>
