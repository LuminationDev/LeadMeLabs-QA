<script setup lang="ts">
import GenericButton from '@renderer/tool-qa/components/_generic/buttons/GenericButton.vue'
import Modal from "./Modal.vue";
import useVuelidate from "@vuelidate/core";
import TextInput from "@renderer/tool-qa/components/_generic/inputs/TextInput.vue";
import CheckStatus from "@renderer/tool-qa/components/fullCheck/CheckStatus.vue";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { required, email } from "@vuelidate/validators";
import { reactive, ref as vueRef } from "vue";
import { useRouter } from "vue-router";
import { useFullStore} from "@renderer/tool-qa/store/fullStore";

const props = defineProps({
  online: {
    type: Boolean,
    required: false,
    default: true
  },
  callback: {
    type: Function,
    required: false,
  }
})

const fullStore = useFullStore();
const router = useRouter();

const rules = {
  email: {
    required,
    email
  },
  password: { required }
}

const state = reactive({
  email: '',
  password: ''
});

const v$ = useVuelidate(rules, state);
const errorText = vueRef("");
const showModal = vueRef(false);
const firebaseConfig = {
  apiKey: "AIzaSyA5O7Ri4P6nfUX7duZIl19diSuT-wxICRc",
  authDomain: "leadme-labs.firebaseapp.com",
  projectId: "leadme-labs",
  storageBucket: "leadme-labs.appspot.com",
  messagingSenderId: "676443233497",
  appId: "1:676443233497:web:6c5fd1e7f5ec334c3972c8",
  measurementId: "G-VP5XSL3TJR"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();

const checkUserStatus = () => {
  const user = auth.currentUser;
  return !!user;
};

async function login(): Promise<void> {
  // @ts-ignore
  await v$.value.$validate()
  // @ts-ignore
  if (v$.value.$invalid) {
    return;
  }

  signInWithEmailAndPassword(auth, state.email, state.password).then(() => {
    fullStore.online = true;
    closeModal();
    processCallback();
  }).catch((error) => {
    console.log(error);
    errorText.value = "Wrong login details";
  });
}

const noLogin = () => {
  fullStore.online = false;
  closeModal();
  processCallback();
}

const openModal = () => {
  if(checkUserStatus()) {
    processCallback();
  } else {
    showModal.value = true;
  }
}

const closeModal = () => {
  showModal.value = false;
}

/**
 * If the callback is undefined the user is entering the QA check.
 */
const processCallback = () => {
  if (props.callback === undefined) {
    router.push("/check/full/setup/devices/nuc");
  } else {
    props.callback();
  }
}
</script>

<template>
  <!--Anchor button used to control the modal-->
  <div v-if="online"
      class="w-full h-full flex flex-col justify-center items-center cursor-pointer
             rounded-2xl border-2 border-gray-200 hover:bg-gray-50"
      @click="openModal"
  >
    <div class="font-semibold text-base mb-1">
      QA Test
    </div>

    <div class="text-sm text-gray-400">
      Run a Quality Assurance Test
    </div>
  </div>

  <CheckStatus @click="openModal" class="cursor-pointer hover:opacity-70" v-else checking="sign_in"/>

  <Teleport to="body">
    <Modal :show="showModal" @close="closeModal">
      <template v-slot:header>
        <header class="h-12 px-8 w-128 bg-white flex justify-between items-center rounded-t-lg">
          <div class="bg-white flex flex-col">
            <span class="font-semibold text-lg font-medium text-black">Please sign in.</span>
          </div>
        </header>
      </template>

      <template v-slot:content>
        <div class="px-8 w-full pt-3 pb-2 bg-white flex flex-col">
          <TextInput
              ref="emailInputRef"
              v-model="v$.email.$model"
              :v$="v$.email"
              field-id="email"
              class="my-2 w-full"
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
              class="my-2 w-full"
          >
            <template #label>Password</template>
          </TextInput>

          <div v-if="callback === undefined" class="flex justify-end">
            <div class="text-sm text-blue-500 cursor-pointer hover:text-blue-300 my-2 mr-1" @click="noLogin">
              Continue without signing in.
            </div>
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <footer class="mt-4 mb-2 mx-2 flex flex-col">
          <div class="text-right flex flex-row justify-between">
            <GenericButton
                type="primary"
                class="w-32"
                :callback="login"
            >Login</GenericButton>

            <button class="w-24 h-10 text-blue-500 text-base rounded-lg hover:bg-gray-200 font-medium"
                    v-on:click="closeModal"
            >Close</button>
          </div>

          <div class="flex flex-row justify-center text-sm text-red-400 mt-2" v-if="errorText">{{ errorText }}</div>
        </footer>
      </template>
    </Modal>
  </Teleport>
</template>
