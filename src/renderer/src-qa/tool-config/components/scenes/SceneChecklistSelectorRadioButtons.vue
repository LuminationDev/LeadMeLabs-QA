<script setup lang="ts">
import { computed } from 'vue'
import { stationActions, projectorActions, sourceActions } from '../constants/_actions'

const props = defineProps({
    appliance: {
        type: Object,
        required: true
    },
    selection: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    disabled: {
        type: Boolean,
        required: true
    },
    id: {
        type: String,
        required: false,
        default: ''
    }
})

const selectionOptions = computed(() => {
    if (props.appliance.options) {
        const keys = Object.keys(props.appliance.options)
        return keys.map((key) => {
            return {
                value: key,
                name: props.appliance.options[key]
            }
        })
    }
    switch (props.type) {
        case 'stations':
            return stationActions
        case 'projectors':
            return projectorActions
        case 'sources':
            return sourceActions
    }
    return []
})

const emit = defineEmits<{
    (e: 'updateValue', value: string, id: string)
}>()

const handleSelection = (event): void => {
    emit('updateValue', event.target.value, props.appliance.id)
}
</script>

<template>
    <div>
        <template v-for="selectionOption in selectionOptions" :key="selectionOption.value">
            <label class="radio-custom-container w-4/12 mr-6">
                <input
                    class="radio-hidden"
                    type="radio"
                    :value="selectionOption.value"
                    :disabled="disabled"
                    :checked="selection === selectionOption.value"
                    @input="handleSelection"
                />
                <div
                    :id="props.id + '_' + selectionOption.name.replace(' ', '_')"
                    class="radio-custom-background rounded-xl justify-center items-center"
                >
                    <span class="radio-custom-text">{{ selectionOption.name }}</span>
                </div>
                <button
                    class="radio-hidden hidden-sr !h-[25px] !w-[25px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                    {{ props.id + '_' + selectionOption.name.replace(' ', '_') }}
                </button>
            </label>
        </template>
    </div>
</template>
