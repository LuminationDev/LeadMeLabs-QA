<script setup lang="ts">
import Rooms from '@renderer/src-setup/components/rooms/Rooms.vue';
import GenericScreen from '@renderer/src-setup/views/generic/GenericScreen.vue';
</script>

<template>
    <div class="flex-col h-full w-full overflow-hidden">
        <GenericScreen type="rooms" text-type="room" class="sticky"/>
        <Rooms class="border-t-gray-100 border-t-2 h-full overflow-auto gray-scrollbar pt-4" />
    </div>
</template>
