<script setup lang="ts">
import { provide, ref } from 'vue'

export type AccordionType = { count: number; active: number }

const Accordion = ref<AccordionType>({
    count: 0,
    active: -1
})
const updateCount = (count: number): void => {
    Accordion.value.count = count
}

const updateActive = (activeState: number): void => {
    Accordion.value.active = activeState
}

provide('Accordion', { Accordion, updateCount, updateActive })
</script>
<template>
    <ul class="accordion w-full">
        <slot></slot>
    </ul>
</template>

<style lang="scss" scoped>
.accordion {
    list-style: none;
    margin: 0;
    padding: 0;

    &__item:last-child {
        border-bottom: none;
    }
}
</style>
