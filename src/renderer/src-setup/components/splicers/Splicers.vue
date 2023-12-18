<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useLabStore } from '../../store/labStore'
import SplicerForm from './SplicerForm.vue'
import ApplianceList from '../base/ApplianceList.vue'
import PrimaryButton from '../PrimaryButton.vue'

const labStore = useLabStore()
const { splicers } = storeToRefs(labStore)
const { addOrUpdateItem, setCurrentlyEditingAppliance } = labStore

const trueSplicers = computed(() => {
    const splicerPowers = splicers.value.filter((el) => el.name.endsWith(' Power'))
    return splicerSources.value.map((splicer) => {
        const splicerPower = splicerPowers.find((element) => {
            if (element.name === splicer.name + ' Power') {
                return true
            }

            //@ts-ignore undefined function due to splicerpower do not have preappliance property
            return !!splicer.preAppliances.includes((el) => el.id === element.id)
        })
        return { splicer, splicerPower }
    })
})

const splicerSources = computed(() => {
    return splicers.value.filter((el) => !el.name.endsWith(' Power'))
})

const editingSplicer = ref(null)

const setEditingAppliance = (appliance): void => {
    if (appliance === null) {
        setEditingSplicer(null)
        setEditingSplicerPower(null)
        setCurrentlyEditingAppliance(false)
        return
    }
    const splicerSourceAndPower = trueSplicers.value.find(
        (element) => element.splicer.id === appliance.id
    )
    if (splicerSourceAndPower !== undefined) {
        setEditingSplicer(splicerSourceAndPower.splicer)
        setEditingSplicerPower(splicerSourceAndPower.splicerPower)
        setCurrentlyEditingAppliance(true)
    }
    // todo if splicerpower isn't present, create one here
}

onBeforeUnmount(() => {
    setEditingAppliance(null)
})

const setEditingSplicer = (appliance): void => {
    editingSplicer.value = appliance
}

const editingSplicerPower = ref(null)

const setEditingSplicerPower = (appliance): void => {
    editingSplicerPower.value = appliance
}

const createSplicer = (): void => {
    addOrUpdateItem('splicers')
    setEditingAppliance(splicers.value[splicers.value.length - 2])
}

function resetEditing(): void {
    setEditingAppliance(null)
}
</script>
<template>
    <div class="flex bg-white flex-col">
        <ApplianceList
            v-if="editingSplicer === null || editingSplicerPower === null"
            :appliances="splicerSources"
            type="splicers"
            @edit-appliance="setEditingAppliance"
        />
        <PrimaryButton
            v-if="editingSplicer === null || editingSplicerPower === null"
            class="mt-2 w-96"
            @click="createSplicer"
        >
            Add new splicer
        </PrimaryButton>
        <SplicerForm
            v-else-if="editingSplicer !== null && editingSplicerPower !== null"
            class="w-full"
            :splicer="editingSplicer"
            :splicer-power="editingSplicerPower"
            type="splicers"
            @saved="resetEditing"
            @deleted="resetEditing"
        />
    </div>
</template>

<style scoped></style>
