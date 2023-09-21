<script setup lang="ts">
import { useLabStore } from '../../store/labStore'
import { ref } from 'vue'
import GenericButton from '../GenericButton.vue'

const labStore = useLabStore()
const { loadJsonToStore } = labStore
const fileErrorStatus = ref(false)
const errorMessage = ref('')

const tempList = ref([])

async function loadJson(): Promise<void> {
    try {
        // @ts-ignore typescript can't find window.api TODO
        const appliancesFromJSON = await window.configApi.readAppliancejson()
        // @ts-ignore typescript can't find window.api TODO
        const stationsFromJson = await window.configApi.readStationjson()
        // Forming stations object
        if (appliancesFromJSON == 0) {
            fileErrorStatus.value = true
            errorMessage.value = 'Error occured while trying to read appliance list'
            throw new Error('Error occured while trying to read appliance list')
        } else if (stationsFromJson == 0) {
            fileErrorStatus.value = true
            errorMessage.value = 'Error occured while trying to read station list'
            throw new Error('Error occured while trying to read station list')
        }
        const tempStation = new Object()
        tempStation['name'] = 'stations'
        tempStation['objects'] = [...stationsFromJson]
        const combined = [...appliancesFromJSON, tempStation]
        loadJsonToStore(combined)
    } catch (e) {
        console.error(e)
    }
}

//@ts-ignore can probably delete, but I'm not sure what it's used for just yet TODO
async function readTemp(): Promise<void> {
    // @ts-ignore typescript can't find window.api TODO
    const availTemp = await window.configApi.readTemp()
    console.log(availTemp)
    tempList.value = availTemp
}

//@ts-ignore can probably delete, but I'm not sure what it's used for just yet TODO
async function loadTemp(filepath): Promise<void> {
    console.log(filepath)
    // @ts-ignore typescript can't find window.api TODO
    await window.configApi.loadTemp(filepath)
}

//@ts-ignore can probably delete, but I'm not sure what it's used for just yet TODO
async function setCbus(ipAddress: string): Promise<boolean> {
    if (ipAddress.length > 8) {
        console.log('setting cbus ip to ' + ipAddress)
        // @ts-ignore typescript can't find window.api TODO
        return await window.configApi.setCbusip(ipAddress)
    } else {
        return false
    }
}

async function loadFilePicker(): Promise<void> {
    // @ts-ignore typescript can't find window.api TODO
    const resultFromJSON = await window.configApi.loadFilePicker()
    if (resultFromJSON === 0) {
        console.error('invalid path')
    } else {
        loadJsonToStore(resultFromJSON)
    }
}

async function saveFilePicker(): Promise<void> {
    // @ts-ignore typescript can't find window.api TODO
    const resultFromJSON = await window.configApi.saveFilePicker(
        labStore.displayState,
        labStore.getStations
    )
    console.log(resultFromJSON)
}
</script>

<template>
    <div class="flex-row">
        <GenericButton class="h-full mr-5 p-2" type="primary" :callback="loadJson">
            Edit live file (C:/labs_config/)
            <!--                <template #label><p>Load file</p></template>-->
        </GenericButton>
        <GenericButton class="h-full mr-5 p-2" type="primary" :callback="loadFilePicker">
            <p>Choose file to load</p>
        </GenericButton>
        <GenericButton class="h-full mr-5 p-2" type="primary" :callback="saveFilePicker">
            <p>Save file in a directory</p>
        </GenericButton>
    </div>
</template>

<style lang=""></style>
