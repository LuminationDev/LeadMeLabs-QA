<script setup lang="ts">
import { onBeforeMount, onMounted, onUnmounted, reactive, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { EpsonProjector, EpsonSource } from '../../models'
import { useOptionalValidations } from '../../../composables/requiredOptional'
import { helpers, ipAddress } from '@vuelidate/validators'
import { debounce } from 'lodash'

import * as EPSON from '../constants/_epson_codes'
import BaseForm from './BaseForm.vue'
import TextInput from '../inputs/TextInput.vue'
import SourceOptions from '../sources/SourceOptions.vue'
import EpsonStatus from './EpsonStatus.vue'
import { useLabStore } from '../../store/labStore'
import { storeToRefs } from 'pinia'

const { requiredOptional } = useOptionalValidations()

const props = defineProps({
    data: {
        type: [EpsonProjector, EpsonSource],
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
const { fetchingId } = storeToRefs(labStore)

onBeforeMount(() => {
    state.ipAddress = props.data.ipAddress
    state.options = props.data.options
    state.automationType = props.data.automationType
})
const epsonProjectorStatus = ref<number | null>(null)
const epsonSourceStatus = ref<string | null>(null)

onMounted(async () => {
    //@ts-ignore
    window.api.ipcRenderer.on('epson_status_update', async (_event, data) => {
        if (data.type === 'projectors') {
            epsonProjectorStatus.value = data.value
            if (data.value == 255) {
                setTimeout(async () => {
                    await getSourceStatus()
                }, 500)
            }
        } else if (data.type === 'sources') {
            epsonSourceStatus.value = data.value
        } else if (data.type === 'ERR') {
            epsonProjectorStatus.value = data.value
            epsonSourceStatus.value = data.value
        }
    })
    if (state.ipAddress && props.data.name) {
        await getProjectorStatus()
    }
})

onUnmounted(async () => {
  //@ts-ignore
  window.api.ipcRenderer.removeAllListeners('epson_status_update')
})

async function getProjectorStatus(): Promise<any> {
    //@ts-ignore
    await window.configApi.sendCommandTcpEpson(state.ipAddress, 3629, props.data.name, EPSON.CHECK_POWER)
}

async function getSourceStatus(): Promise<any> {
    //@ts-ignore
    await window.configApi.sendCommandTcpEpson(state.ipAddress, 3629, props.data.name, EPSON.CHECK_SOURCE)
}

interface State {
    ipAddress?: string
    automationType?: string
    options: Array<any>
}

const state: State = reactive({
    ipAddress: '',
    automationType: '',
    options: []
})

const mustHaveOptions = (value: any): boolean => Object.keys(value).length > 0

const rules = {
    ipAddress: { requiredOptional, ipAddress },
    options: {
        mustHaveOptions: helpers.withMessage('You must select at least one option', mustHaveOptions)
    }
}

function saveOption(emittedOptions): void {
    state.options = emittedOptions
}

//@ts-ignore incompatible type
const v$ = useVuelidate(rules, state)

const debounceGetProjectorAndSourceStatus = debounce(async () => {
    //@ts-ignore vuelidate typescript
    if (state.ipAddress && !v$.$invalid) {
        fetchingId.value = true
        try {
            await getProjectorStatus()
                .then((res) => {
                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)
                    epsonProjectorStatus.value = null
                })
        } catch (e) {
            console.error(e)
        } finally {
            fetchingId.value = false
        }
    }
}, 1000)

onMounted(() => {
    if (props.data.name !== '') {
        //@ts-ignore vuelidate typescript
        v$.value.$touch()
    }
})

const emit = defineEmits<{
    (e: 'saved'): void
    (e: 'deleted'): void
}>()
</script>

<template>
    <div class="">
        <BaseForm
            :additional-validations="v$"
            :additional-data="state"
            :data="data"
            :type="type"
            :index="index"
            name-placeholder="E.g. Projector 1"
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
                <div class="pt-0 mt-0 flex-col">
                    <TextInput
                        v-model="v$.ipAddress.$model"
                        :v$="v$.ipAddress"
                        field-id="ipAddress"
                        class="my-2"
                        placeholder="192.168.123.456"
                        @input-update="debounceGetProjectorAndSourceStatus"
                    >
                        <template #label> Ip Address</template>
                    </TextInput>
                    <!--                <div v-if="options.valueOf.length > 0">-->
                    <SourceOptions
                        class="my-4"
                        :projector-type="'epson'"
                        :model-value="state.options"
                        :v$="v$.options"
                        @update-option="saveOption"
                    />
                </div>
                <EpsonStatus
                    :name="props.data.name"
                    :projector-status="epsonProjectorStatus != null ? epsonProjectorStatus : -1"
                    :source-status="epsonSourceStatus != null ? epsonSourceStatus : '-1'"
                    :source-list="state.options"
                    :get-source-status="getSourceStatus"
                    :ip-address="state.ipAddress"
                >
                </EpsonStatus>
            </template>
        </BaseForm>
    </div>
</template>
