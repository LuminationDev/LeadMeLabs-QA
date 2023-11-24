<script setup lang="ts">
import { onBeforeMount, onMounted, reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { ipAddress, required } from '@vuelidate/validators'
import TextInput from '../components/inputs/TextInput.vue'
import GenericButton from '../components/GenericButton.vue'
import { useConfigStore } from '../store/configStore'
import { storeToRefs } from 'pinia'
import { useChecklistStore } from '../store/checklistStore'
import tick from '../../assets/icons/tick.svg'
import warning from '../../assets/icons/warning.svg'
import error from '../../assets/icons/error.svg'

const configStore = useConfigStore()
const { setCbusStatus, setSystemMessage } = configStore

const checklistStore = useChecklistStore()
const { incrementPageVisitCount } = checklistStore
const {
    handoverDocument,
    anythingElse,
    networkAccess,
    setupCbus,
    cbusIpAndCreds,
    pageVisitCount,
    attemptConnectCbus
} = storeToRefs(checklistStore)

const state = reactive({
    inputIpAddress: '',
    inputCreds: ''
})
onBeforeMount(async () => {
    if (!setupCbus.value) {
        const cbusInfo: { CbusIP: string; CbusLogin: string } = await window.configApi.getCbusEnv()
        v$.value.inputIpAddress.$model = cbusInfo.CbusIP ? cbusInfo.CbusIP : '192.168.'
        v$.value.inputCreds.$model = cbusInfo.CbusLogin ? cbusInfo.CbusLogin : 'admin:'
        if (cbusInfo.CbusIP && cbusInfo.CbusLogin) {
            await setCbus()
        }
    }
})
const rules = {
    inputIpAddress: {
        required,
        ipAddress: ipAddress
    },
    inputCreds: {
        required
    }
}

const v$ = useVuelidate(rules, state)

async function setCbus(): Promise<void> {
    console.log('setting cbus ip to ' + state.inputIpAddress)
    attemptConnectCbus.value = true
    // @ts-ignore typescript can't find window.api TODO
    const response = await window.configApi.setCbus(state.inputCreds, state.inputIpAddress)
    pageVisitCount.value++
    console.log(typeof response)
    if (response) {
        setCbusStatus('Connected')
        setSystemMessage('Successfully connected Cbus')
        setupCbus.value = true
    } else {
        setupCbus.value = false
        setCbusStatus('Failed')
        configStore.setErrorMessage('Failed to connect to Cbus')
    }
}

onMounted(async () => {
    incrementPageVisitCount()
})
</script>
<template>
    <div class="w-full flex-col">
        <div class="flex flex-col w-full justify-center mb-5 mt-5 h-12 flex-shrink-0">
            <div class="flex flex-row justify-between items-center">
                <h1 class="font-bold text-xl">Checklist</h1>
            </div>
        </div>
        <div class="w-full flex-col border-t-gray-100 border-t-2">
            <p class="mt-10">Before we start, have you got...</p>
            <div class="checklist mt-4 flex flex-col">
                <div class="py-2">
                    <input
                        id="handover"
                        v-model="handoverDocument"
                        type="checkbox"
                        value="handover-document"
                        class="w-6 h-6"
                    />
                    <label for="handover" class="ml-2"> Handover Document</label>
                </div>
                <div class="py-2">
                    <input
                        id="network"
                        v-model="networkAccess"
                        type="checkbox"
                        value="additional"
                        class="w-6 h-6"
                    />
                    <label for="network" class="ml-2"> Network Access (if on site)</label>
                </div>
                <div class="py-2">
                    <input
                        id="anythingElse"
                        v-model="anythingElse"
                        type="checkbox"
                        value="anything-else"
                        class="w-6 h-6"
                    />
                    <label for="anythingElse" class="ml-2"> Anything else you might need</label>
                </div>
                <div class="py-2">
                    <input
                        id="cbusIpAndCreds"
                        v-model="cbusIpAndCreds"
                        type="checkbox"
                        value="cbus-ip-and-creds"
                        class="w-6 h-6"
                    />
                    <label for="cbusIpAndCreds" class="ml-2"> C-Bus IP and Creds</label>
                </div>
                <div
                    v-if="
                        !checklistStore.getChecklistCompletedStatus &&
                        checklistStore.getPageVisitCount > 1
                    "
                    class="flex-row items-center"
                >
                    <img
                        class="w-6 h-6 stroke-inactive fill-inactive shrink-0 max-w-none mr-2"
                        :src="warning"
                        alt="warning icon"
                    />
                    <span class="text-orange-500 text-xs"
                        >Checklist need to be completed when setting up lab onsite</span
                    >
                </div>

                <div v-if="cbusIpAndCreds" class="w-full mt-4">
                    <div class="flex-col">
                        <div class="flex flex-row mb-2 items-center"></div>
                        <TextInput
                            id="ipaddress-input"
                            v-model="v$.inputIpAddress.$model"
                            :v$="v$.inputIpAddress"
                            field-id="Cbus_IpAddress"
                            placeholder="192.168.123.456"
                        >
                            <template #label>Cbus IP</template>
                        </TextInput>
                        <TextInput
                            id="creds-input"
                            v-model="v$.inputCreds.$model"
                            :v$="v$.inputCreds"
                            field-id="Cbus_Creds"
                            placeholder="username:password"
                        >
                            <template #label>Cbus Credentials</template>
                        </TextInput>
                        <GenericButton
                            class="h-fit p-2 justify-self-center mt-5"
                            type="primary"
                            :callback="setCbus"
                            :disabled="v$.inputIpAddress.$invalid"
                            >Set Cbus Info
                        </GenericButton>
                        <div
                            v-if="
                                !checklistStore.setupCbus &&
                                checklistStore.cbusIpAndCreds &&
                                checklistStore.getPageVisitCount > 1 &&
                                !attemptConnectCbus
                            "
                            class="flex-row items-center"
                        >
                            <img
                                class="w-6 h-6 stroke-inactive fill-inactive shrink-0 max-w-none mr-2"
                                :src="warning"
                                alt="warning icon"
                            />
                            <span class="text-orange-500 text-xs"
                                >CBus must be set when setting up lab onsite</span
                            >
                        </div>
                        <div
                            v-if="setupCbus"
                            class="flex flex-row bg-white rounded-full ml-4 drop-shadow-xl connected-shadow p-1"
                        >
                            <img
                                class="w-6 h-6 stroke-inactive fill-inactive shrink-0 max-w-none mr-2"
                                :src="tick"
                                alt="tick icon"
                            />
                            Connected
                        </div>
                        <div
                            v-else-if="!setupCbus && attemptConnectCbus"
                            class="flex flex-row bg-white rounded-full drop-shadow-xl connected-shadow p-1"
                        >
                            <img
                                class="w-6 h-6 stroke-inactive fill-inactive shrink-0 max-w-none mr-2"
                                :src="error"
                                alt="icon indicating failure"
                            />
                            Not connected
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.connected-shadow {
    box-shadow: 0px 5px 6px 0px rgba(0, 0, 0, 0.2);
}
</style>
