<script setup lang="ts">
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import Description from "@renderer/tool-qa/components/checks/Description.vue";
import BasicFullCheck from "@renderer/tool-qa/components/fullCheck/BasicFullCheck.vue";
import BasicAutoCheck from "@renderer/tool-qa/components/fullCheck/BasicAutoCheck.vue";
import BasicReport from "@renderer/tool-qa/components/fullCheck/Report/BasicReport.vue";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { navigation } from "@renderer/router/checkRoutes";

const fullStore = useFullStore();
const route = useRoute();

/**
 * Calculate the layout when the route changes based on the entry found in the navigation object.
 */
const details = computed(() => {
  return navigation.find(item => route.path.includes(item.route));
})
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-2xl text-black font-semibold mb-3">{{details.title}}</p>
      <p class="text-base text-black mb-3">{{details.description}}</p>
    </template>

    <template v-slot:content>
      <Description v-if="route.name === `full-${details.title.toLowerCase()}`"/>

      <template v-for="auto in details.checks.auto">
        <BasicAutoCheck v-if="route.name === `full-${details.title.toLowerCase()}-auto-${auto}`"
                        :check-type="auto"/>
      </template>

      <template v-for="screen in details.screens">
        <BasicFullCheck v-if="route.name === `full-${details.title.toLowerCase()}-${screen.objectName.toLowerCase()}`"
                        :title="screen.title"
                        :object-name="screen.objectName"
                        :key="screen.title"/>
      </template>

      <BasicReport v-if="route.name === `full-${details.title.toLowerCase()}-report`"
                   :auto="fullStore.getAutoChecks(route.path)"
                   :section="fullStore.getManualChecks(route.path)"/>
    </template>
  </GenericLayout>
</template>
