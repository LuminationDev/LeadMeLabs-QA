<script setup lang="ts">
import Lights from '@renderer/src-setup/components/lights/Lights.vue';
import GenericScreen from '@renderer/src-setup/views/generic/GenericScreen.vue';
</script>

<template>
    <div class="flex-col h-full w-full overflow-hidden">
        <GenericScreen type="lights" text-type="light" class="sticky"/>
        <Lights class="border-t-gray-100 border-t-2 h-full overflow-auto gray-scrollbar pt-4" />
    </div>
</template>
