<script setup lang="ts">
import TextInput from "../../../components/inputs/TextInput.vue";
import { required } from "@vuelidate/validators";
import {computed, reactive} from "vue";
import useVuelidate from "@vuelidate/core";
import GenericButton from "../../../components/buttons/GenericButton.vue";
import * as CONSTANT from "../../../assets/constants/index";
import { usePasswordStore } from "../../store/passwordStore";

const passwordStore = usePasswordStore();

const props = defineProps({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

const rules = {
  code: { required }
}

const state = reactive({
  code: ""
});

const v$ = useVuelidate(rules, state);

const status = computed(() => {
  return passwordStore.statusTwoFactor
});

async function loginWithCode(): Promise<void> {
  // @ts-ignore
  await v$.value.$validate()
  // @ts-ignore
  if (v$.value.$invalid) {
    return;
  }

  //Reset before each call
  passwordStore.errorMessage = '';

  //Update the status value
  passwordStore.statusTwoFactor = "loading";

  //Attempt to log in to bitwarden api?
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.PASSWORD_CHANNEL, {
    channelType: 'login',
    email: props.email,
    password: props.password,
    code: state.code
  });

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
  <div class="px-8 w-full flex flex-col items-center justify-center">
    <div v-if="passwordStore.validSession">
      SESSION IS VALID
    </div>

    <div v-else class="w-full pt-3 pb-2 bg-white flex flex-col">
      <div class="w-full flex flex-col">
        <TextInput
            ref="twoInputRef"
            v-model="v$.code.$model"
            :v$="v$.code"
            field-id="text"
            class="my-2 w-full"
            placeholder="123456"
        >
          <template #label>Two-factor Authorisation Code</template>
        </TextInput>
      </div>

      <div class="text-right flex flex-row">
        <GenericButton
            type="primary"
            class="w-32"
            :callback="loginWithCode"
        >Confirm</GenericButton>
      </div>

      <div class="flex flex-row justify-center text-sm text-red-400 mt-2" v-if="passwordStore.errorMessage">{{ passwordStore.errorMessage }}</div>
    </div>
  </div>
</template>
