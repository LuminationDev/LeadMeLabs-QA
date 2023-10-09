<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";

defineProps({
  separator: {
    type: Boolean,
    required: false,
    default: true
  }
});

const route = useRoute();
const fullStore = useFullStore();

const updateOverallProgress = () => {
  if (route.meta['progress']) {
    fullStore.updateMaxProgress(<number>route.meta['progress']);
  }
}

watch(route, updateOverallProgress);
</script>

<template>
  <div class="w-full h-auto my-4 flex flex-col">
    <slot name="title"/>

    <hr v-if="separator" class="my-4">

    <div class="w-full h-auto mb-4 flex flex-col">
      <slot name="content"/>
    </div>
  </div>
</template>
