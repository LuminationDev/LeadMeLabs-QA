<script setup lang="ts">
import GenericButton from '@renderer/components/buttons/GenericButton.vue'
import useVuelidate from "@vuelidate/core";
import TextInput from "@renderer/components/inputs/TextInput.vue";
import { getAuth } from "firebase/auth";
import { required, email } from "@vuelidate/validators";
import { reactive, ref as vueRef } from "vue";
import { useRouter } from "vue-router";
import Modal from "../../modals/Modal.vue";
import CircleSpinner from "../../components/loading/CircleSpinner.vue";

const emit = defineEmits<{
  (e: 'success', email: string, siteName: string): void
}>()

defineProps({
  uploading: {
    type: Boolean,
    required: true
  }
})

useRouter();

const rules = {
  email: {
    required,
    email
  },
  siteName: { required }
}

const state = reactive({
  email: '',
  siteName: ''
});

const v$ = useVuelidate(rules, state);
const errorText = vueRef("");
const showModal = vueRef(false);
getAuth();

async function login(): Promise<void> {
  // @ts-ignore
  await v$.value.$validate()
  // @ts-ignore
  if (v$.value.$invalid) {
    return;
  }
  emit('success', state.email, state.siteName)
  closeModal()
}

const openModal = () => {
  showModal.value = true;
}

const closeModal = () => {
  showModal.value = false;
}
</script>

<template>
  <!--Anchor button used to control the modal-->
  <div v-if="!uploading"
       class="w-full flex flex-col justify-center items-center cursor-pointer h-10 ml-2"
       @click="openModal"
  >
    <div class="text-white bg-blue-600 disabled:bg-blue-200 hover:bg-blue-400 py-2 px-4 rounded-lg flex justify-center">
      <img src="../../assets/icons/sendIcon.svg" class="mr-2" />Send
    </div>
  </div>

  <div v-else
       class="w-full flex flex-col justify-center items-center cursor-pointer h-10 ml-2"
  >
    <div class="text-white bg-blue-600 disabled:bg-blue-200 hover:bg-blue-400 py-2 px-4 rounded-lg flex justify-center items-center">
      <CircleSpinner class="mr-4"/>Uploading
    </div>
  </div>

  <Teleport to="body">
    <Modal :show="showModal" @close="closeModal">
      <template v-slot:header>
        <header class="h-12 px-8 w-128 bg-white flex justify-between items-center rounded-t-lg">
          <div class="bg-white flex flex-col">
            <span class="font-semibold text-lg font-medium text-black">Upload Details</span>
          </div>
        </header>
      </template>

      <template v-slot:content>
        <div class="px-8 w-full pt-3 pb-2 flex flex-col">
          <TextInput
              v-model="v$.email.$model"
              :v$="v$.email"
              field-id="email"
              class="my-2 w-full"
              placeholder="example@example.com"
          >
            <template #label>Email</template>
          </TextInput>
          <TextInput
              v-model="v$.siteName.$model"
              :v$="v$.siteName"
              field-id="siteName"
              placeholder="Site Name"
              class="my-2 w-full"
          >
            <template #label>Site Name</template>
          </TextInput>
        </div>
      </template>

      <template v-slot:footer>
        <footer class="pt-4 pb-2 px-2 flex flex-col bg-white rounded-b-xl">
          <div class="flex flex-row justify-between">

            <button class="w-24 h-10 text-blue-500 text-base rounded-lg hover:bg-gray-200 font-medium"
                    v-on:click="closeModal"
            >Close</button>

            <GenericButton
                type="light-blue"
                class="w-32"
                :callback="login"
            >Upload</GenericButton>
          </div>

          <div class="flex flex-row justify-center text-sm text-red-400 mt-2" v-if="errorText">{{ errorText }}</div>
        </footer>
      </template>
    </Modal>
  </Teleport>
</template>
