import { ref, onBeforeMount, toRaw, computed } from 'vue';
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onBeforeMount, ref, computed, reactive, onMounted, Teleport } from 'vue'
import useVuelidate from '@vuelidate/core'
import { debounce, isEqual } from 'lodash'
import { required, minLength, minValue, maxValue, requiredIf, helpers } from '@vuelidate/validators'

import errorIcon from '../../../assets/icons/error.svg'
import { useLabStore } from '../../store/labStore'
import { Scene } from '../../models'
import NumberInput from '../inputs/NumberInput.vue'
import CbusDetails from '../cbus/CbusDetails.vue'
import SceneChecklistSelector from './SceneChecklistSelector.vue'
import { useOptionalValidations } from '../../../composables/requiredOptional'
import TextInput from '../inputs/TextInput.vue'
import Dropdown from '../selector/Dropdown.vue'
import ErrorMessages from '../inputs/ErrorMessages.vue'
import { stall } from '../helpers/helper'
import Spinner from '../spinner/Spinner.vue'
import {useChecklistStore} from "../../store/checklistStore";

const { requiredOptional } = useOptionalValidations()
const labStore = useLabStore()
const { stations, rooms, projectors, sources, scenes } = storeToRefs(labStore)

const props = defineProps({
    scene: {
        type: Scene,
        required: true
    }
})
const type = 'scenes'
const teleportReady = ref(false)

onBeforeMount(() => {
    // localScene.value = Object.assign({}, props.scene)
    state.id = props.scene.id
    state.name = props.scene.name
    state.room = props.scene.room
    state.automationBase = props.scene.automationBase
    state.automationGroup = props.scene.automationGroup
    state.automationId = props.scene.automationId
    state.automationType = props.scene.automationType
    state.automationValue = props.scene.automationValue
    state.sceneId = props.scene.sceneId
    state.stations = props.scene.stations ? props.scene.stations : []
    state.appliances = props.scene.appliances ? props.scene.appliances : []
})
onMounted(() => {
    teleportReady.value = true
})

interface State {
    id: number
    name: string
    room: string
    automationBase: number
    automationGroup: number
    automationId: number
    automationType: string
    automationValue: number
    sceneId: number
    stations: Array<{ id?: number; action?: string }> | []
    appliances: Array<{ id?: number; value?: number; type?: string }> | []
}

const state: State = reactive({
    id: 0,
    name: '',
    room: '',
    automationBase: 0,
    automationGroup: 0,
    automationId: 0,
    automationType: 'cbus',
    automationValue: 0,
    sceneId: 0,
    stations: [],
    appliances: []
})

const applianceMustHaveValue = (appliances: any): boolean => {
    let valid = true
    appliances.forEach((appliance) => {
        if (appliance.value.length <= 0) {
            valid = false
        }
    })
    return valid
}

const stationMustHaveAction = (stations: any): boolean => {
    let valid = true
    stations.forEach((station) => {
        if (!station.action || station.action.length <= 0) {
            valid = false
        }
    })
    return valid
}

const rules = {
    id: { required },
    name: { required, minLength: minLength(2) },
    room: { required, minLength: minLength(1) },
    automationBase: { minValue: minValue(0), maxValue: maxValue(255), requiredOptional },
    automationGroup: { minValue: minValue(0), maxValue: maxValue(255), requiredOptional },
    automationId: { minValue: minValue(0), maxValue: maxValue(255), requiredOptional },
    automationValue: {
        requiredOptional,
        required: requiredIf(!!(state.automationGroup && state.automationGroup > 0))
    },
    sceneId: { requiredOptional },
    stations: {
        stationMustHaveAction: helpers.withMessage(
            'Each selected station must have an action',
            stationMustHaveAction
        )
    },
    appliances: {
        applianceMustHaveValue: helpers.withMessage(
            'Each selected projector or source must have a value',
            applianceMustHaveValue
        )
    }
}

const v$ = useVuelidate(rules, state)

const currentlyUsedAutomationValues = computed(() => {
    return scenes.value
        .filter((element) => element.sceneId === state.sceneId)
        .filter((element) => element.id !== props.scene.id)
        .map((element) => element.automationValue)
})

const emit = defineEmits<{
    // (e: 'updateId', scene: Scene): void
    (e: 'saveItem', type: string, scene: Scene): void
    (e: 'saveItem', type: string, scene: Scene, previousId: number): void
    (e: 'deleteItem', type: string, id: number): void
    (e: 'deleted'): void
}>()

async function save(): Promise<void> {
    await v$.value.$validate()
    if (v$.value.$invalid || currentlyUsedAutomationValues.value.includes(state.automationValue)) {
        return
    }
    // @ts-ignore todo
    await retrieveCbusId()
    // @ts-ignore todo
    emit('saveItem', type, Object.assign({}, state), props.scene.id)
}

function remove(): void {
    emit('deleteItem', 'scenes', state.id)
}

function close(): void {
    emit('deleted')
}

const fetchingId = ref(false)
const nameInputRef = ref(null)

async function retrieveCbusId(): Promise<void> {
    if (!useChecklistStore().getCbusStatus) {
        return
    }
    fetchingId.value = true
    // @ts-ignore typescript can't find window.api TODO
    const cbusGeneratedId = await window.configApi.getCbusId(
        state.automationBase,
        state.automationGroup,
        state.automationId
    )
    await stall()
    const value = parseInt(cbusGeneratedId)
    if (value > 0) {
        state.sceneId = parseInt(cbusGeneratedId)
        state.id = Number(parseInt(cbusGeneratedId) + '' + state.automationValue)
    }
    fetchingId.value = false
}

const debounceRetrieveCbusId = debounce(function debounceCallback() {
    retrieveCbusId()
}, 1000)

const dataModified = computed(() => {
    return !isEqual(state, JSON.parse(JSON.stringify(props.scene)))
})

const roomOptions = computed(() => {
    return rooms.value.map((room) => {
        return {
            id: room.name,
            name: room.name
        }
    })
})

onMounted(() => {
    //@ts-ignore nameInputRef exist in template
    nameInputRef.value.focus()
    if (props.scene.name !== '') {
        v$.value.$touch()
    }
})

function updateCbusDetails(): void {
    const roomIndex = labStore.rooms.findIndex(element => element.name === v$.value.room.$model)
    if (roomIndex === -1) {
        return
    }
    state.automationBase = 0
    state.automationGroup = 202
    state.automationId = roomIndex + 1
    state.automationValue = labStore.getApplianceCountInRoom('scenes', v$.value.room.$model)
    debounceRetrieveCbusId()
}
</script>

<template>
    <div class="flex flex-col p-2 m-2">
        <TextInput
            ref="nameInputRef"
            v-model="v$.name.$model"
            :v$="v$.name"
            field-id="sceneName"
            class="my-2"
            placeholder="E.g. On"
        >
            <template #label>Name</template>
        </TextInput>

        <Dropdown
            v-model="v$.room.$model"
            :v$="v$.room"
            name="room"
            :data="roomOptions"
            field-id="itemRoom"
            class="my-2"
            placeholder="Please pick a room"
            @change="updateCbusDetails"
        >
            <template #label>
                <label class="mt-2 mb-1"> Which room does it belong to?</label>
            </template>
        </Dropdown>

        <CbusDetails
            v-model:automationBase="v$.automationBase.$model"
            v-model:automationGroup="v$.automationGroup.$model"
            v-model:automationId="v$.automationId.$model"
            class="my-2"
            :automation-base-validations="v$.automationBase"
            :automation-group-validations="v$.automationGroup"
            :automation-id-validations="v$.automationId"
            @update:automationBase="debounceRetrieveCbusId"
            @update:automationGroup="debounceRetrieveCbusId"
            @update:automationId="debounceRetrieveCbusId"
        />
        <template v-if="teleportReady">
            <Teleport to=".cbus-details-row">
                <NumberInput
                    v-model="v$.automationValue.$model"
                    field-id="sceneAutomationId"
                    class="pr-8 w-full"
                    :v$="v$.automationValue"
                    @input="retrieveCbusId"
                >
                    <template #label>Level <span class="text-xs">(0 - 255)</span></template>
                </NumberInput>
            </Teleport>
        </template>

        <div
            v-if="v$.$dirty && currentlyUsedAutomationValues.includes(state.automationValue)"
            class="flex flex-row items-center text-red-500 mt-2"
        >
            <img
                class="w-6 h-6 stroke-inactive fill-inactive shrink-0 max-w-none mr-1"
                :src="errorIcon"
                alt="error icon"
            />
            <span class="text-xs"
                >This automation value is currently in use for another scene with the same CBus
                Automation details and must be unique.</span
            >
        </div>
        <div class="flex-row">
            <NumberInput
                v-model="v$.id.$model"
                :v$="v$.id"
                :disabled="true"
                field-id="sceneId"
                class="basis-3/4 my-2"
            >
                <template #label>Id (automatically generated)</template>
            </NumberInput>
            <span v-if="fetchingId" class="basis-1/4 self-end"> <Spinner /> </span>
        </div>

        <SceneChecklistSelector
            v-if="stations.length"
            id="stationSelect"
            v-model="state.stations"
            :appliances="stations"
            type="stations"
            :v$="v$.stations"
        >
            <template #header>
                <p class="font-bold mb-2">Which stations should be triggered?</p>
            </template>
        </SceneChecklistSelector>
        <SceneChecklistSelector
            v-if="projectors.length"
            id="projectorSelect"
            v-model="state.appliances"
            :appliances="projectors"
            type="projectors"
            :v$="v$.appliances"
        >
            <template #header>
                <p class="font-bold mb-2">Which projectors should be triggered?</p>
            </template>
        </SceneChecklistSelector>
        <SceneChecklistSelector
            v-if="sources.length"
            id="sourceSelect"
            v-model="state.appliances"
            :appliances="sources"
            type="sources"
            :v$="v$.appliances"
        >
            <template #header>
                <p class="font-bold mb-2">Which sources should be triggered?</p>
            </template>
        </SceneChecklistSelector>
        <ErrorMessages :v$="v$.appliances" />

        <div class="flex-row my-2">
            <button
                class="p-2 flex items-center border-slate-800 border-2 hover:bg-gray-100 text-slate-800 h-auto rounded-lg text-base"
                @click="close"
            >
                Cancel
            </button>
            <button
                class="p-2 ml-4 flex items-center border-red-500 border-2 hover:bg-red-100 text-red-500 h-auto rounded-lg text-base"
                @click="remove"
            >
                Delete
            </button>
            <button
                class="p-2 ml-4 flex items-center border-primary bg-primary text-white border-2 hover:bg-slate-700 h-auto rounded-lg text-base disabled:cursor-not-allowed disabled:bg-slate-600 disabled:border-slate-600"
                :disabled="!dataModified || fetchingId"
                @click="save"
            >
                Save
            </button>
        </div>
    </div>
</template>
