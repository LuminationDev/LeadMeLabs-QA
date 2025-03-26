<script setup lang="ts">
import Blinds from '../components/blinds/Blinds.vue';
import GenericScreen from './generic/GenericScreen.vue';
</script>

<template>
    <div class="flex-col h-full w-full overflow-hidden">
        <GenericScreen class="sticky" type="blinds" text-type="blind"/>
        <Blinds class="border-t-gray-100 border-t-2 h-full overflow-auto gray-scrollbar pt-4" />
    </div>
</template>
