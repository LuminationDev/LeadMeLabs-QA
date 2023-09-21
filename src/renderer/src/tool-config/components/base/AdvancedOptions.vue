<script setup lang="ts">
import Accordion from '../accordion/Accordion.vue'
import AccordionItem from '../accordion/AccordionItem.vue'
import { types, hidden } from '../constants/_types'
import { computed, onBeforeMount, reactive } from 'vue'
import Dropdown from '../selector/Dropdown.vue'
import { Blind, LedRing, Light, Projector, Splicer, Station } from '../../models'

const props = defineProps({
    data: {
        type: [Light, Blind, LedRing, Splicer, Projector, Station],
        required: true
    }
})

const emits = defineEmits<{ (e: 'advanceOptionsInput', displayType: string, hidden: string) }>()

const handleAdvanceOptionsInput = (): void => {
    emits('advanceOptionsInput', state.displayType, state.hidden)
}

const types_dropdown_data = computed(() => {
    return types.map((type) => {
        return {
            id: type,
            name: type
        }
    })
})

const hidden_dropdown_data = computed(() => {
    return hidden.map((el) => {
        return {
            id: el,
            name: el
        }
    })
})

const state = reactive({
    displayType: '',
    hidden: ''
})

onBeforeMount(() => {
    // @ts-ignore undefined as we may not want to save it against the object TODO - fix this
    state.displayType = props.data.displayType
    // @ts-ignore undefined as we may not want to save it against the object TODO - fix this
    state.hidden = props.data.hidden
})
</script>

<template>
    <div class="advanced-options flex-col">
        <Accordion>
            <AccordionItem>
                <template #accordion-trigger>
                    <div>Advanced Options</div>
                </template>
                <template #accordion-content>
                    <div class="flex flex-row items-center">
                        <div class="mr-5">displayType</div>
                        <Dropdown
                            v-model="state.displayType"
                            field-id="displayTypeDropdown"
                            :data="types_dropdown_data"
                            name="custom display type"
                            @input="handleAdvanceOptionsInput"
                        ></Dropdown>
                    </div>
                    <div class="flex flex-row items-center">
                        <div class="mr-5">Hidden</div>
                        <Dropdown
                            v-model="state.hidden"
                            field-id="hiddenDropdown"
                            :data="hidden_dropdown_data"
                            name="hidden status"
                            @input="handleAdvanceOptionsInput"
                        ></Dropdown>
                    </div>
                </template>
            </AccordionItem>
        </Accordion>
    </div>
</template>
