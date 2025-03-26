<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useLabStore } from '../../store/labStore'
import { storeToRefs } from 'pinia'

import GenericButton from '../GenericButton.vue'
import hint from '../../../assets/icons/hint_dark.svg'
import { sourceObjectEpson } from '../constants/_labels'
import Tooltip from '../Tooltip.vue'
import * as EPSON from '../constants/_epson_codes'
import Spinner from '../spinner/Spinner.vue'

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    projectorStatus: {
        type: Number,
        required: true
    },
    sourceStatus: {
        type: String,
        required: true
    },
    sourceList: {
        type: Object,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    }
})

const labStore = useLabStore()
const { fetchingId } = storeToRefs(labStore)

const projectorTimer = ref<number>(0)
const showProjectorBooting = ref<boolean>(false)
const switchingSource = ref<boolean>(false)

let projectorInterval
watch(projectorTimer, () => {
    if (projectorTimer.value > 0) {
        showProjectorBooting.value = true
    } else {
        clearInterval(projectorInterval)
        showProjectorBooting.value = false
    }
})

const projectorStatusText = computed(() => {
    if (props.projectorStatus === null || props.projectorStatus === -1) {
        return ''
    } else if (props.projectorStatus === 0) {
        return 'Off'
    } else if (props.projectorStatus === 255) {
        return 'On'
    }
    return ''
})

const sourceStatusText = computed(() => {
    const source = sourceObjectEpson.find((el) => el.key === props.sourceStatus)
    if (source !== undefined) {
        return source.label
    } else {
        return 'HDMI'
    }
})

async function toggleProjectorStatus(): Promise<void> {
    fetchingId.value = true
    projectorTimer.value = 10
    projectorInterval = setInterval(() => {
        projectorTimer.value--
    }, 1000)

    await window.configApi.sendCommandTcpEpson(
        props.ipAddress,
        3629,
        props.name,
        !props.projectorStatus ? EPSON.POWER_ON : EPSON.POWER_OFF
    )
    fetchingId.value = false
}

async function changeSource(source: string): Promise<void> {
    const supportedSources = ['30', 'A0', 'C0', '80']
    if (supportedSources.find((el) => el == source) !== undefined) {
        switchingSource.value = true
        await window.configApi.sendCommandTcpEpson(
            props.ipAddress,
            3629,
            props.name,
            EPSON.SOURCE_OBJ[source]
        )
        switchingSource.value = false
    }
}
</script>
<template>
  <div class="flex-col">
    <div
        class="projector-status flex-col my-2"
        :class="[
            projectorStatus === null || projectorStatus == -1
                ? 'disabled grayscale pointer-events-none opacity-50'
                : ''
        ]"
    >
        <div class="flex-row">
            <div class="flex-col">
                <div class="flex-row">
                    <p class="font-semibold h-6">Current Projector Status</p>
                    <span class="has-tooltip">
                        <img :src="hint" alt="Hint" class="h-6 w-6 bg-red ml-2" />
                        <Tooltip
                            tip="Use this to check that you can turn on and off the projector. Anything you do here will not affect the exported files."
                            tool-tip-margin="-ml-1"
                            arrow-margin="ml-1"
                        >
                        </Tooltip>
                    </span>
                </div>
                <p>{{ `Click button below to switch ${projectorStatusText.toLowerCase()}` }}</p>
            </div>
            <div class="indicator-logo ml-10 justify-center items-center">
                <template v-if="projectorStatusText === 'On'">
                    <div
                        class="w-32 h-full bg-green-600 rounded-xl font-bold text-white grid place-items-center"
                    >
                        On
                    </div>
                </template>
                <template v-else-if="projectorStatusText === 'Off'">
                    <div
                        class="w-32 h-full bg-red-500 rounded-xl font-bold text-center grid place-items-center"
                    >
                        Off
                    </div>
                </template>
                <template v-else-if="projectorStatusText === ''">
                    <div
                        class="w-32 h-full bg-red-500 rounded-xl font-bold text-center grid place-items-center"
                    >
                        Not connected
                    </div>
                </template>
            </div>
            <span v-if="fetchingId" class="basis-1/4 self-center mr-5"> <Spinner /> </span>
        </div>
        <div class="flex-row my-2 items-center">
            <template v-if="showProjectorBooting">
                <GenericButton
                    class="mb-0 mr-4"
                    type="white"
                    disabled
                    :callback="toggleProjectorStatus"
                >
                    {{ `Switching ${projectorStatusText == 'Off' ? 'Off' : 'On'}` }}
                </GenericButton>
                <p class="text-sm">
                    Please wait {{ `${projectorTimer}` }} seconds before switching projector on/off
                    again
                </p>
            </template>
            <template v-else-if="projectorStatus === 0">
                <GenericButton class="mb-0 mr-4" type="primary" :callback="toggleProjectorStatus"
                    >Switch On
                </GenericButton>
            </template>
            <template v-else>
                <GenericButton type="primary" :callback="toggleProjectorStatus"
                    >Switch Off
                </GenericButton>
            </template>
        </div>
    </div>
    <div
        class="source-status flex-col mt-2"
        :class="[
            projectorStatus === null ||
            switchingSource ||
            projectorStatus == -1 ||
            sourceStatus == '-1' ||
            projectorStatus === 0
                ? 'disabled grayscale pointer-events-none opacity-50'
                : ''
        ]"
    >
        <div class="flex-row">
            <div class="flex-col">
                <div class="flex-row">
                    <p class="font-semibold h-6">Current Source Status</p>
                    <span class="has-tooltip">
                        <img :src="hint" alt="Hint" class="h-6 w-6 bg-red ml-2" />
                        <Tooltip
                            tip="Use this to check that you can change the projectors source. Anything you do here will not affect the exported files."
                            tool-tip-margin="-ml-1"
                            arrow-margin="ml-1"
                        >
                        </Tooltip>
                    </span>
                </div>
                <p>{{ `Click button below to change sources` }}</p>
            </div>
            <div class="indicator-logo ml-10 justify-center items-center">
                <div
                    class="w-32 h-full bg-green-600 rounded-xl font-bold text-white grid place-items-center"
                >
                    {{ sourceStatusText }}
                </div>
            </div>
            <span v-if="switchingSource" class="basis-1/4 self-center mr-5"> <Spinner /> </span>
        </div>

        <div class="flex-row my-2">
            <template v-for="(_source, index) in sourceList" :key="index">
                <GenericButton
                    class="mb-0 mr-4"
                    :type="sourceStatus === String(index) ? 'primary' : 'white'"
                    :callback="() => changeSource(String(index))"
                >
                    {{ sourceList[index] }}
                </GenericButton>
            </template>
        </div>
    </div>
  </div>
</template>
