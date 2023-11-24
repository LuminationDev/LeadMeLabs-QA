<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLabStore } from '../../store/labStore'
import BaseCbusForm from '../base/BaseCbusForm.vue'
import {onBeforeUnmount, ref} from 'vue'
import PrimaryButton from '../PrimaryButton.vue'
import ApplianceList from '../base/ApplianceList.vue'

const labStore = useLabStore()
const { ledRings } = storeToRefs(labStore)
const { addOrUpdateItem, setCurrentlyEditingAppliance } = labStore

const editingAppliance = ref(null)

const setEditingAppliance = (appliance): void => {
    editingAppliance.value = appliance
    setCurrentlyEditingAppliance(appliance !== null)
}

onBeforeUnmount(() => {
    setEditingAppliance(null)
})

const createLedRing = (): void => {
    addOrUpdateItem('ledRings')
    setEditingAppliance(ledRings.value[ledRings.value.length - 1])
}
</script>

<template>
    <div class="flex bg-white flex-col">
        <ApplianceList
            v-if="editingAppliance === null"
            :appliances="ledRings"
            type="ledRings"
            @edit-appliance="setEditingAppliance"
        />
        <PrimaryButton v-if="editingAppliance === null" class="mt-2 w-96" @click="createLedRing">
            Add new LED ring
        </PrimaryButton>
        <BaseCbusForm
            v-else
            class="w-full"
            :data="editingAppliance"
            type="ledRings"
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
            name-placeholder="E.g. LED Ring 1"
        />
    </div>
</template>

<style scoped></style>
