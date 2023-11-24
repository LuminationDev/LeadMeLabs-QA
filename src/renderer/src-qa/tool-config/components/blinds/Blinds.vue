<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLabStore } from '../../store/labStore'
import BaseCbusForm from '../base/BaseCbusForm.vue'
import {onBeforeUnmount, ref} from 'vue'
import PrimaryButton from '../PrimaryButton.vue'
import ApplianceList from '../base/ApplianceList.vue'

const labStore = useLabStore()
const { blinds } = storeToRefs(labStore)
const { addOrUpdateItem, setCurrentlyEditingAppliance } = labStore

const editingAppliance = ref(null)

const setEditingAppliance = (appliance): void => {
    editingAppliance.value = appliance
    setCurrentlyEditingAppliance(appliance !== null)
}

onBeforeUnmount(() => {
    setEditingAppliance(null)
})

const createBlind = (): void => {
    addOrUpdateItem('blinds')
    setEditingAppliance(blinds.value[blinds.value.length - 1])
}
</script>

<template>
    <div class="flex bg-white flex-col">
        <ApplianceList
            v-if="editingAppliance === null"
            :appliances="blinds"
            type="blinds"
            @edit-appliance="setEditingAppliance"
        />
        <PrimaryButton v-if="editingAppliance === null" class="mt-2 w-96" @click="createBlind">
            Add new blind
        </PrimaryButton>
        <BaseCbusForm
            v-else
            class="w-full"
            :data="editingAppliance"
            type="blinds"
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
            name-placeholder="E.g. Blind 1"
        />
    </div>
</template>

<style scoped></style>
