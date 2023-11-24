<script setup lang="ts">
import router from '../../router/router'
import { useRoute } from 'vue-router'
import { useLabStore } from '../store/labStore'
import { ref, onBeforeMount } from 'vue'
import { useConfigStore } from '../store/configStore'
import WelcomePopup from './WelcomePopup.vue'
import { storeToRefs } from 'pinia'
import { Station } from '../models'

const route = useRoute()
const labStore = useLabStore()
const { loadJsonToStore, resetStore } = labStore
const configStore = useConfigStore()
const {
    welcomeModal,
    existingApplianceFile,
    existingStationFile,
    initialApplianceData,
    initialStationData
} = storeToRefs(configStore)
const { setWelcomeModal, setEditMode, setSystemMessage, setErrorMessage } = configStore

onBeforeMount(async () => {
    // @ts-ignore typescript can't find window.api TODO
    const existingAppliance = await window.configApi.checkApplianceFile()
    // @ts-ignore typescript can't find window.api TODO
    const existingStation = await window.configApi.checkStationFile()
    existingApplianceFile.value = existingAppliance
    existingStationFile.value = existingStation
    //if (window.history.length <= 1) {
        setWelcomeModal(true)
    // }
})
const fileErrorStatus = ref(false)
const errorMessage = ref('')

async function loadJson(): Promise<void> {
    try {
        // @ts-ignore typescript can't find window.api TODO
        const appliancesFromJson = await window.configApi.readAppliancejson()
        // @ts-ignore typescript can't find window.api TODO
        const stationsFromJson = await window.configApi.readStationjson()
        // Forming stations object
        if (appliancesFromJson == 0) {
            fileErrorStatus.value = true
            errorMessage.value = 'Error occured while trying to read appliance list'
            ///////////////////////////////////
            //// main store specific item /////
            setErrorMessage('Error occured while trying to read appliance list')
            ///////////////////////////////////
        } else if (stationsFromJson == 0) {
            fileErrorStatus.value = true
            errorMessage.value = 'Error occured while trying to read station list'
            ///////////////////////////////////
            //// main store specific item /////
            setErrorMessage('Error occured while trying to read station list')
            ///////////////////////////////////
        }

        // loadJSON when either appliance or station is not present
        if (stationsFromJson == 0 && appliancesFromJson == 0) {
            ///////////////////////////////////
            //// main store specific item /////
            setErrorMessage('Error occured while trying to read both appliance and station list')
            ///////////////////////////////////
            return
        } else if (stationsFromJson == 0) {
            // setting appliance only
            loadJsonToStore(appliancesFromJson)
            initialApplianceData.value = JSON.parse(labStore.displayState)
            console.log(initialApplianceData)
        } else if (appliancesFromJson == 0) {
            const tempStation = new Object()
            tempStation['name'] = 'stations'
            tempStation['objects'] = [...stationsFromJson]
            const stationArray = []
            // @ts-ignore TODO
            stationArray.push(tempStation)
            loadJsonToStore(stationArray)
            initialStationData.value = JSON.parse(labStore.getStations)
        } else {
            const tempStation = new Object()
            tempStation['name'] = 'stations'
            tempStation['objects'] = [...stationsFromJson]
            const combined = [...appliancesFromJson, tempStation]
            loadJsonToStore(combined)
            initialApplianceData.value = JSON.parse(labStore.displayState)
            initialStationData.value = JSON.parse(labStore.getStations)
            // console.log(initialApplianceData.value)
            // loadJsonToStore(initialApplianceData.value)
        }
        setEditMode(true)
        setSystemMessage('Loaded configuration file live folder')
    } catch (e) {
        console.error(e)
    }
}

// @ts-ignore remove this function is unused
async function rollbackToInitialData(): Promise<void> {
    // @ts-ignore todo
    loadJsonToStore(initialApplianceData.value)
    const tempStation = new Station()
    tempStation['name'] = 'stations'
    // @ts-ignore todo
    tempStation['objects'] = [...initialStationData.value]
    const stationArray: Array<Station> = []
    stationArray.push(tempStation)
    loadJsonToStore(stationArray)
    setSystemMessage('Data reverted to the original')
}

async function loadFilePicker(): Promise<void> {
    // @ts-ignore typescript can't find window.api TODO
    const resultFromJSON = await window.configApi.loadFilePicker()
    if (resultFromJSON === 0) {
        console.error('invalid path')
    } else {
        setEditMode(true)
        loadJsonToStore(resultFromJSON)
        setSystemMessage('Loaded configuration file from folders')
    }
}

async function startNewFile(): Promise<void> {
    // todo - check main store if anything needs to be done
    resetStore()
    console.log('start new file')
    setWelcomeModal(false)
    setEditMode(false)
    setSystemMessage('Creating a new appliance_list.json')
}

function handleOverlayClick(): void {
    setWelcomeModal(false)
}

async function handlePopupButton(type: string): Promise<void> {
    setWelcomeModal(false)
    if (type == 'continue') {
        await loadJson()
        // @ts-ignore typescript throwing errors TODO
        await router.push(route.meta.next)
    } else if (type == 'other') {
        await loadFilePicker()
        // @ts-ignore typescript throwing errors TODO
        await router.push(route.meta.next)
    } else {
        await startNewFile()
    }
}
</script>
<template>
    <div>
      <WelcomePopup
          v-if="welcomeModal"
          :overlay-click="handleOverlayClick"
          :button-click="handlePopupButton"
          :existing-file="existingApplianceFile"
      ></WelcomePopup>

      <div class="flex flex-col w-full px-4">
          <div class="flex flex-col w-full justify-center mb-5 mt-5 h-12 flex-shrink-0">
              <div class="flex flex-row justify-between items-center">
                  <h1 class="font-bold text-xl">Welcome to the LeadMe Labs Configuration Tool</h1>
              </div>
          </div>
          <div class="w-full flex-col border-t-gray-100 border-t-2">
              <h2 class="font-bold text-lg"></h2>
              <p class="mt-10">
                  This tool will assist you in building the JSON file necessary for the LeadMe Labs
                  software. The wizard will lead you through each appliance, step by step. If you
                  don’t have all of the details required, you can still continue through the
                  configuration.
              </p>
              <p class="mt-5">Click Next to continue to a new setup.</p>
          </div>
      </div>
    </div>
</template>
