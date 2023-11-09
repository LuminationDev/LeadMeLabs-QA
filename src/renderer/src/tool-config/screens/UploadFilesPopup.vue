<script setup lang="ts">
import GenericButton from '../components/GenericButton.vue'
import {initializeApp} from "firebase/app";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {getStorage, ref, uploadString} from "firebase/storage";
import {useLabStore} from "../store/labStore";
import TextInput from "../components/inputs/TextInput.vue";
import { required, email } from "@vuelidate/validators";
import {reactive, ref as vueRef } from "vue";
import useVuelidate from "@vuelidate/core";
const labStore = useLabStore()

defineProps({
    close: {
        type: Function,
        required: true
    }
})

const rules = {
    email: {
        required,
        email
    },
    password: { required },
    siteName: { required }
}
const state = reactive({
    email: '',
    password: '',
    siteName: ''
})
const v$ = useVuelidate(rules, state)


async function uploadFiles(): Promise<void> {
    errorText.value = ""
    await v$.value.$validate()
    if (v$.value.$invalid) {
        return;
    }
    const firebaseConfig = {
        apiKey: "AIzaSyDeXIbE7PvD5b3VMwkQNhWcvzmkEqD1zEQ",
        authDomain: "leadme-labs.firebaseapp.com",
        projectId: "leadme-labs",
        storageBucket: "leadme-labs.appspot.com",
        messagingSenderId: "676443233497",
        appId: "1:676443233497:web:a506ef9ade75d7cc3972c8",
        measurementId: "G-11FJMB18XS"
    };

// Initialize Firebase
    initializeApp(firebaseConfig);
    const auth = getAuth()
    signInWithEmailAndPassword(auth, state.email, state.password).then(() => {
        const storage = getStorage()
        const applianceRef = ref(storage, "config-tool/" + state.siteName + '/appliance_list.json')
        const stationRef = ref(storage, "config-tool/" + state.siteName + '/station_list.json')
        errorText.value = "uploading"
        uploadString(applianceRef, labStore.displayState).then(() => {
            errorText.value = "uploaded"
        })
        uploadString(stationRef, labStore.getStations)
    }).catch((error) => {
        errorText.value = error
    })

}

const errorText = vueRef("")
</script>
<template>
    <Teleport to="body">
        <div
            class="grey-overlay absolute w-screen h-screen bg-gray-400 z-30 opacity-60 top-0 left-0 grid place-content-center"
            @click="() => { close() }"
        ></div>
        <div
            class="popup-content z-50 w-[50vw] h-[60vh] max-w-[550px] max-h-[800px] bg-white rounded-3xl flex flex-col justify-center items-center absolute m-auto top-0 bottom-0 left-0 right-0"
        >
            <TextInput
                ref="emailInputRef"
                v-model="v$.email.$model"
                :v$="v$.email"
                field-id="email"
                class="my-2"
                placeholder="example@example.com"
            >
                <template #label>Email</template>
            </TextInput>
            <TextInput
                ref="passwordInputRef"
                v-model="v$.password.$model"
                :v$="v$.password"
                field-id="password"
                placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                :password="true"
                class="my-2"
            >
                <template #label>Password</template>
            </TextInput>
            <TextInput
                ref="siteNameInputRef"
                v-model="v$.siteName.$model"
                :v$="v$.siteName"
                field-id="siteName"
                class="my-2"
                placeholder="Thebarton"
            >
                <template #label>Site Name</template>
            </TextInput>
            <GenericButton
                type="primary"
                class="w-56"
                :callback="uploadFiles"
            >Upload Files
            </GenericButton>
            <div v-if="errorText">{{ errorText }}</div>
        </div>
    </Teleport>
</template>
