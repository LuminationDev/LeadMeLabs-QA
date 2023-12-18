<script setup lang="ts">
import TextInput from "../../../components/inputs/TextInput.vue";
import { email, required } from "@vuelidate/validators";
import { computed, reactive } from "vue";
import useVuelidate from "@vuelidate/core";
import GenericButton from "../../../components/buttons/GenericButton.vue";
import * as CONSTANT from "../../../assets/constants/index";
import { usePasswordStore } from "../../store/passwordStore";
import PasswordTwoFactor from "./PasswordTwoFactor.vue";

const passwordStore = usePasswordStore();

const rules = {
  email: {
    required,
    email
  },
  password: { required }
}

const state = reactive({
  email: '',
  password: '',
  code: undefined
});

const v$ = useVuelidate(rules, state);

const status = computed(() => {
  return passwordStore.statusLogin
});

async function login(): Promise<void> {
  // @ts-ignore
  await v$.value.$validate()
  // @ts-ignore
  if (v$.value.$invalid) {
    return;
  }

  //Update the status value
  passwordStore.statusLogin = "loading";

  //Attempt to log in to bitwarden api?
  const args = {
    channelType: 'login',
    email: state.email,
    password: state.password
  }

  //Reset before each call
  passwordStore.errorMessage = '';

  //Attempt to log in to bitwarden api?
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.PASSWORD_CHANNEL, args);

  //Wait for a response or error message
  await new Promise<void>((resolve) => {
    const checkValue = () => {
      if (status.value === "") {
        resolve();
      } else {
        setTimeout(checkValue, 300); // Check again after 300 milliseconds
      }
    };

    checkValue();
  });
}
</script>

<template>
  <div class="px-8 w-full">
    <PasswordTwoFactor v-if="passwordStore.awaitingTwoStep"
                       :email="state.email"
                       :password="state.password"/>

    <div v-else class="flex flex-col justify-center w-full">
      <div class="w-full pt-3 pb-2 bg-white flex flex-col">
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
      </div>

      <div class="text-right flex flex-row">
        <GenericButton
            type="primary"
            class="w-32"
            :callback="login"
        >Login</GenericButton>
      </div>

      <div class="flex flex-row justify-center text-sm text-red-400 mt-2" v-if="passwordStore.errorMessage">{{ passwordStore.errorMessage }}</div>
    </div>
  </div>
</template>
