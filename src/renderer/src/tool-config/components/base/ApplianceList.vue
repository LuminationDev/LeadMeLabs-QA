<script setup lang="ts">
import ApplianceListItem from './ApplianceListItem.vue'
import Appliance from '../../models/_appliance'
import { Room } from '../../models'
import { useLabStore } from '../../store/labStore'
import {ref} from "vue";

const props = defineProps({
    appliances: {
        type: Array as () => Array<Appliance> | Array<Room>,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})

const emit = defineEmits<{
    (e: 'editAppliance', appliance: any): void
}>()

const editAppliance = (appliance): void => {
    emit('editAppliance', appliance)
}
const duplicating = ref(false)
const handleDuplicateAppliance = async (index: number): Promise<void> => {
    // call the duplicate function here
    duplicating.value = true
    await useLabStore().duplicateItem(props.type, index)
    duplicating.value = false
}
</script>
<template>
    <div class="flex flex-col relative">
        <div v-if="duplicating" class="absolute w-[32rem] h-full bg-gray-400 opacity-40"></div>
        <ApplianceListItem
            v-for="(appliance, index) in props.appliances"
            :key="index"
            class="my-2"
            :appliance="appliance"
            :index="index"
            :type="type"
            @edit-appliance="editAppliance"
            @duplicate-appliance="handleDuplicateAppliance"
        />
    </div>
</template>
