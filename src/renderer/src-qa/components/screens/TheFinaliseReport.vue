<script setup lang="ts">
import GenericLayout from "../../../components/layouts/GenericLayout.vue";
import Submission from "../../../screens/report/submission/Submission.vue";
import Download from "../../../screens/report/submission/Download.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const currentPage = computed(() => {
  return route.name;
});
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-2xl text-black font-semibold mb-2">Test Report</p>
    </template>

    <template v-slot:content>
      <Submission v-if="currentPage === 'full-overall-submit'"/>
      <Download v-else-if="currentPage === 'full-overall-download'"/>
    </template>
  </GenericLayout>
</template>
