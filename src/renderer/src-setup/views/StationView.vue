<script setup lang="ts">
import Stations from '../components/stations/Stations.vue';
import GenericScreen from './generic/GenericScreen.vue';
</script>
<template>
    <div class="flex-col h-full w-full overflow-hidden">
        <GenericScreen type="stations"  text-type="station" class="sticky"/>
        <Stations class="border-t-gray-100 border-t-2 h-full overflow-auto gray-scrollbar pt-4" />
    </div>
</template>
