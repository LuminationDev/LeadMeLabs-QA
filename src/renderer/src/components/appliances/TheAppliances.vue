<script setup lang="ts">
import { useStateStore } from "@renderer/store/stateStore";
import ApplianceRequest from "@renderer/components/appliances/ApplianceRequest.vue";
import { computed } from "vue";
import { Appliance } from "@renderer/interfaces";

const stateStore = useStateStore();

const groupedData = computed(() => {
  const data = stateStore.ApplianceList;

  if (data.length === 0) {
    return {};
  }

  const groupedData = data.reduce((acc, item: Appliance) => {
    const itemType: string = item.type;
    acc[itemType] = acc[itemType] || [];
    acc[itemType].push(item);
    return acc;
  }, {});

  for (const itemType in groupedData) {
    if (groupedData.hasOwnProperty(itemType)) {
      groupedData[itemType].sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  return groupedData;
});

</script>

<template>
  <ApplianceRequest />

  <!--Display the NUC response below-->
  <div class="flex flex-col" v-for="(appliances, type) in groupedData" :key="type">
    <span class="w-56 font-semibold mb-2 text-lg">{{ stateStore.capitalizeFirstLetter(typeof type === "string" ? type : "Unknown") }}</span>

    <ul>
      <li v-for="(appliance) in appliances" :key="appliance['id']">
        <div class="flex flex-col mb-2">
          <span class="w-56 font-semibold">
            {{ appliance['name'] }}
          </span>

          <span v-for="(value, key) in appliance" :key="key" class="ml-2">
            <span v-if="value !== null && value !== ''" class="flex flex-row">
              <span class="w-40">{{ stateStore.capitalizeFirstLetter(key) }}:</span>
              <span>{{ value ?? "Not found" }}</span>
            </span>
          </span>
        </div>
      </li>
    </ul>

    <hr class="my-2" />
  </div>
</template>
