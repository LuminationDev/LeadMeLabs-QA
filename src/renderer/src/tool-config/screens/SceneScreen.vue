<script setup lang="ts">
import Scenes from '@renderer/tool-config/components/scenes/Scenes.vue';
import GenericScreen from '@renderer/tool-config/screens/generic/GenericScreen.vue';
</script>

<template>
    <div class="flex-col h-full w-full overflow-hidden">
        <GenericScreen type="scenes" text-type="scene" class="sticky"/>
        <Scenes class="border-t-gray-100 border-t-2 h-full overflow-auto gray-scrollbar pt-4" />
    </div>
</template>
