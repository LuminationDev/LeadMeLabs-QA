<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import NumberInput from '../inputs/NumberInput.vue'
import ErrorMessages from '../inputs/ErrorMessages.vue'
import warning from '../../../assets/icons/warning.svg'
import hint from '../../../assets/icons/hint_dark.svg'
import Tooltip from '../Tooltip.vue'
import {useChecklistStore} from "../../store/checklistStore";

/**
 * Note these labels:
 * Cbus Network == automationBase
 * Cbus Application == automationGroup
 * Cbus Group == automationId
 */
const props = defineProps({
    automationBase: {
        type: Number,
        required: true
    },
    automationBaseValidations: {
        type: Object,
        required: true
    },
    automationGroup: {
        type: Number,
        required: true
    },
    automationGroupValidations: {
        type: Object,
        required: true
    },
    automationId: {
        type: Number,
        required: true
    },
    automationIdValidations: {
        type: Object,
        required: true
    },
    uniqueIdPrefix: {
        type: String,
        required: false,
        default: ''
    }
})

const detailsAreIncomplete = computed(() => {
    return (
        props.automationBaseValidations.$dirty &&
        props.automationBase === 0 &&
        props.automationGroup === 0
    )
})
const isCbusInformationSet = ref(true)

onMounted(async () => {
    //@ts-ignore window.api not recognized
    isCbusInformationSet.value = await window.configApi.isCbusInformationSet() && useChecklistStore().getCbusStatus
})

defineEmits(['update:automationBase', 'update:automationGroup', 'update:automationId'])
</script>
<template>
    <div class="cbus-info flex flex-col">
        <div class="font-bold flex flex-row">
            <slot name="title">CBus Automation Address</slot>
            <span class="has-tooltip">
                <img :src="hint" alt="Hint" class="h-6 w-6 bg-red ml-2" />
                <Tooltip
                    tip="This information should be in your handover document it's normally in the format 0/56/1. The first digit is the base, the second digit is the group and the final digit is the id. You can also find this information in the CBus configurator as the group address for each object."
                    tool-tip-margin="-ml-1"
                    arrow-margin="ml-1"
                >
                </Tooltip>
            </span>
        </div>
        <div class="cbus-details-row flex flex-row w-full">
            <NumberInput
                :model-value="automationBase"
                :v$="automationBaseValidations"
                :show-warning="detailsAreIncomplete"
                :field-id="uniqueIdPrefix + 'automationBase'"
                class="pr-8 w-full"
                :show-error-messages="false"
                @update:modelValue="
                    (value) => {
                        $emit('update:automationBase', parseInt(value))
                    }
                "
            >
                <template #label>Network <span class="text-xs">(0 - 255)</span></template>
            </NumberInput>
            <NumberInput
                :model-value="automationGroup"
                :v$="automationGroupValidations"
                :show-warning="detailsAreIncomplete"
                :field-id="uniqueIdPrefix + 'automationGroup'"
                :show-error-messages="false"
                class="px-8 w-full"
                @update:modelValue="
                    (value) => {
                        $emit('update:automationGroup', parseInt(value))
                    }
                "
            >
                <template #label>Application <span class="text-xs">(0 - 255)</span></template>
            </NumberInput>
            <NumberInput
                :model-value="automationId"
                :v$="automationIdValidations"
                :show-warning="detailsAreIncomplete"
                :field-id="uniqueIdPrefix + 'automationId'"
                :show-error-messages="false"
                class="pl-8 pr-16 w-full"
                @update:modelValue="
                    (value) => {
                        $emit('update:automationId', parseInt(value))
                    }
                "
            >
                <template #label>Group <span class="text-xs">(0 - 255)</span></template>
            </NumberInput>
        </div>
        <div v-if="!isCbusInformationSet" class="flex flex-row mt-2 items-center">
            <img
                class="w-6 h-6 stroke-inactive fill-inactive shrink-0 max-w-none mr-1"
                :src="warning"
                alt="warning icon"
            />
            <span class="text-orange-500 text-xs"
                >The CBus address information is not set or not connected, so ids cannot be automatically retrieved.
                Please set this information on the checklist page.</span
            >
        </div>

        <ErrorMessages :v$="automationBaseValidations" />
        <ErrorMessages :v$="automationGroupValidations" />
        <ErrorMessages :v$="automationIdValidations" />
        <div
            v-if="detailsAreIncomplete && isCbusInformationSet"
            class="flex flex-row mt-2 items-center"
        >
            <img
                class="w-6 h-6 stroke-inactive fill-inactive shrink-0 max-w-none mr-1"
                :src="warning"
                alt="warning icon"
            />
            <span class="text-orange-500 text-xs"
                >You may continue without this information, but it is required for the appliance to
                function.</span
            >
        </div>
    </div>
</template>
<style lang=""></style>
