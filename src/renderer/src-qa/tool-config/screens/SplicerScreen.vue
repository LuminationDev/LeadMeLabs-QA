<script setup lang="ts">
import Splicers from '@renderer/tool-config/components/splicers/Splicers.vue'
import GenericScreen from '@renderer/tool-config/screens/generic/GenericScreen.vue'
</script>

<template>
    <div class="flex-col h-full w-full overflow-hidden">
        <GenericScreen class="sticky" type="splicers" text-type="splicer"/>
        <Splicers class="border-t-gray-100 border-t-2 h-full overflow-auto gray-scrollbar pt-4" />
    </div>
</template>
