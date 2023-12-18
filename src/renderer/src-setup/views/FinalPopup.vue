<script setup lang="ts">
import GenericButton from '../components/GenericButton.vue'
import { useLabStore } from '../store/labStore'
import Tooltip from '../components/Tooltip.vue'
import { onUnmounted, ref } from 'vue'
import hint from '../../assets/icons/hint.svg'

const labStore = useLabStore()

const props = defineProps({
    handleClickOutside: {
        type: Function,
        required: true
    }
})

const savedPath = ref('')
const savedSuccessfully = ref(false)

async function uploadStation(): Promise<void> {
    // @ts-ignore typescript can't find window.api TODO
    await window.configApi.uploadStation(labStore.getStations)
}

async function uploadAppliance(): Promise<void> {
    // @ts-ignore typescript can't find window.api TODO
    savedPath.value = await window.configApi.uploadAppliance(labStore.displayState)
}

async function uploadBoth(): Promise<void> {
    await uploadStation()
    await uploadAppliance()
    savedSuccessfully.value = true
}

async function saveFilePicker(): Promise<void> {
    // @ts-ignore typescript can't find window.api TODO
    const pathFromMainProcess = await window.configApi.saveFilePicker(
        labStore.displayState,
        labStore.getStations
    )
    savedPath.value = pathFromMainProcess
    savedSuccessfully.value = true
}

onUnmounted(() => {
    savedPath.value = ''
    savedSuccessfully.value = false
})
</script>
<template>
    <div
        class="grey-overlay absolute w-screen h-screen bg-gray-400 z-30 opacity-60 top-0 left-0 grid place-content-center"
        @click="props.handleClickOutside()"
    ></div>
    <div
        class="popup-content z-50 w-[50vw] h-[50vh] max-w-[550px] max-h-[600px] bg-white rounded-3xl flex flex-col justify-center items-center absolute m-auto top-0 bottom-0 left-0 right-0"
    >
        <template v-if="!savedSuccessfully && savedPath.length === 0">
            <div class="font-bold pb-2 text-2xl">Finalise</div>
            <div class="pb-5 text-xl">Choose an option</div>

            <GenericButton class="w-52" type="primary" :callback="saveFilePicker">
                <div class="flex flex-row justify-between w-full px-2">
                    <span>Export files</span>
                    <span class="has-tooltip">
                        <img :src="hint" alt="Hint" class="h-6 w-6" />
                        <Tooltip
                            tip="Allows you to save the file anywhere you would like"
                            tool-tip-margin="-ml-1"
                            arrow-margin="ml-1"
                        />
                    </span>
                </div>
            </GenericButton>
            <div class="text-lg mb-5">or</div>
            <GenericButton class="w-52" type="primary" :callback="uploadBoth">
                <div class="flex flex-row justify-between w-full px-2">
                    <span>Save files</span>
                    <span class="has-tooltip">
                        <img :src="hint" alt="Hint" class="h-6 w-6" />
                        <Tooltip
                            tip="Saves the file in the labs_config folder"
                            tool-tip-margin="-ml-1"
                            arrow-margin="ml-1"
                        />
                    </span>
                </div>
            </GenericButton>
        </template>
        <template v-else>
            <div class="font-bold pb-2 text-2xl">File saved successfully</div>
            <div class="pb-5 text-md text-center">Saved at {{ savedPath }}</div>
            <div class="text-md text-center mb-5">
                Please restart NUC/Station programs for the changes to take effect
            </div>
            <GenericButton class="w-52" type="primary" :callback="props.handleClickOutside">
                Dismiss
            </GenericButton>
        </template>
    </div>
</template>
