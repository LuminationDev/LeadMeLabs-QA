<script setup lang="ts">
const props = defineProps({
    currentStatus: {
        type: Boolean,
        required: true
    },
    callback: {
        type: Function,
        required: true
    }
})
</script>

<template>
    <div @click="props.callback()">
        <img
            v-if="props.currentStatus == false"
            src="../../assets/icons/plusRound.svg"
            alt="Plus Sign"
            class="h-6 w-6"
        />
        <img v-else src="../../assets/icons/minusRound.svg" alt="Minus Sign" class="h-6 w-6" />
    </div>
</template>
