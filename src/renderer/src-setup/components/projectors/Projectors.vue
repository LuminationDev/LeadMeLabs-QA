<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLabStore } from '../../store/labStore'
import {onBeforeUnmount, ref} from 'vue'
import PrimaryButton from '../PrimaryButton.vue'
import ApplianceList from '../base/ApplianceList.vue'
import BaseEpsonForm from "../base/BaseEpsonForm.vue";

const labStore = useLabStore()
const { sources } = storeToRefs(labStore)
const { addOrUpdateItem, setCurrentlyEditingAppliance } = labStore

const editingAppliance = ref(null)

const setEditingAppliance = (appliance): void => {
    editingAppliance.value = appliance
    setCurrentlyEditingAppliance(appliance !== null)
}

onBeforeUnmount(() => {
    setEditingAppliance(null)
})

const createProjector = (): void => {
    addOrUpdateItem('sources')
    setEditingAppliance(sources.value[sources.value.length - 1])
}
</script>

<template>
    <div class="flex bg-white flex-col">
        <ApplianceList
            v-if="editingAppliance === null"
            :appliances="sources"
            type="sources"
            @edit-appliance="setEditingAppliance"
        />
        <PrimaryButton v-if="editingAppliance === null" class="mt-2 w-96" @click="createProjector">
            Add new projector
        </PrimaryButton>
        <BaseEpsonForm
            v-else
            class="w-full"
            :data="editingAppliance"
            type="sources"
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
