<script setup lang="ts">
import { onBeforeMount, onMounted, onUnmounted, reactive, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { PanasonicProjector, PanasonicSource} from '../../models'
import { useOptionalValidations } from '../../../composables/requiredOptional'
import { helpers, ipAddress, required } from '@vuelidate/validators'
import { debounce } from 'lodash'
import * as PANASONIC from '../constants/_panasonic_codes'
import BaseForm from './BaseForm.vue'
import TextInput from '../inputs/TextInput.vue'
import SourceOptions from '../sources/SourceOptions.vue'
import PanasonicStatus from './PanasonicStatus.vue'
import { useLabStore } from '../../store/labStore'
import { storeToRefs } from 'pinia'

const { requiredOptional } = useOptionalValidations()
const props = defineProps({
    data: {
        type: [PanasonicProjector, PanasonicSource],
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
    state.username = props.data.username
    state.password = props.data.password
    state.options = props.data.options
    state.automationType = props.data.automationType
})
const panasonicProjectorStatus = ref<number | null>(null)
const panasonicSourceStatus = ref<string | null>(null)

onMounted(async () => {
  //@ts-ignore
  window.api.ipcRenderer.on('panasonic_status_update', async (_event, data) => {
    console.log(data);
    if (data.type === 'details') {

      //The username and password are correct, store the encrypted details in the labStore for saving
      labStore.encryptedUsername = data.username;
      labStore.encryptedPassword = data.password;
    }
    else if (data.type === 'projectors') {
      panasonicProjectorStatus.value = data.value
      if (data.value == 255) {
        setTimeout(async () => {
          await getSourceStatus()
        }, 500)
      }
    } else if (data.type === 'sources') {
      panasonicSourceStatus.value = data.value
    } else if (data.type === 'ERR') {
      panasonicProjectorStatus.value = data.value
      panasonicSourceStatus.value = data.value
    }
  })
  if (state.ipAddress && props.data.name) {
    await getProjectorStatus()
  }
})

onUnmounted(async () => {
    //@ts-ignore
    window.api.ipcRenderer.removeAllListeners('panasonic_status_update')
})

async function getProjectorStatus(): Promise<any> {
  //@ts-ignore
  await window.configApi.sendCommandTcpPanasonic(state.ipAddress, 1024, state.username, state.password, props.data.name, PANASONIC.CHECK_POWER)
}

async function getSourceStatus(): Promise<any> {
  //@ts-ignore
  await window.configApi.sendCommandTcpPanasonic(state.ipAddress, 1024, state.username, state.password, props.data.name, PANASONIC.CHECK_SOURCE)
}

interface State {
  username: string
  password: string
  ipAddress?: string
  automationType?: string
  options: Array<any>
}

const state: State = reactive({
  username: '',
  password: '',
  ipAddress: '',
  automationType: '',
  options: []
})

const mustHaveOptions = (value: any): boolean => Object.keys(value).length > 0

const rules = {
  username: { required },
  password: { required },
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
                    panasonicProjectorStatus.value = null
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
                        v-model="v$.username.$model"
                        :v$="v$.username"
                        field-id="username"
                        class="my-2"
                        placeholder="Username"
                    >
                        <template #label>Username</template>
                    </TextInput>

                    <TextInput
                        v-model="v$.password.$model"
                        :v$="v$.password"
                        field-id="password"
                        class="my-2"
                        placeholder="***********"
                    >
                      <template #label>Password</template>
                    </TextInput>

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
                        :projector-type="'panasonic'"
                        :model-value="state.options"
                        :v$="v$.options"
                        @update-option="saveOption"
                    />
                </div>
                <PanasonicStatus
                    :name="props.data.name"
                    :projector-status="panasonicProjectorStatus != null ? panasonicProjectorStatus : -1"
                    :source-status="panasonicSourceStatus != null ? panasonicSourceStatus : '-1'"
                    :source-list="state.options"
                    :get-source-status="getSourceStatus"
                    :ip-address="state.ipAddress"
                    :username="state.username"
                    :password="state.password"
                >
                </PanasonicStatus>
            </template>
        </BaseForm>
    </div>
</template>
