<script setup lang="ts">
import { computed } from 'vue'
import pencil from '@renderer/assets/icons/pencil.svg'
import warning from '@renderer/assets/icons/warning.svg'
import duplicate from '@renderer/assets/icons/duplicate.svg'
import arrowUp from '@renderer/assets/icons/arrowUp.svg'
import arrowDown from '@renderer/assets/icons/arrowDown.svg'

import {
    isIncompleteGenericAppliance,
    isIncompleteCbusAppliance,
    isIncompleteEpsonAppliance,
    isIncompleteRoom,
    isIncompleteScene,
    isIncompleteStation,
    useLabStore
} from '../../store/labStore'
import { storeToRefs } from 'pinia'
import Epson from '../../models/_epson'
import { Room, Scene, Station } from '../../models'
import Cbus from '../../models/_cbus'
import Appliance from '../../models/_appliance'
import ApplianceInterface from "@renderer/tool-config/models/_appliance_interface";

const labStore = useLabStore()
const { splicers } = storeToRefs(labStore)

const props = defineProps({
    appliance: {
        type: [Appliance, Room, Object],
        required: true
    },
    type: {
        type: String,
        required: true
    },
    index: {
        type: Number,
        required: true
    },
    duplicating: {
        type: Boolean,
        required: false,
        default: false
    }
})

const emit = defineEmits<{
    (e: 'editAppliance', appliance: any): void
    (e: 'duplicateAppliance', index: number): void
}>()

const uppercaseType = computed(() => {
    return props.type.split('')[0].toUpperCase() + props.type.substring(1, props.type.length)
})

const editAppliance = (): void => {
    emit('editAppliance', props.appliance)
}

const isIncomplete = computed(() => {
    if (props.type === 'splicers') {
        // @ts-ignore mismatch param and argument type
        const additionalSplicer: Cbus = splicers.value.find(
            (el) => el.name === props.appliance.name + ' Power'
        )

        return (
            //@ts-ignore props.appliance is appliance type and missing some cbus info
            isIncompleteCbusAppliance(props.appliance) ||
            isIncompleteCbusAppliance(additionalSplicer)
        )
    }
    switch (props.type) {
        case 'lights':
        case 'blinds':
        case 'splicers':
        case 'ledRings':
            return isIncompleteCbusAppliance(props.appliance as Cbus)
        case 'projectors':
        case 'sources':
            return isIncompleteEpsonAppliance(props.appliance as Epson)
        case 'rooms':
            return isIncompleteRoom(props.appliance as Room)
        case 'scenes':
            return isIncompleteScene(props.appliance as Scene)
        case 'stations':
            return isIncompleteStation(props.appliance as Station)
        default:
            return isIncompleteGenericAppliance(props.appliance as ApplianceInterface)
    }
})

const applianceName = computed(() => {
    if (props.appliance && props.appliance.name) {
        return props.appliance.name
    }
    return uppercaseType.value + ' ' + (props.index + 1)
})
const hasPrev = computed(() => {
    if (props.index === 0 || !(labStore[props.type].length > 1)) {
        return false
    }

    return true
})
const hasNext = computed(() => {
    if (labStore[props.type].length <= 1 || props.index === labStore[props.type].length - 1) {
        return false
    }
    if (props.type === 'splicers' && props.index === labStore[props.type].length / 2 - 1) {
        return false
    }
    return true
})

const emitDuplicateAppliance = (): void => {
    emit('duplicateAppliance', props.index)
}
const handleReorderUp = (type: string, index: number): void => {
    if (type === 'splicers') {
        labStore.reorderItem(type, index * 2, index * 2 - 2)
        labStore.reorderItem(type, index * 2 + 1, index * 2 - 1) // move splicer power
    } else {
        labStore.reorderItem(type, index, index - 1)
    }
}
const handleReorderDown = (type: string, index: number): void => {
    if (type === 'splicers') {
        labStore.reorderItem(type, index * 2, index * 2 + 2)
        labStore.reorderItem(type, index * 2 + 1, index * 2 + 3)
    } else {
        labStore.reorderItem(type, index, index + 1)
    }
}
</script>
<template>
    <div class="flex-row" :class="{'bg-red-400': duplicating}">
        <div
            class="border-black border-2 rounded-lg p-2 w-96 flex justify-between cursor-pointer"
            @click="editAppliance"
        >
            <div>
                <img
                    v-if="isIncomplete"
                    class="w-6 h-6 mr-2"
                    :src="warning"
                    alt="incomplete appliance icon"
                />
                {{ applianceName }}
                <span v-if="type !== 'rooms'" class="text-gray-400"
                    >&nbsp;-&nbsp;{{ appliance['room'] ? appliance['room'] : '' }}</span
                >
            </div>
            <img class="w-6 h-6" :src="pencil" alt="edit icon" />
        </div>
        <button
            :id="`duplicateApplianceButton${index}`"
            class="flex cursor-pointer items-center justify-center ml-3 border-0 border-transparent focus:border-0 focus:border-transparent focus:ring-0"
            @click="emitDuplicateAppliance"
        >
            <img class="w-6 h-6" :src="duplicate" alt="icon denoting duplicate action" />
        </button>
        <button
            :id="`orderUpApplianceButton${index}`"
            class="flex cursor-pointer items-center justify-center ml-3 border-0 border-transparent focus:border-0 focus:border-transparent focus:ring-0"
            :class="{ 'pointer-events-none opacity-30 cursor-not-allowed': !hasPrev }"
            @click="() => handleReorderUp(type, index)"
        >
            <img
                class="w-6 h-6 active:scale-95"
                :src="arrowUp"
                alt="icon denoting duplicate action"
            />
        </button>
        <button
            :id="`orderDownApplianceButton${index}`"
            class="flex cursor-pointer items-center justify-center ml-3 border-0 border-transparent focus:border-0 focus:border-transparent focus:ring-0"
            :class="{ 'pointer-events-none opacity-30 cursor-not-allowed': !hasNext }"
            @click="() => handleReorderDown(type, index)"
        >
            <img
                class="w-6 h-6 active:scale-95"
                :src="arrowDown"
                alt="icon denoting duplicate action"
            />
        </button>
    </div>
</template>
