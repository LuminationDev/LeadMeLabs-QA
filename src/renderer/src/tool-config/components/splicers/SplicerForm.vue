<script setup lang="ts">
import { ref, onBeforeMount, reactive, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { minValue, maxValue } from '@vuelidate/validators'
import { Splicer } from '../../models'
import { useLabStore } from '../../store/labStore'
import { useOptionalValidations } from '../../composables/requiredOptional'
import { storeToRefs } from 'pinia'
import { debounce, cloneDeep } from 'lodash'

import { stall } from '../helpers/helper'
import Spinner from '../spinner/Spinner.vue'
import CbusDetails from '../cbus/CbusDetails.vue'
import BaseForm from '../base/BaseForm.vue'

const { requiredOptional } = useOptionalValidations()

const labStore = useLabStore()
const { addOrUpdateItem, deleteItem } = labStore
const { fetchingId } = storeToRefs(labStore)

const props = defineProps({
    splicer: {
        type: Splicer,
        required: true
    },
    splicerPower: {
        type: Splicer,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    index: {
        type: Number,
        required: false
    }
})

onBeforeMount(() => {
    splicerState.automationBase = props.splicer.automationBase
    splicerState.automationGroup = props.splicer.automationGroup
    splicerState.automationId = props.splicer.automationId
    if (props.splicer.preAppliances !== undefined)
        splicerState.preAppliances = props.splicer.preAppliances
})

const splicerState = reactive({
    automationBase: 0,
    automationGroup: 0,
    automationId: 0,
    preAppliances: [] as Array<{
        id?: number
        type?: string
        value?: number
    }>
})

const splicerRules = {
    automationBase: { minValue: minValue(0), maxValue: maxValue(255), requiredOptional },
    automationGroup: { minValue: minValue(0), maxValue: maxValue(255), requiredOptional },
    automationId: { minValue: minValue(0), maxValue: maxValue(255), requiredOptional },
    preAppliances: {}
}
const splicerValidations = useVuelidate(splicerRules, splicerState)
const splicerButtonRef = ref<null | { click: () => null }>(null)
const splicerCbusId = ref(props.splicerPower.id)
const fetchingSplicerId = ref(false)

async function retrieveSplicerCbusId(): Promise<void> {
    fetchingSplicerId.value = true
    fetchingId.value = true // set to true as BaseForm(parent form) uses it to enable/disable button
    // @ts-ignore typescript can't find window.api TODO
    const cbusGeneratedId = await window.configApi.getCbusId(
        splicerState.automationBase,
        splicerState.automationGroup,
        splicerState.automationId
    )
    await stall()
    const value = parseInt(cbusGeneratedId)
    if (value > 0) {
        splicerCbusId.value = parseInt(cbusGeneratedId)
        if (splicerButtonRef.value) {
            splicerButtonRef.value.click()
        }
    }
    fetchingId.value = false
    fetchingSplicerId.value = false
}

const debounceRetrieveSplicerCbusId = debounce(function debounceCallback() {
    retrieveSplicerCbusId()
}, 500)

const splicerPowerState = reactive({
    automationBase: 0,
    automationGroup: 0,
    automationId: 0
})

onBeforeMount(() => {
    splicerPowerState.automationBase = props.splicerPower.automationBase
    splicerPowerState.automationGroup = props.splicerPower.automationGroup
    splicerPowerState.automationId = props.splicerPower.automationId
})

const splicerPowerRules = {
    automationBase: { minValue: minValue(0), maxValue: maxValue(255), requiredOptional },
    automationGroup: { minValue: minValue(0), maxValue: maxValue(255), requiredOptional },
    automationId: { minValue: minValue(0), maxValue: maxValue(255), requiredOptional }
}
const splicerPowerValidations = useVuelidate(splicerPowerRules, splicerPowerState)
const splicerPowerButtonRef = ref<null | { click: () => null }>(null)
const splicerPowerCbusId = ref(0)
const fetchingSplicerPowerId = ref(false)

async function retrieveSplicerPowerCbusId(): Promise<void> {
    fetchingSplicerPowerId.value = true
    fetchingId.value = true
    // @ts-ignore typescript can't find window.api TODO
    const cbusGeneratedId = await window.configApi.getCbusId(
        splicerPowerState.automationBase,
        splicerPowerState.automationGroup,
        splicerPowerState.automationId
    )
    await stall()
    const value = parseInt(cbusGeneratedId)
    if (value > 0) {
        splicerPowerCbusId.value = parseInt(cbusGeneratedId)
        if (splicerPowerButtonRef.value) {
            splicerPowerButtonRef.value.click()
        }
    }
    fetchingId.value = false
    fetchingSplicerPowerId.value = false
}

const debounceRetrieveSplicerPowerCbusId = debounce(function debounceCallback() {
    retrieveSplicerPowerCbusId()
}, 1000)

async function saveSplicerPower(splicer: any, success: boolean): Promise<void> {
    // todo - validate splicer power info
    splicerPowerValidations.value.$touch()
    if (success) {
        const newSplicerPower = cloneDeep(props.splicerPower)
        newSplicerPower.automationBase = splicerPowerState.automationBase
        newSplicerPower.automationId = splicerPowerState.automationId
        newSplicerPower.automationGroup = splicerPowerState.automationGroup
        await retrieveSplicerPowerCbusId() // fetch id again during save to ensure latest id is saved
        newSplicerPower.name = splicer.name + ' Power'
        newSplicerPower['hidden'] = 'true'
        if (splicerPowerCbusId.value !== null) {
            newSplicerPower.id = splicerPowerCbusId.value
        }
        newSplicerPower.room = splicer.room
        addOrUpdateItem(props.type, newSplicerPower, props.splicerPower.id)
        splicerState.preAppliances = splicer.preAppliances
    }
}

function deleteSplicerPower(): void {
    deleteItem(props.type, props.splicerPower.id)
}

onMounted(() => {
    if (props.splicer.name !== '') {
        splicerValidations.value.$touch()
        splicerPowerValidations.value.$touch()
    }
})

const emit = defineEmits<{
    (e: 'saved'): void
    (e: 'deleted'): void
}>()
</script>
<template>
    <div>
        <BaseForm
            :additional-validations="splicerValidations"
            :additional-data="splicerState"
            :data="splicer"
            :type="type"
            :index="index"
            :save-callback="saveSplicerPower"
            :delete-callback="deleteSplicerPower"
            name-placeholder="E.g. Splicer 1"
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
        >
            <template #additionalFields>
                <CbusDetails
                    v-model:automationBase="splicerValidations.automationBase.$model"
                    v-model:automationGroup="splicerValidations.automationGroup.$model"
                    v-model:automationId="splicerValidations.automationId.$model"
                    class="my-2"
                    :automation-base-validations="splicerValidations.automationBase"
                    :automation-group-validations="splicerValidations.automationGroup"
                    :automation-id-validations="splicerValidations.automationId"
                    @update:automationBase="debounceRetrieveSplicerCbusId"
                    @update:automationGroup="debounceRetrieveSplicerCbusId"
                    @update:automationId="debounceRetrieveSplicerCbusId"
                >
                    <template #title> Splicer Source</template>
                </CbusDetails>
            </template>
            <template #idInput="{ idModel, updateIdModel }">
                <div class="my-2 flex flex-col">
                    <label for="splicerCbusId">Id (automatically generated)</label>
                    <div class="flex-row">
                        <input
                            id="splicerCbusId"
                            disabled
                            :value="idModel < 1000000 ? 'Automatically generated' : idModel"
                            type="number"
                            class="textfield-primary basis-3/4"
                        />
                        <span v-if="fetchingSplicerId" class="basis-1/4 self-center">
                            <Spinner />
                        </span>
                    </div>
                    <button
                        ref="splicerButtonRef"
                        aria-hidden="true"
                        class="hidden-sr"
                        @click="
                            () => {
                                updateIdModel(splicerCbusId)
                            }
                        "
                    ></button>
                </div>
            </template>

            <template #endFields>
                <BaseForm
                    :additional-validations="splicerPowerValidations"
                    :additional-data="splicerPowerState"
                    :data="splicerPower"
                    :type="type"
                    :show-default-fields="false"
                    :index="index"
                    class="p-0 m-0"
                    name-placeholder="E.g. Splicer Power 1"
                >
                    <template #title><span class="hidden"></span></template>
                    <template #defaultFields><span class="hidden"></span></template>
                    <template #buttons><span class="hidden"></span></template>
                    <template #additionalFields>
                        <CbusDetails
                            v-model:automationBase="splicerPowerValidations.automationBase.$model"
                            v-model:automationGroup="splicerPowerValidations.automationGroup.$model"
                            v-model:automationId="splicerPowerValidations.automationId.$model"
                            class="my-2"
                            :automation-base-validations="splicerPowerValidations.automationBase"
                            :automation-group-validations="splicerPowerValidations.automationGroup"
                            :automation-id-validations="splicerPowerValidations.automationId"
                            unique-id-prefix="splicerPower"
                            @update:automationBase="debounceRetrieveSplicerPowerCbusId"
                            @update:automationGroup="debounceRetrieveSplicerPowerCbusId"
                            @update:automationId="debounceRetrieveSplicerPowerCbusId"
                        >
                            <template #title>Splicer Power</template>
                        </CbusDetails>
                    </template>
                    <template #idInput="{ idModel, updateIdModel }">
                        <div class="my-2 flex flex-col">
                            <label for="splicerPowerCbusId">Id (automatically generated)</label>
                            <div class="flex-row">
                                <input
                                    id="splicerPowerCbusId"
                                    disabled
                                    :value="idModel < 1000000 ? 'Automatically generated' : idModel"
                                    type="number"
                                    class="textfield-primary basis-3/4"
                                />

                                <span v-if="fetchingSplicerPowerId" class="basis-1/4 self-center">
                                    <Spinner />
                                </span>
                            </div>
                            <button
                                ref="splicerPowerButtonRef"
                                aria-hidden="true"
                                class="hidden-sr"
                                @click="
                                    () => {
                                        updateIdModel(splicerPowerCbusId)
                                    }
                                "
                            ></button>
                        </div>
                    </template>
                </BaseForm>
            </template>
        </BaseForm>
    </div>
</template>
<style lang=""></style>
