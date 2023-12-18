<script setup lang="ts">
import Projectors from '@renderer/src-setup/components/projectors/Projectors.vue'
import GenericScreen from '@renderer/src-setup/views/generic/GenericScreen.vue';
</script>

<template>
    <div class="flex-col h-full w-full overflow-hidden">
        <GenericScreen type="sources" text-type="projector" class="sticky"/>
        <Projectors class="border-t-gray-100 border-t-2 h-full overflow-auto gray-scrollbar pt-4" />
    </div>
</template>
