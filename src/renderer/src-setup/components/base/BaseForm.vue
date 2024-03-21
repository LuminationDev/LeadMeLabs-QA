<script setup lang="ts">
import { useLabStore } from '../../store/labStore'
import { ref, onBeforeMount, onBeforeUnmount, computed, reactive, onMounted } from 'vue'
import { isEqual } from 'lodash'
import useVuelidate from '@vuelidate/core'
import { required, minLength, requiredIf } from '@vuelidate/validators'
import {
  Light,
  Blind,
  EpsonProjector,
  Station,
  Splicer,
  LedRing,
  PanasonicProjector,
  PanasonicSource, EpsonSource
} from '../../models'
import TextInput from '../inputs/TextInput.vue'
import { storeToRefs } from 'pinia'
import NumberInput from '../inputs/NumberInput.vue'
import Dropdown from '../selector/Dropdown.vue'
import AdvancedOptions from './AdvancedOptions.vue'
import {useChecklistStore} from "../../store/checklistStore";

const labStore = useLabStore()
const { rooms, fetchingId } = storeToRefs(labStore)
const { trimEmptyData, addOrUpdateItem, deleteItem } = labStore

const props = defineProps({
    data: {
        type: [Light, Blind, LedRing, Splicer, EpsonProjector, EpsonSource, PanasonicProjector, PanasonicSource, Station],
        required: true
    },
    type: {
        type: String,
        required: true
    },
    additionalValidations: {
        type: Object,
        required: false
    },
    additionalData: {
        type: Object,
        required: false
    },
    saveCallback: {
        type: Function,
        required: false,
        default: () => {}
    },
    deleteCallback: {
        type: Function,
        required: false,
        default: () => {}
    },
    showDefaultFields: {
        type: Boolean,
        default: true,
        required: false
    },
    namePlaceholder: {
        type: String,
        required: true
    }
})

const previousId = ref(0)
const nameInputRef = ref<InstanceType<typeof HTMLButtonElement> | null>(null)

onBeforeMount(() => {
    state.name = props.data.name
    state.id = props.data.id
    state.room = props.data.room
    if (props.type !== 'stations') {
        previousId.value = +props.data.id
    } else {
        previousId.value = props.data.id
    }
    // @ts-ignore undefined as we may not want to save it against the object TODO - fix this
    state.displayType = props.data.displayType
    // @ts-ignore undefined as we may not want to save it against the object TODO - fix this
    state.hidden = props.data.hidden
})

onBeforeUnmount(() => {
    trimEmptyData()
})
onMounted(() => {
    if (props.showDefaultFields) {
        if (nameInputRef.value !== null) {
            nameInputRef.value.focus()
        }
    }
})

const dataModified = computed(() => {
    // get rid of options field inside projector
    const tempAdditionalData = Object.assign({}, props.additionalData)
    if (tempAdditionalData['options'] === undefined || tempAdditionalData['options'].length === 0) {
        delete tempAdditionalData['options']
    }
    if (tempAdditionalData['labels'] === undefined || tempAdditionalData['labels'].length === 0) {
        delete tempAdditionalData['labels']
    }
    return !isEqual({ ...state, ...tempAdditionalData }, JSON.parse(JSON.stringify(props.data)))
})

const rules = {
    id: {
        required
    },
    name: { required, minLength: minLength(3) },
    room: { required: requiredIf(props.showDefaultFields) }
}
const state = reactive({
    id: 0,
    name: '',
    room: '',
    displayType: undefined,
    hidden: undefined
})
const v$ = useVuelidate(rules, state)

async function save(): Promise<void> {
    await v$.value.$validate()
    if (props.additionalValidations) {
        await props.additionalValidations.$validate()
    }
    if (
        v$.value.$invalid ||
        (props.additionalValidations && props.additionalValidations.$invalid)
    ) {
        // invalid
        props.saveCallback(null, false)
        return
    } else {
        const newObject = { ...{automationBase: 0, automationGroup: 0, automationId: 0 }, ...state, ...props.additionalData }
        if (
            newObject['labels'] === null ||
            (newObject['labels'] && Object.keys(newObject['labels']).length === 0)
        ) {
            delete newObject['labels']
        }
        /**
         * Intercept save to check if Cbus Id refetch it required
         */
        if (
            newObject.automationBase !== undefined &&
            newObject.automationGroup &&
            newObject.automationId
        ) {
            if (useChecklistStore().getCbusStatus) {
                fetchingId.value = true
                const idAndStatusObject = await window.configApi.getApplianceIdAndStatus(
                    newObject.automationBase,
                    newObject.automationGroup,
                    newObject.automationId
                )
                const id = Number(idAndStatusObject?.id)
                if (id > 0) {
                    console.log('re-fetch id on the fly. got ' + id)
                    newObject.id = id
                }
                fetchingId.value = false
            }
        }
        /**
         * Intercept Mac Address formatting before saving
         * only work for baseStationForm
         * ToDo: Move to baseStation Form
         */
        //@ts-ignore for epson appliances, it will contain ipAddress
        if (newObject.mac_address) {
            let desiredMac
            //@ts-ignore same reason as previous line
            const inputMacAddress = newObject.mac_address
            if (inputMacAddress.length > 12) {
                // has seperator
                const sepChar = inputMacAddress.split('')[2]
                const arrayMac = inputMacAddress.split(sepChar)
                desiredMac = arrayMac.join('-')
            } else {
                const arrayMac = inputMacAddress.match(/.{1,2}/g)
                desiredMac = arrayMac.join('-')
            }
            //@ts-ignore same reason as beginning of the block
            newObject.mac_address = desiredMac
        }

        if (props.type === 'ledRings') {
            // @ts-ignore handle this more elegantly, we need this here as otherwise this value gets erased in the save step and causes the appliances not to load on the tablet
            newObject.associatedStation = props.data.associatedStation
        }

        addOrUpdateItem(props.type, newObject, previousId.value)

        if (props.type !== 'stations') {
            previousId.value = +state.id
        } else {
            previousId.value = Number(state.id.toString())
        }
        await props.saveCallback(newObject, true)
        emit('saved')
    }
}

function handleAdvancedOptions(displayType: string, hidden: string): void {
    // @ts-ignore undefined as we may not want to save it against the object TODO - fix this
    state.displayType = displayType
    // @ts-ignore undefined as we may not want to save it against the object TODO - fix this
    state.hidden = hidden
}

function updateIdModel(value): void {
    v$.value.id.$model = value
}

function remove(): void {
    deleteItem(props.type, previousId.value)
    props.deleteCallback()
    emit('deleted')
}

function close(): void {
    emit('deleted')
}

const roomOptions = computed(() => {
    return rooms.value.map((room) => {
        return {
            id: room.name,
            name: room.name
        }
    })
})

const emit = defineEmits<{
    (e: 'saved'): void
    (e: 'deleted'): void
    (e: 'roomChanged', newRoom: string): void
}>()
</script>
<template>
    <div class="item-form w-full flex flex-col p-2 m-2">
        <slot name="title" />
        <div v-if="showDefaultFields" class="item-form flex flex-col">
            <TextInput
                ref="nameInputRef"
                v-model="v$.name.$model"
                :v$="v$.name"
                field-id="applianceName"
                class="my-2"
                :placeholder="namePlaceholder"
            >
                <template #label>Name</template>
            </TextInput>

            <Dropdown
                v-model="v$.room.$model"
                :v$="v$.room"
                name="room"
                :data="roomOptions"
                @change="() => { $emit('roomChanged', v$.room.$model) }"
                field-id="itemRoom"
                class="my-2"
                placeholder="Please pick a room"
            >
                <template #label>
                    <label class="mt-2 mb-1"> Which room does it belong to?</label>
                </template>
            </Dropdown>
        </div>

        <slot name="additionalFields"></slot>
        <slot
            name="idInput"
            :id-model="v$.id.$model"
            :update-id-model="updateIdModel"
            :validations="v$.id"
        >
            <NumberInput
                v-model="v$.id.$model"
                :v$="v$.id"
                :disabled="true"
                field-id="applianceId"
                class="basis-3/4 my-2"
            >
                <template #label>Id (automatically generated)</template>
            </NumberInput>
        </slot>
        <slot name="endFields"></slot>
        <div v-if="!(data instanceof Station) && props.showDefaultFields" class="w-full">
            <AdvancedOptions
                :data="props.data"
                @advance-options-input="handleAdvancedOptions"
            ></AdvancedOptions>
        </div>

        <!-- Action buttons -->
        <slot name="buttons">
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
        </slot>
    </div>
</template>
<style lang=""></style>
`
