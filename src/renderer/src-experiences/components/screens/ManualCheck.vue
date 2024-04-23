<script setup lang="ts">
import * as FULL from "../../../assets/checks/_fullcheckValues";
import GenericLayout from "@renderer/components/layouts/GenericLayout.vue";
import CategoryTab from "@renderer/components/statuses/CategoryTab.vue";
import ItemHover from "@renderer/components/statuses/ItemHover.vue";
import GuideModal from "../../../modals/GuideModal.vue";
import Checkbox from "@renderer/components/inputs/Checkbox.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { useStateStore } from "../../../store/stateStore";
import { useExperienceStore } from "../../store/experienceStore";
import { CheckObject } from "../../interfaces/_routeItems";

const stateStore = useStateStore();
const experienceStore = useExperienceStore();
const route = useRoute();

const checkDetails = computed((): CheckObject => {
  const page = route.meta['page'];
  if (typeof page === 'string') {
    return FULL[page.toUpperCase()];
  } else {
    return {category: [], description: "", page: "", parent: ""};
  }
});

const categories = computed(() => {
  return checkDetails.value.category.map(categoryItem => {
    const [categoryKey, categoryValue] = Object.entries(categoryItem)[0];
    return {
      key: categoryKey,
      description: categoryValue.description,
      targets: categoryValue.targets
    };
  });
});

const currentCategoryIndex = computed(() => {
  return checkDetails.value.category.findIndex(item => Object.keys(item)[0] === route.meta['category']);
});

const checks = computed(() => {
  const { parent, page } = checkDetails.value;
  experienceStore.readReportData(parent, page);

  const category = checkDetails.value['category'][currentCategoryIndex.value][<string>route.meta['category']];
  if (category && category.checks) {
    const checks = Object.entries(category.checks).map(([key, checkDetails]) => ({ key, description: checkDetails.description }));
    //Add the checks to the report tracker
    checks.forEach(check => {
      experienceStore.addCheckToReportTracker(parent, page, check, category.targets);
    });

    return checks
  } else {
    return [];
  }
});

const guides = computed(() => {
  if (route.meta['category'] === undefined) {
    return [];
  }

  const category = checkDetails.value['category'][currentCategoryIndex.value][<string>route.meta['category']];

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

            <th class="w-16 text-center p-3" v-for="device in experienceStore.deviceMap">
              <ItemHover v-if="device.type === 'tablet'" :title="`${device.prefix}${device.id}`" :message="device.ipAddress" :padding="false"/>
              <span v-else>{{device.prefix}}{{device.id}}</span>
            </th>
          </tr>

          <!--Table will not be built if NUC connection has not been made, fullStore.buildQA is triggered on response-->
          <tr v-for="(item, index) in checks" :key="index" class="text-sm border border-gray-200">
            <ItemHover :title="item.key" :message="item.description "/>

            <td v-for="device in experienceStore.orderedDevices" class="text-center p-3">
              <Checkbox v-if="categories[currentCategoryIndex].targets[device.type] === true"
                        :index="0"
                        :parent="checkDetails.parent"
                        :page="checkDetails.page"
                        :item-key="item.key"
                        :device="device"/>
            </td>
          </tr>
        </table>
      </div>
    </template>
  </GenericLayout>
</template>
