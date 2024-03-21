<script setup lang="ts">
import { onBeforeMount, computed, reactive, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { Station } from '../../models'
import BaseForm from './BaseForm.vue'
import TextInput from '../inputs/TextInput.vue'
import Dropdown from '../selector/Dropdown.vue'
import { useLabStore } from '../../store/labStore'
import { storeToRefs } from 'pinia'
import { useOptionalValidations } from '../../../composables/requiredOptional'
import {helpers, ipAddress, required} from '@vuelidate/validators'
import warning from '../../../assets/icons/warning.svg'

const { requiredOptional } = useOptionalValidations()

const props = defineProps({
    data: {
        type: [Station],
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

const labStore = useLabStore()

const { ledRings } = storeToRefs(labStore)

onBeforeMount(() => {
    state.ip_address = props.data.ip_address
    state.led_ring_id = props.data.led_ring_id
    state.mac_address = props.data.mac_address
    state.mode = props.data.mode
    state.port = String(props.data.port)
    state.theatre_id = Number(props.data.theatre_id)
    state.theatre_lead = Boolean(props.data.theatre_lead)
})

const state = reactive({
    ip_address: '',
    led_ring_id: 0,
    mac_address: '',
    port: '',
    mode: '',
    theatre_id: 0,
    theatre_lead: false
})

const led_ring_list = computed(() => {
    return ledRings.value.map((ledRing) => {
        return {
            id: ledRing.automationId,
            name: ledRing.name
        }
    })
})

const stationModeOptions = [
  {
    id: 'VR',
    name: 'VR',
  },
  {
    id: 'Content',
    name: 'Content',
  }
]

const warningDuplicateUseLedRing = computed(() => {
    if (state.led_ring_id === props.data.led_ring_id) return false
    if (
        labStore.getListOfUsedLedRingId.filter((usedId) => usedId == state.led_ring_id).length > 0
    ) {
        return true
    }
    return false
})
const customMacAddressValidator = (value): boolean => {
    if (!value) {
        return true
    }
    const regex = /^(?:[0-9A-Fa-f]{2}([-:\s.]?))(?:[0-9A-Fa-f]{2}\1){4}[0-9A-Fa-f]{2}$/g
    if (!regex.test(value)) {
        // return helpers.error("This is not a valid Mac Address. Please use either '-' or ':'")
        return false
    }
    return true
}

const rules = {
    ip_address: { requiredOptional, ipAddress },
    mode: { required: required },
    mac_address: {
        requiredOptional,
        mac_address: helpers.withMessage(
            'Invalid Mac address. Accepted Separators are "space" "_" "." ":" "-"',
            customMacAddressValidator
        )
    },
    led_ring_id: {
        requiredOptional
    }
}

const v$ = useVuelidate(rules, state)

onMounted(() => {
    if (props.data.name !== '') {
        v$.value.$touch()
    }
})

const emit = defineEmits<{
    (e: 'saved'): void
    (e: 'deleted'): void
}>()

/**
 *  Callback for StationForm after executing save,
 *  Add / replace associatedStation field inside LED Rings with the station's id
 */
const saveCallbackAssociatedStation = (): void => {
    if (state.led_ring_id !== undefined) {
        ledRings.value
            .filter((el) => el.automationId == state.led_ring_id)
            .map((el) => (el.associatedStation = props.data.id))
    }
}

/**
 * delete callback when saving a station
 * look for LED rings with the field associatedStation == station.id
 * replace with zero
 */
const deleteCallbackAssociatedStation = (): void => {
    ledRings.value
        .filter((el) => el.associatedStation == props.data.id)
        .map((el) => (el.associatedStation = 0))
}
</script>

<template>
    <div>
        <BaseForm
            :additional-data="state"
            :additional-validations="v$"
            :data="data"
            :type="type"
            :index="index"
            :save-callback="saveCallbackAssociatedStation"
            :delete-callback="deleteCallbackAssociatedStation"
            name-placeholder="E.g. Station 1"
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
                <div class="flex flex-col">
                    <TextInput
                        v-model="v$.ip_address.$model"
                        class="my-2"
                        field-id="ip_address"
                        :v$="v$.ip_address"
                        placeholder="192.168.1.1"
                    >
                        <template #label> IP Address</template>
                    </TextInput>
                    <TextInput
                        v-model="v$.mac_address.$model"
                        class="my-2"
                        field-id="mac_address"
                        :v$="v$.mac_address"
                        placeholder="AB:CD:EF:GH:IJ:KL"
                    >
                        <template #label> Mac Address</template>
                    </TextInput>
                    <Dropdown
                        v-model="v$.led_ring_id.$model"
                        class="my-2"
                        :v$="v$.led_ring_id"
                        :data="led_ring_list"
                        data-type="number"
                        name="led_ring_id"
                        field-id="LEDRingID"
                        placeholder="Pick a LED Ring"
                        label-text="LED Ring"
                    >
                    </Dropdown>
                    <div v-if="warningDuplicateUseLedRing" class="flex flex-row mt-2 items-center">
                        <img
                            class="w-6 h-6 stroke-inactive fill-inactive shrink-0 max-w-none mr-1"
                            :src="warning"
                            alt="warning icon"
                        />
                        <span class="text-orange-500 text-xs"
                            >This ID has been taken by other station. Are you sure to use the same
                            LED Ring?</span
                        >
                    </div>
                    <Dropdown
                        v-model="v$.mode.$model"
                        class="my-2"
                        :v$="v$.mode"
                        :data="stationModeOptions"
                        name="mode"
                        field-id="mode"
                        placeholder="Pick a mode"
                        label-text="Mode"
                    >
                    </Dropdown>
                </div>
            </template>
        </BaseForm>
    </div>
</template>
