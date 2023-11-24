<script setup lang="ts">
import { computed } from 'vue'
import GenericButton from '../GenericButton.vue'
import hint from '../../../assets/icons/hint_dark.svg'

import Tooltip from '../Tooltip.vue'
import { useLabStore } from '../../store/labStore'
import { storeToRefs } from 'pinia'

const props = defineProps({
    applianceStatus: {
        type: Number as () => number | null,
        required: true
    },
    automationBase: {
        type: Number,
        required: true
    },

    automationGroup: {
        type: Number,
        required: true
    },
    automationId: {
        type: Number,
        required: true
    }
})

const labStore = useLabStore()
const { fetchingId } = storeToRefs(labStore)

const statusText = computed(() => {
    if (props.applianceStatus === 0) {
        return 'Off'
    } else if (props.applianceStatus === 255) {
        return 'On'
    } else {
        return ''
    }
})
const emit = defineEmits<{
    (e: 'updateApplianceStatus', value: number): void
}>()
const toggleStatus = async (): Promise<any> => {
    let newValue
    if (statusText.value === 'Off') {
        newValue = 255
    } else {
        newValue = 0
    }
    //@ts-ignore window.api not resolved TODO
    const result = await window.configApi.setCbusApplianceValue(
        props.automationBase,
        props.automationGroup,
        props.automationId,
        newValue
    )
    if (result.length > 0) {
        emit('updateApplianceStatus', newValue)
    }
}
</script>
<template>
    <div
        class="flex-col mt-2"
        :class="[
            applianceStatus === null || fetchingId
                ? 'disabled grayscale pointer-events-none opacity-50'
                : ''
        ]"
    >
        <div class="flex-row">
            <div class="flex-col">
                <div class="flex-row">
                    <p class="font-semibold h-6">Current C-Bus Appliance Status</p>
                    <span class="has-tooltip">
                        <img :src="hint" alt="Hint" class="h-6 w-6 bg-red ml-2" />
                        <Tooltip
                            tip="Use this to check that you can turn on and off the appliance. Anything you do here will not affect the exported files."
                            tool-tip-margin="-ml-1"
                            arrow-margin="ml-1"
                        >
                        </Tooltip>
                    </span>
                </div>
                <p>{{ `Click button below to switch ${statusText.toLowerCase()}` }}</p>
            </div>
            <div class="indicator-logo ml-10 justify-center items-center">
                <template v-if="statusText === 'On'">
                    <div
                        class="w-32 h-full bg-green-600 rounded-xl font-bold text-white grid place-items-center"
                    >
                        On
                    </div>
                </template>
                <template v-else-if="statusText === 'Off'">
                    <div
                        class="w-32 h-full bg-red-500 rounded-xl font-bold text-center grid place-items-center"
                    >
                        Off
                    </div>
                </template>
            </div>
        </div>
        <div class="flex-row my-2">
            <template v-if="statusText === 'Off'">
                <GenericButton class="mb-0 mr-4" type="primary" :callback="toggleStatus"
                    >Switch On
                </GenericButton>
            </template>
            <template v-else>
                <GenericButton type="white" :callback="toggleStatus">Switch Off</GenericButton>
            </template>
        </div>
    </div>
</template>
