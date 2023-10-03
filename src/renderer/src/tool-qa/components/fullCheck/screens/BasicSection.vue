<script setup lang="ts">
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import Description from "@renderer/tool-qa/components/checks/Description.vue";
import BasicFullCheck from "@renderer/tool-qa/components/fullCheck/BasicFullCheck.vue";
import BasicAutoCheck from "@renderer/tool-qa/components/fullCheck/BasicAutoCheck.vue";
import BasicReport from "@renderer/tool-qa/components/fullCheck/Report/BasicReport.vue";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { useRoute } from "vue-router";
import { computed } from "vue";
// import { navigation } from "@renderer/router/checkRoutes";
import ItemHover from "@renderer/tool-qa/components/fullCheck/ItemHover.vue";

const fullStore = useFullStore();
const route = useRoute();
//
// /**
//  * Calculate the layout when the route changes based on the entry found in the navigation object.
//  */
// const details = computed(() => {
//   return navigation.find(item => route.path.includes(item.route));
// })
//
// /**
//  * Check if the current page is a manual one, this requires a different title component.
//  */
// const onManualPage = computed(() => {
//   const manualPage = route.name.toString().includes(`full-${details.value.title.toLowerCase()}-`);
//   const reportPage = route.name.toString().includes(`report`);
//   const autoPage = route.name.toString().includes(`auto`);
//
//   return manualPage && !autoPage && !reportPage;
// });
//
// /**
//  * Find the current screen to display the correct title, description and sub-categories.
//  */
// const currentScreen = computed(() => {
//   const targetRouteName = `full-${details.value.title.toLowerCase()}`;
//
//   return navigation
//       .map(item => item.screens.find(screen =>
//           route.path.includes(item.route) &&
//           route.name.toString().includes(`${targetRouteName}-${screen.objectName.toLowerCase()}`)))
//       .find(Boolean);
// });
//
// const currentCheck = computed(() => {

// });
</script>

<template>
<!--  <GenericLayout>-->
<!--    <template v-slot:title>-->
<!--      &lt;!&ndash;If on a manual page&ndash;&gt;-->
<!--      <template v-if="onManualPage">-->
<!--        <p class="text-2xl text-black font-semibold">{{currentScreen.title}}</p>-->
<!--        <p class="text-base text-black mb-6">{{currentScreen.description ?? "No description set"}}</p>-->

<!--        <div class="flex flex-row w-full">-->
<!--          <div v-for="item in fullStore.reportTracker[currentScreen.objectName]" class="flex flex-col mr-4">-->

<!--            &lt;!&ndash;classes based on index/current route&ndash;&gt;-->
<!--            <div class="h-1 w-40 bg-blue-500"></div>-->

<!--            <div class="text-sm font-semibold">{{item.id}}</div>-->
<!--            <div class="text-xs">{{item.description ?? "No description set"}}</div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </template>-->

<!--      &lt;!&ndash;If on any other page&ndash;&gt;-->
<!--      <template v-else>-->
<!--        <p class="text-2xl text-black font-semibold">{{details.title}}</p>-->
<!--        <p class="text-base text-black mb-6">{{details.description}}</p>-->
<!--      </template>-->

<!--    </template>-->

<!--    <template v-slot:content>-->
<!--      <Description v-if="route.name === `full-${details.title.toLowerCase()}`"/>-->

<!--      <template v-for="auto in details.checks.auto">-->
<!--        <BasicAutoCheck v-if="route.name === `full-${details.title.toLowerCase()}-auto-${auto}`"-->
<!--                        :check-type="auto"/>-->
<!--      </template>-->

<!--      &lt;!&ndash;TODO this has to somehow influence the bottomBar to change the 'next' function (use the OnManual function?)&ndash;&gt;-->
<!--      <template v-for="screen in details.screens">-->
<!--        <div v-if="route.name === `full-${details.title.toLowerCase()}-${screen.objectName.toLowerCase()}`"-->
<!--             v-for="item in fullStore.reportTracker[screen.objectName]">-->

<!--          {{item}}-->
<!--        </div>-->

<!--&lt;!&ndash;        <BasicFullCheck v-if="route.name === `full-${details.title.toLowerCase()}-${screen.objectName.toLowerCase()}`"&ndash;&gt;-->
<!--&lt;!&ndash;                        :title="screen.title"&ndash;&gt;-->
<!--&lt;!&ndash;                        :object-name="screen.objectName"&ndash;&gt;-->
<!--&lt;!&ndash;                        :key="screen.title"/>&ndash;&gt;-->
<!--      </template>-->

<!--      <BasicReport v-if="route.name === `full-${details.title.toLowerCase()}-report`"-->
<!--                   :auto="fullStore.getAutoChecks(route.path)"-->
<!--                   :section="fullStore.getManualChecks(route.path)"/>-->
<!--    </template>-->
<!--  </GenericLayout>-->
</template>
