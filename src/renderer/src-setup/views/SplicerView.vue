<script setup lang="ts">
import Splicers from '../components/splicers/Splicers.vue'
import GenericScreen from './generic/GenericScreen.vue'
</script>

<template>
    <div class="flex-col h-full w-full overflow-hidden">
        <GenericScreen class="sticky" type="splicers" text-type="splicer"/>
        <Splicers class="border-t-gray-100 border-t-2 h-full overflow-auto gray-scrollbar pt-4" />
    </div>
</template>
