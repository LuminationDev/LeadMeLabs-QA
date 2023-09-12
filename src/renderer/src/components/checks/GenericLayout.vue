<script setup lang="ts">
</script>

<template>
  <div class="w-full h-auto my-4 flex flex-col">
    <slot name="title"/>

    <hr class="my-4">

    <div class="w-full h-auto mb-4 flex flex-col">
      <slot name="content"/>
    </div>
  </div>
</template>
