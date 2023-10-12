<script setup lang="ts">
import ItemHover from "../ItemHover.vue";
import StatusHover from "../StatusHover.vue";
import { useRoute } from "vue-router";
import { useStateStore } from "../../../store/stateStore";
import { useFullStore } from "../../../store/fullStore";
import { computed } from "vue";

const route = useRoute();
const stateStore = useStateStore();
const fullStore = useFullStore();

const checks = computed(() => {
  let checks = {}
  fullStore.stations.forEach(station => {
    station.getComputedChecks().forEach((check) => {
      if (!checks[check.id]) {
        checks[check.id] = {
          displayName: check.displayName,
          stations: []
        }
      }
      checks[check.id].stations.push(check)
    })
  })
  return checks
});
</script>

<template>
  <div class="flex flex-col">
    <table class="w-full border-collapse mt-4">
      <tr class="text-left text-xs bg-gray-100 border border-gray-200">
        <th class="p-3">Name</th>

        <th class="w-16 text-center p-3" v-for="station in fullStore.stations">
          S{{station.id}}
        </th>
      </tr>

      <tr v-for="(check, id) in checks" :key="id" class="text-sm border border-gray-200">
        <ItemHover :title="check.displayName" :message="check.extendedDescription ?? 'No details provided'"/>

        <template v-for="(station, index) in check.stations" :key="index">
          <StatusHover :message="station.message ?? 'No details provided'"
                       :checking-status="'not checked'"
                       :passed-status="station.passedStatus ?? 'unknown'"/>
        </template>
      </tr>
    </table>
  </div>
</template>