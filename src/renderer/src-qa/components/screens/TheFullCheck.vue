<script setup lang="ts">
import GenericLayout from "../../../components/layouts/GenericLayout.vue";
import CategoryTab from "../../../components/statuses/CategoryTab.vue";
import TheNUC from "../../../screens/setup/TheNUC.vue";
import TheStations from "../../../screens/setup/TheStations.vue";
import TheTablets from "../../../screens/setup/TheTablets.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const routeNameToIndex = {
  'full-setup-devices-nuc': 0,
  'full-setup-devices-tablets': 1,
  'full-setup-devices-stations': 2,
};

const currentIndex = computed(() => {
  const routeName = route.name?.toString();
  if(routeName === undefined) return -1;
  return routeNameToIndex[routeName] !== undefined ? routeNameToIndex[routeName] : -1;
});

const categories = () => {
  return [
    { key: "NUC", description: "Connect to your Lab" },
    { key: "Tablets", description: "Connect to LeadMe" },
    { key: "Stations", description: "Connect to IMVR" },
  ]
}
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-xl font-semibold text-black mb-3">Full Lab Check</p>
      <p class="text-base text-black mb-4">No description set</p>

      <!--A tab for each category-->
      <div class="flex flex-row w-full overflow-auto">
        <CategoryTab
            v-for="(category, index) in categories()"
            :key="index"
            :category="category"
            :index="index as number"
            :currentCategoryIndex="currentIndex"
        />
      </div>
    </template>

    <template v-slot:content>
      <TheNUC v-if="route.name === 'full-setup-devices-nuc'"/>
      <TheTablets v-else-if="route.name === 'full-setup-devices-tablets'"/>
      <TheStations v-else-if="route.name === 'full-setup-devices-stations'"/>
    </template>
  </GenericLayout>
</template>
