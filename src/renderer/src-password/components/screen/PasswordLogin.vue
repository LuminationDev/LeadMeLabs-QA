<script setup lang="ts">
import TextInput from "../../../components/inputs/TextInput.vue";
import { email, required } from "@vuelidate/validators";
import { reactive, ref as vueRef} from "vue";
import useVuelidate from "@vuelidate/core";
import GenericButton from "../../../components/buttons/GenericButton.vue";

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

async function login(): Promise<void> {
  // @ts-ignore
  await v$.value.$validate()
  // @ts-ignore
  if (v$.value.$invalid) {
    return;
  }

  //Attempt to login to bitwarden api?
}
</script>

<template>
  <div class="px-8 flex flex-col justify-center w-full">
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

    <div class="flex flex-row justify-center text-sm text-red-400 mt-2" v-if="errorText">{{ errorText }}</div>
  </div>
</template>
