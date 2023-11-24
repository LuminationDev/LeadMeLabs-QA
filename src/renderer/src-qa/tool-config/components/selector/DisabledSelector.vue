<script setup lang="ts">
const props = defineProps({
    displayName: {
        type: String,
        required: true
    }
})
</script>

<template>
    <input class="radio-hidden" type="radio" disabled />
    <div class="radio-custom-background rounded-xl justify-center items-center opacity-30">
        <span class="radio-custom-text">{{ props.displayName }}</span>
    </div>
</template>
