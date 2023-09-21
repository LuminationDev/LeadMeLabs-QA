<script setup lang="ts">
defineProps({
    tip: {
        type: String,
        required: true
    },

    toolTipMargin: {
        type: String,
        default: '-ml-1.5'
    },

    arrowMargin: {
        type: String,
        default: 'ml-0.5'
    }
})
</script>

<template>
    <span :class="toolTipMargin" class="tooltip rounded shadow-lg px-3 py-1 bg-gray-700 rounded-xl text-white -mt-8">{{ tip }}</span>
    <div :class="arrowMargin" class="tooltip h-0 w-0 rotate-180 border-x-8 border-x-transparent border-b-[7px] border-b-gray-700 -mt-1.5"></div>
</template>

<style scoped>
.tooltip {
    @apply invisible absolute;
}

.has-tooltip:hover .tooltip {
    visibility: visible;
    animation: appear 1s;
}

@keyframes appear {
    0% {
        opacity: 0
    }

    100% {
        opacity: 1;
        z-index: 50;
    }
}
</style>
