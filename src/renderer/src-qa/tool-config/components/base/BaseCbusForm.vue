<script setup lang="ts">
import {ref, onBeforeMount, reactive, onMounted} from 'vue'
import useVuelidate from '@vuelidate/core'
import { minValue, maxValue } from '@vuelidate/validators'
import { debounce } from 'lodash'
import { storeToRefs } from 'pinia'

import BaseForm from './BaseForm.vue'
import Spinner from '../spinner/Spinner.vue'
import CbusDetails from '../cbus/CbusDetails.vue'
import { useOptionalValidations } from '../../composables/requiredOptional'
import Cbus from '../../models/_cbus'
import BlindLabels from '../blinds/BlindLabels.vue'
import { useLabStore } from '../../store/labStore'
import CbusStatusToggle from '../cbus/CbusStatusToggle.vue'
import { stall } from '../helpers/helper'
import {useChecklistStore} from "../../store/checklistStore";

const { requiredOptional } = useOptionalValidations()

const props = defineProps({
    data: {
        type: Cbus,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    namePlaceholder: {
        type: String,
        required: true
    }
})

const labStore = useLabStore()
const { fetchingId } = storeToRefs(labStore)
const isCbusInformationSet = ref(false)

onBeforeMount(() => {
    state.automationBase = props.data.automationBase
    state.automationGroup = props.data.automationGroup
    state.automationId = props.data.automationId
    state.automationType = props.data.automationType
    // todo - if the loaded blind has no labels need to be able to add
    // @ts-ignore if statement is safe enough
    if (props.data['labels']) {
        state.labels = props.data['labels']
    }
})

onMounted(async () => {
    if (props.data.name !== '') {
        v$.value.$touch()
    }
    fetchingId.value = false // Reset
    //@ts-ignore window.api not recognized`
    isCbusInformationSet.value = await window.configApi.isCbusInformationSet()
    if (state.automationGroup && state.automationId && isCbusInformationSet.value) {
        await retrieveCbusIdAndStatus()
    }
})

const state = reactive({
    automationBase: 0,
    automationGroup: 0,
    automationId: 0,
    automationType: 'cbus',
    labels: []
})

function saveLabel(emittedLabels): void {
    state.labels = emittedLabels
}

const rules = {
    automationBase: { minValue: minValue(0), maxValue: maxValue(255), requiredOptional },
    automationGroup: { minValue: minValue(0), maxValue: maxValue(255), requiredOptional },
    automationId: { minValue: minValue(0), maxValue: maxValue(255), requiredOptional }
}
const v$ = useVuelidate(rules, state)

const buttonRef = ref<null | { click: () => null }>(null)
const cbusId = ref(0)
const cbusApplianceStatus = ref<number | null>(null)

async function retrieveCbusIdAndStatus(): Promise<void> {
    if (!useChecklistStore().getCbusStatus) {
        return
    }
    fetchingId.value = true
    // @ts-ignore typescript can't find window.api TODO
    const idAndStatusObject = await window.configApi.getApplianceIdAndStatus(
        state.automationBase,
        state.automationGroup,
        state.automationId
    )
    await stall()
    if (!idAndStatusObject) {
        fetchingId.value = false
        cbusApplianceStatus.value = null
        return
    }
    const id = Number(idAndStatusObject.id)
    const status = idAndStatusObject.status
    if (id > 0) {
        cbusId.value = id
        cbusApplianceStatus.value = status
        if (buttonRef.value) {
            buttonRef.value.click()
        }
    } else {
        cbusApplianceStatus.value = null
    }
    fetchingId.value = false
}

const debounceRetrieveCbusIdAndStatus = debounce(function debounceCallback() {
    if (!isCbusInformationSet.value) return
    retrieveCbusIdAndStatus()
}, 1000)

const handleUpdateApplianceStatus = (newStatus: number): void => {
    console.log(newStatus)
    cbusApplianceStatus.value = newStatus
}

const emit = defineEmits<{
    (e: 'saved'): void
    (e: 'deleted'): void
}>()

function updateCbusDetails(newRoom): void {
    const roomIndex = labStore.rooms.findIndex(element => element.name === newRoom)
    if (roomIndex === -1) {
        return
    }
    switch (props.type) {
        case 'lights':
            state.automationBase = 0
            state.automationGroup = 56 + (roomIndex * 10)
            state.automationId = labStore.getApplianceCountInRoom('lights', newRoom) + 1
            break
        case 'ledRings':
            state.automationBase = 0
            state.automationGroup = 95
            state.automationId = labStore.getApplianceCountInRoom('ledRings', newRoom) + 1 + (roomIndex * 10)
            break
        case 'blinds':
            state.automationBase = 0
            state.automationGroup = 57 + (roomIndex * 10)
            state.automationId = labStore.getApplianceCountInRoom('blinds', newRoom) + 1
            break
    }
    debounceRetrieveCbusIdAndStatus()
}
</script>
<template>
    <div class="flex-col">
        <BaseForm
            :additional-validations="v$"
            :additional-data="state"
            :data="data"
            :type="type"
            :name-placeholder="namePlaceholder"
            @deleted="
                () => {
                    emit('deleted')
                }
            "
            @saved="
                () => {
                    emit('saved')
                }
            "
            @room-changed="updateCbusDetails"
        >
            <template #idInput="{ idModel, updateIdModel }">
                <div class="flex flex-col my-2">
                    <label for="cbusId">Id (automatically generated)</label>
                    <div class="flex-row">
                        <input
                            id="cbusId"
                            disabled
                            :value="idModel < 1000000 ? 'Automatically generated' : idModel"
                            type="text"
                            class="textfield-primary basis-3/4 disabled:border-gray-300 disabled:text-gray-500"
                        />
                        <span v-if="fetchingId" class="basis-1/4 self-center"> <Spinner /> </span>
                    </div>
                    <button
                        ref="buttonRef"
                        aria-hidden="true"
                        class="hidden-sr hidden"
                        @click="
                            () => {
                                updateIdModel(cbusId)
                            }
                        "
                    ></button>
                </div>
            </template>

            <template #additionalFields>
                <CbusDetails
                    v-model:automationBase="v$.automationBase.$model"
                    v-model:automationGroup="v$.automationGroup.$model"
                    v-model:automationId="v$.automationId.$model"
                    class="my-2"
                    :automation-base-validations="v$.automationBase"
                    :automation-group-validations="v$.automationGroup"
                    :automation-id-validations="v$.automationId"
                    @update:automationBase="debounceRetrieveCbusIdAndStatus"
                    @update:automationGroup="debounceRetrieveCbusIdAndStatus"
                    @update:automationId="debounceRetrieveCbusIdAndStatus"
                />
                <!--                todo - move the blinds stuff into the blinds component-->
                <BlindLabels
                    v-if="type === 'blinds'"
                    :model-value="state.labels"
                    @update-label="saveLabel"
                />

                <CbusStatusToggle
                    :appliance-status="cbusApplianceStatus"
                    :automation-base="state.automationBase"
                    :automation-group="state.automationGroup"
                    :automation-id="state.automationId"
                    @update-appliance-status="handleUpdateApplianceStatus"
                />
            </template>
            <slot name="cbusAdditionalFields"></slot>
        </BaseForm>
    </div>
</template>
<style lang=""></style>
