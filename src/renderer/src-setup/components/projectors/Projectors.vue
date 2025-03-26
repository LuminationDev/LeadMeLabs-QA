<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLabStore } from '../../store/labStore'
import {onBeforeUnmount, ref} from 'vue'
import PrimaryButton from '../PrimaryButton.vue'
import ApplianceList from '../base/ApplianceList.vue'
import BaseEpsonForm from "../base/BaseEpsonForm.vue";
import BasePanasonicForm from "../base/BasePanasonicForm.vue";

const labStore = useLabStore()
const { sources } = storeToRefs(labStore)
const { addOrUpdateItem, setCurrentlyEditingAppliance } = labStore

const editingAppliance = ref(null)
const projectorType = ref("")

const setEditingAppliance = (appliance): void => {
  editingAppliance.value = appliance
  if (appliance !== null) {
    projectorType.value = appliance['automationType']
  }
  setCurrentlyEditingAppliance(appliance !== null)
}

onBeforeUnmount(() => {
  setEditingAppliance(null)
})

const createProjector = (type: string): void => {
  addOrUpdateItem(`sources-${type}`)
  setEditingAppliance(sources.value[sources.value.length - 1])
  projectorType.value = type;
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
        <PrimaryButton v-if="editingAppliance === null" class="mt-2 w-96" @click="createProjector('epson')">
            Add new Epson projector
        </PrimaryButton>
        <PrimaryButton v-if="editingAppliance === null" class="mt-2 w-96" @click="createProjector('panasonic')">
          Add new Panasonic projector
        </PrimaryButton>

        <BaseEpsonForm
            v-else-if="projectorType === 'epson'"
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

        <BasePanasonicForm
            v-else-if="projectorType === 'panasonic'"
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
