<script setup lang="ts">
import { computed } from 'vue'
import SceneChecklistSelectorRadioButtons from './SceneChecklistSelectorRadioButtons.vue'

const props = defineProps({
    modelValue: {
        type: [Object],
        required: true
    },
    index: {
        type: String,
        required: true
    },
    appliance: {
        type: Object,
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

function handleCheckboxInput(event, id): void {
    emit('updateSelected', event.target.checked, id)
}

function handleUpdateValue(value, id): void {
    emit('updateValue', value, id)
}

const emit = defineEmits<{
    (e: 'updateSelected', checked: boolean, id: string)
    (e: 'updateValue', value: string, id: string)
}>()

const applianceInData = computed(() => {
    // @ts-ignore modelValue is array and has find function
    const app = props.modelValue.find((element) => element.id == props.appliance['id'])
    return app
})

const currentSelection = computed(() => {
    if (!applianceInData.value) {
        return ''
    }
    if (props.type === 'stations') {
        return applianceInData.value.action
    }
    return applianceInData.value.value
})
</script>

<template>
    <div class="flex-row h-full w-full items-center my-2">
        <div class="w-1/12">
            <input
                :id="props.id + 'Checkbox' + '_' + props.index"
                class="w-6 h-6"
                type="checkbox"
                :checked="applianceInData"
                :value="appliance.id"
                @change="
                    (checked) => {
                        handleCheckboxInput(checked, appliance.id)
                    }
                "
            />
        </div>
        <label class="w-3/12" :for="appliance.id">{{ appliance.name }}</label>
        <div class="w-8/12">
            <SceneChecklistSelectorRadioButtons
                :id="props.id + 'Radios_' + props.index"
                :appliance="appliance"
                :type="type"
                :disabled="!applianceInData"
                :selection="currentSelection"
                @update-value="handleUpdateValue"
            />
        </div>
    </div>
</template>
