<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLabStore } from '../../store/labStore'
import { onBeforeUnmount, ref } from 'vue'
import PrimaryButton from '../PrimaryButton.vue'
import ApplianceList from '../base/ApplianceList.vue'
import BaseStationForm from '../base/BaseStationForm.vue'

const labStore = useLabStore()
const { stations } = storeToRefs(labStore)
const { addOrUpdateItem, setCurrentlyEditingAppliance } = labStore

const editingAppliance = ref(null)

const setEditingAppliance = (appliance): void => {
    editingAppliance.value = appliance
    setCurrentlyEditingAppliance(appliance !== null)
}

onBeforeUnmount(() => {
    setEditingAppliance(null)
})

const createStation = (): void => {
    addOrUpdateItem('stations')
    setEditingAppliance(stations.value[stations.value.length - 1])
}
</script>

<template>
    <div class="flex bg-white flex-col">
        <ApplianceList
            v-if="editingAppliance === null"
            :appliances="stations"
            type="stations"
            @edit-appliance="setEditingAppliance"
        />
        <PrimaryButton v-if="editingAppliance === null" class="mt-2 w-96" @click="createStation">
            Add new station
        </PrimaryButton>
        <BaseStationForm
            v-else
            class="w-full"
            :data="editingAppliance"
            type="stations"
            @saved="
                () => {
                    setEditingAppliance(null)
                }
            "
            @deleted="
                () => {
                    setEditingAppliance(null)
                }
            "
        />
    </div>
</template>

<style scoped></style>
