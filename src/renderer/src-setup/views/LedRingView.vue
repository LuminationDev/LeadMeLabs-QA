<script setup lang="ts">
import LedRings from '../components/ledRings/ledRings.vue'
import GenericScreen from './generic/GenericScreen.vue'
</script>

<template>
    <div class="flex-col h-full w-full overflow-hidden">
        <GenericScreen type="ledRings" text-type="LED Ring" class="sticky" />
        <LedRings class="border-t-gray-100 border-t-2 h-full overflow-auto gray-scrollbar pt-4" />
    </div>
</template>
