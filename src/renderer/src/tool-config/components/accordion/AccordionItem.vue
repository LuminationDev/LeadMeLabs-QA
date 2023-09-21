<script setup lang="ts">
import { inject, ref, computed, onMounted, Transition } from 'vue'
import { AccordionType } from './Accordion.vue'

export type AccordionInjectType = {
    Accordion: AccordionType
    updateCount: (count: number) => void
    updateActive: (activeState: number) => void
}

// @ts-ignore ignore typing undefined
const {
    // @ts-ignore ignore typing undefined
    Accordion,
    // @ts-ignore ignore typing undefined
    updateActive
} = inject<AccordionInjectType>('Accordion')

const index = ref<number | null>(null)

onMounted(() => {
    index.value = Accordion.value.count++
})

const visible = computed(() => {
    return index.value == Accordion.value.active
})

const open = (): void => {
    if (visible.value) {
        updateActive(-1)
    } else {
        updateActive(index.value)
    }
}
const start = (el: any): void => {
    el.style.height = el.scrollHeight + 'px'
}
const end = (el: any): void => {
    el.style.height = ''
}
</script>

<template>
    <li class="accordion__item w-full bg-slate-100 rounded-lg h-full">
        <div
            class="accordion__trigger hover:bg-primary rounded-lg hover:text-white"
            :class="{ accordion__trigger_active: visible }"
            @click="open"
        >
            <!-- This slot will handle the title/header of the accordion and is the part you click on -->
            <slot name="accordion-trigger"></slot>
        </div>

        <Transition
            name="accordion"
            @before-enter="start"
            @enter="start"
            @after-enter="end"
            @before-leave="start"
            @after-leave="end"
        >
            <div v-show="visible" class="accordion__content">
                <ul>
                    <!-- This slot will handle all the content that is passed to the accordion -->
                    <slot name="accordion-content"></slot>
                </ul>
            </div>
        </Transition>
    </li>
</template>

<style lang="scss" scoped>
.accordion__item {
    cursor: pointer;
    border-bottom: 1px solid #ebebeb;
    position: relative;
}

.accordion__trigger {
    display: flex;
    padding: 10px 20px 10px 20px;
    justify-content: center;
}

.accordion__content {
    padding-top: 5px;
    padding-bottom: 5px;
}

.accordion-enter-active,
.accordion-leave-active {
    will-change: height, opacity !important;
    transition: height 0.3s ease, opacity 0.3s ease !important;
    overflow: hidden !important;
}

.accordion-enter,
.accordion-leave-to {
    height: 0 !important;
    opacity: 0;
}
</style>
