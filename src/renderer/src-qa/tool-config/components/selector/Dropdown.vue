<script setup lang="ts">
import ErrorMessages from '../inputs/ErrorMessages.vue'
import { useOptionalValidations } from '../../composables/requiredOptional'
import { computed } from 'vue'

const { testIfWouldPassRequired } = useOptionalValidations()

interface DropdownData {
    id: string | number
    name: string | number
}

const props = defineProps({
    v$: {
        type: Object,
        required: false
    },
    modelValue: {
        type: [String, Number],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    data: {
        type: Array as () => Array<DropdownData>,
        required: true
    },
    fieldId: {
        type: String,
        required: true
    },
    dataType: {
        type: String,
        required: false,
        default: 'string'
    },
    placeholder: {
        type: String,
        required: false
    },
    labelText: {
        type: String,
        required: false
    },
    inputCallback: {
        type: Function,
        required: false,
        default: () => {}
    }
})
const wouldPass = computed(() => {
    return testIfWouldPassRequired(props.modelValue)
})

const showError = computed(() => {
    return props.v$ && props.v$.$error
})

const showWarning = computed(() => {
    return (
        !showError.value &&
        props.v$ &&
        props.v$.requiredOptional &&
        !wouldPass.value &&
        !props.v$.$error &&
        props.v$.$dirty
    )
})
const emit = defineEmits(['update:modelValue'])

const handleInputType = (dataType = 'string', value): void => {
    if (dataType === 'number') {
        emit('update:modelValue', Number(value))
    } else {
        emit('update:modelValue', value)
    }
}
</script>

<template>
    <div class="flex flex-col">
        <slot name="label">
            <label
                class="mt-2 mb-1"
                :class="{
                    '!h-0': !$slots.label
                }"
                >{{ labelText }}</label
            >
        </slot>
        <select
            :id="fieldId"
            :value="modelValue"
            :name="name"
            class="p-2 border-2 rounded-lg"
            :class="{
                'border-black': !showError && !showWarning,
                'border-orange-500': showWarning,
                'border-red-500': showError
            }"
            @input="
                //@ts-ignore todo
                handleInputType(props.dataType, $event.target.value)
            "
        >
            <option selected value="">
                {{ placeholder ? placeholder : `Pick a ${name}` }}
            </option>
            <template v-for="item in data" :key="item.id">
                <option :value="item.id">{{ item.name }}</option>
            </template>
        </select>
        <ErrorMessages v-if="v$" :v$="v$" />
    </div>
</template>
