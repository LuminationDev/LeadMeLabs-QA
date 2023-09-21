<script setup lang="ts">
import { cloneDeep } from 'lodash'
import SceneChecklistSelectorCheckbox from './SceneChecklistSelectorCheckbox.vue'
import ErrorMessages from '../inputs/ErrorMessages.vue'

const props = defineProps({
    modelValue: {
        type: [Object],
        required: true
    },
    v$: {
        type: Object,
        required: true
    },
    appliances: {
        type: [Object],
        required: true
    },
    type: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: false,
        default: ''
    }
})

function handleCheckboxInput(checked, id): void {
    let localData: any = cloneDeep(props.modelValue)
    if (!checked) {
        localData = localData.filter((element) => element.id !== id)
    } else {
        if (props.type === 'stations') {
            localData.push({
                id,
                action: ''
            })
        } else {
            localData.push({
                id,
                value: '',
                type: props.type
            })
        }
    }
    emit('update:modelValue', localData)
}

function handleUpdateValue(value, id): void {
    const localData: any = cloneDeep(props.modelValue)
    const index = localData.findIndex((element) => element.id === id)
    if (index !== -1) {
        if (props.type === 'stations') {
            localData[index].action = value
        } else if (props.type === 'sources') {
            localData[index].value = value
        } else {
            // value for projector needs to be casted to number
            localData[index].value = Number(value)
        }
    }
    emit('update:modelValue', localData)
}

const emit = defineEmits<{
    (e: 'update:modelValue', data)
}>()
</script>

<template>
    <div class="radio-selector flex-col mt-4">
        <slot name="header"></slot>
        <template v-if="type === 'stations'">
            <ErrorMessages :v$="v$" />
        </template>
        <SceneChecklistSelectorCheckbox
            v-for="(appliance, index) in props.appliances"
            :id="props.id"
            :key="appliance.id"
            :index="index"
            :appliance="appliance"
            :model-value="modelValue"
            :type="type"
            @update-selected="handleCheckboxInput"
            @update-value="handleUpdateValue"
        />
    </div>
</template>
