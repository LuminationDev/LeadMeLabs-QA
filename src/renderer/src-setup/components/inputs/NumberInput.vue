<script setup lang="ts">
import { computed } from 'vue'
import { useOptionalValidations } from '../../../composables/requiredOptional'
import ErrorMessages from './ErrorMessages.vue'

const { testIfWouldPassRequired } = useOptionalValidations()

const props = defineProps({
    v$: {
        type: Object,
        required: true
    },
    modelValue: {
        type: Number,
        required: true
    },
    fieldId: {
        type: String,
        required: true
    },
    showWarning: {
        type: Boolean,
        required: false,
        default: false
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false
    },
    showErrorMessages: {
        type: Boolean,
        required: false,
        default: true
    }
})

const wouldPass = computed(() => {
    return testIfWouldPassRequired(props.modelValue)
})

defineEmits(['update:modelValue'])
</script>

<template>
    <div class="flex-col">
        <label class="h-8" :for="fieldId">
            <slot name="label" />
        </label>
        <input
            :id="fieldId"
            :value="modelValue"
            type="number"
            :disabled="disabled"
            class="disabled:border-gray-300 disabled:text-gray-500 w-full"
            :class="{
                'numberfield-automation': fieldId.includes('automation'),
                'numberfield-primary': !fieldId.includes('automation'),
                'border-orange-500':
                    (v$ && v$.requiredOptional && !wouldPass && !v$.$error && v$.$dirty) ||
                    showWarning,
                'border-red-500': v$ && v$.$error
            }"
            @input="
                //@ts-ignore todo
                $emit('update:modelValue', parseInt($event.target.value))
            "
        />
        <ErrorMessages v-if="showErrorMessages" :v$="v$" />
    </div>
</template>
