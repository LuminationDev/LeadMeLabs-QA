<script setup lang="ts">
import GenericLayout from "../../../components/layouts/GenericLayout.vue";
import CategoryTab from "../../../components/statuses/CategoryTab.vue";
import TheNUC from "../../../screens/setup/TheNUC.vue";
import TheStations from "../../../screens/setup/TheStations.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const routeNameToIndex = {
  'experiences-setup-devices-nuc': 0,
  'experiences-setup-devices-stations': 1,
};

const currentIndex = computed(() => {
  const routeName = route.name?.toString();
  if(routeName === undefined) return -1;
  return routeNameToIndex[routeName] !== undefined ? routeNameToIndex[routeName] : -1;
});

const categories = () => {
  return [
    { key: "NUC", description: "Connect to your Lab" },
    { key: "Stations", description: "Connect to IMVR" },
  ]
}
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-xl font-semibold text-black mb-3">Quick Experience Check</p>
      <p class="text-base text-black mb-4">Run through the experiences without other checks.</p>

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
      <TheNUC v-if="route.name === 'experiences-setup-devices-nuc'"/>
      <TheStations v-else-if="route.name === 'experiences-setup-devices-stations'"/>
    </template>
  </GenericLayout>
</template>
