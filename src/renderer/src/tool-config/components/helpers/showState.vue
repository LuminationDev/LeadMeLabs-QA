<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import GenericButton from '../GenericButton.vue'
import { useLabStore } from '../../store/labStore'
import { useConfigStore } from '../../store/configStore'
import minus from '@renderer/assets/icons/minus.svg'

const configStore = useConfigStore()
const { setShowPreview } = configStore

const labStore = useLabStore()
const { stations, rooms } = storeToRefs(labStore)

const closePreview = (): void => {
    setShowPreview(false)
}

const stationJson = computed(() => {
    return JSON.stringify(stations.value, null, 1)
})

const roomJson = computed(() => {
    return JSON.stringify(rooms.value, null, 1)
})
</script>
<template>
    <div class="flex flex-col p-5 h-full">
        <div class="flex flex-row justify-end">
            <GenericButton type="icon" icon-name="minus" :callback="closePreview">
                <img
                    class="w-2 h-2 stroke-inactive fill-inactive shrink-0 max-w-none"
                    :src="minus"
                    alt="icon denoting empty state"
                />
            </GenericButton>
        </div>
        <div class="flex flex-row justify-start">
            <h2 class="font-bold text-xl">JSON Preview</h2>
        </div>
        <div
            class="ease-in gray-scrollbar flex flex-col text-black bg-slate-50 overflow-scroll w-full h-full"
        >
            <pre class="break-words max-w-sm">{{ labStore.displayState }}</pre>
            <p v-if="stationJson !== '[]'">Station list</p>
            <pre v-if="stationJson !== '[]'" class="break-words max-w-sm">{{ stationJson }}</pre>
            <p v-if="roomJson !== '[]'">Room list</p>
            <pre v-if="roomJson !== '[]'" class="break-words max-w-sm">{{ roomJson }}</pre>
        </div>
    </div>
</template>
<style lang=""></style>
