<script setup lang="ts">
defineProps({
  separator: {
    type: Boolean,
    required: false,
    default: true
  }
});
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
