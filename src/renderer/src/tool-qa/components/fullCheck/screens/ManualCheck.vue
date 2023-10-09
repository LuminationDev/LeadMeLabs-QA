<script setup lang="ts">
import * as FULL from "../../../../assets/checks/_fullcheckValues";
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import CategoryTab from "@renderer/tool-qa/components/fullCheck/screens/CategoryTab.vue";
import ItemHover from "@renderer/tool-qa/components/fullCheck/ItemHover.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import GuideModal from "../../../modals/GuideModal.vue";

const stateStore = useStateStore();
const fullStore = useFullStore();
const route = useRoute();

const checkDetails = computed(() => {
  return FULL[route.meta['page'].toUpperCase()];
});

const categories = computed(() => {
  return checkDetails.value.category.map(categoryItem => {
    const [categoryKey, categoryValue] = Object.entries(categoryItem)[0];
    return {
      key: categoryKey,
      description: categoryValue.description,
      devices: categoryValue.devices
    };
  });
});

const currentCategoryIndex = computed(() => {
  return checkDetails.value.category.findIndex(item => Object.keys(item)[0] === route.meta['category']);
});

const checks = computed(() => {
  const { parent, page } = checkDetails.value;
  fullStore.readReportData(parent, page);

  const category = checkDetails.value['category'][currentCategoryIndex.value][route.meta['category']];
  if (category && category.checks) {
    const checks = Object.entries(category.checks).map(([key, checkDetails]) => ({ key, description: checkDetails.description }));
    //Add the checks to the report tracker
    checks.forEach(check => {
      fullStore.addCheckToReportTracker(parent, page, check, category.devices);
    });

    return checks
  } else {
    return [];
  }
});

const guides = computed(() => {
  const category = checkDetails.value['category'][currentCategoryIndex.value][route.meta['category']];

  if (category && category.checks) {
    return Object.entries(category.checks).map(([key, checkDetails]) => ({ key, guide: checkDetails.guide })).filter(object => object.guide.length > 0);
  } else {
    return [];
  }
});
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-2xl text-black font-semibold mb-2">{{stateStore.generateTitle(route.meta['page'] as string)}}</p>
      <p class="text-base text-black mb-4">{{checkDetails.description ?? "No description set"}}</p>

      <!--A tab for each category-->
      <div class="flex flex-row w-full overflow-auto">
        <CategoryTab
            v-for="(category, index) in categories"
            :key="index"
            :category="category"
            :index="index as number"
            :currentCategoryIndex="currentCategoryIndex"
        />
      </div>
    </template>

    <template v-slot:content>
      <div class="w-full mb-4 flex flex-col rounded-lg border-2 border-gray-200">

        <div class="flex flex-row justify-between p-3">
          <div class="flex flex-col">
            <!--Category Title-->
            <h2 class="font-semibold text-base">{{ categories[currentCategoryIndex].key }}</h2>
            <h2 class="text-sm">{{ categories[currentCategoryIndex].description }}</h2>
          </div>

          <GuideModal :guides="guides" />
        </div>

        <table class="w-full border-collapse">
          <tr class="text-left text-xs bg-gray-100 border border-gray-200">
            <th class="p-3">Name</th>

            <th class="w-16 text-center p-3" v-for="device in fullStore.deviceMap">
              {{device.prefix}}{{device.id}}
            </th>
          </tr>

          <!--Table will not be built if NUC connection has not been made, fullStore.buildQA is triggered on response-->
          <tr v-for="(item, index) in checks" :key="index" class="text-sm border border-gray-200">
            <ItemHover :title="item.key" :message="item.description "/>

            <td v-for="device in fullStore.orderedDevices" class="text-center p-3">
              <input v-if="categories[currentCategoryIndex].devices[device.type] === true"
                     :key="index + '-' + item.key"
                     :checked="device.checks[item.key]?.passedStatus === 'passed'"
                     type="checkbox" class="h-4 w-4"
                     @change="fullStore.updateReport(
                         checkDetails.parent,
                         checkDetails.page,
                         { passedStatus: $event.target.checked ? 'passed' : 'skipped' },
                         item.key,
                         device.id)">
            </td>
          </tr>
        </table>
      </div>
    </template>
  </GenericLayout>
</template>
