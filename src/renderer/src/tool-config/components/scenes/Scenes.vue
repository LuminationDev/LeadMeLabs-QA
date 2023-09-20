<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLabStore } from '../../store/labStore'
import { onBeforeUnmount, ref } from 'vue'
import PrimaryButton from '../PrimaryButton.vue'
import ApplianceList from '../base/ApplianceList.vue'
import SceneForm from './SceneForm.vue'

const labStore = useLabStore()
const { scenes } = storeToRefs(labStore)
const { addOrUpdateItem, deleteItem, setCurrentlyEditingAppliance } = labStore

const editingAppliance = ref(null)

const setEditingAppliance = (appliance): void => {
    editingAppliance.value = appliance
    setCurrentlyEditingAppliance(appliance !== null)
}

onBeforeUnmount(() => {
    setEditingAppliance(null)
})

const createScene = (): void => {
    addOrUpdateItem('scenes')
    setEditingAppliance(scenes.value[scenes.value.length - 1])
}

const saveScene = (type, scene, previousId?): void => {
    addOrUpdateItem(type, scene, previousId)
    setEditingAppliance(null)
}

const deleteScene = (type, id): void => {
    deleteItem(type, id)
    setEditingAppliance(null)
}
</script>

<template>
    <div class="flex bg-white flex-col">
        <ApplianceList
            v-if="editingAppliance === null"
            :appliances="scenes"
            type="scenes"
            @edit-appliance="setEditingAppliance"
        />
        <PrimaryButton v-if="editingAppliance === null" class="mt-2 w-96" @click="createScene">
            Add new scene
        </PrimaryButton>
        <SceneForm
            v-else
            class="w-full"
            :scene="editingAppliance"
            type="scenes"
            @save-item="saveScene"
            @delete-item="deleteScene"
            @deleted="
                () => {
                    setEditingAppliance(null)
                }
            "
        />
    </div>
</template>

<style scoped></style>
