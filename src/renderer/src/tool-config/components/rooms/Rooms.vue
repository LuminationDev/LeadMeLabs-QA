<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLabStore } from '../../store/labStore'
import { onBeforeUnmount, ref } from 'vue'
import PrimaryButton from '../PrimaryButton.vue'
import ApplianceList from '../base/ApplianceList.vue'
import RoomForm from './RoomForm.vue'

const labStore = useLabStore()
const { rooms } = storeToRefs(labStore)
const { addOrUpdateItem, deleteItem, setCurrentlyEditingAppliance } = labStore

const editingAppliance = ref(null)

const setEditingAppliance = (appliance): void => {
    editingAppliance.value = appliance
    setCurrentlyEditingAppliance(appliance !== null)
}

onBeforeUnmount(() => {
    setEditingAppliance(null)
})

const createRoom = (): void => {
    addOrUpdateItem('rooms')
    setEditingAppliance(rooms.value[rooms.value.length - 1])
}

const saveRoom = (type, room, previousId?): void => {
    addOrUpdateItem(type, room, previousId)
    setEditingAppliance(null)
}

const deleteRoom = (type, id): void => {
    deleteItem(type, id)
    setEditingAppliance(null)
}
</script>

<template>
    <div class="flex bg-white flex-col">
        <ApplianceList
            v-if="editingAppliance === null"
            :appliances="rooms"
            type="rooms"
            @edit-appliance="setEditingAppliance"
        />
        <PrimaryButton v-if="editingAppliance === null" class="mt-2 w-96" @click="createRoom">
            Add new room
        </PrimaryButton>
        <RoomForm
            v-else
            class="w-full"
            :room="editingAppliance"
            type="rooms"
            @save-item="saveRoom"
            @delete-item="deleteRoom"
        />
    </div>
</template>

<style scoped></style>
