<script setup lang="ts">
import * as CONSTANT from "../../assets/constants/index";
import GenericButton from "../../components/buttons/GenericButton.vue";
import { computed } from "vue";
import { usePasswordStore } from "../store/passwordStore";
import { useRouter } from "vue-router";

const router = useRouter();
const passwordStore = usePasswordStore();

const status = computed(() => {
  return passwordStore.statusLogout
});

const logout = async () => {
  //Update the status value
  passwordStore.statusLogout = "loading";

  //Reset before each call
  passwordStore.errorMessage = '';

  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.PASSWORD_CHANNEL, {
    channelType: 'logout'
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

  await router.push("/");
}
</script>

<template>
  <div class="flex flex-row justify-between items-center w-full ml-5 pt-10 pb-5 bg-white z-10 border-b-2 border-b-gray-200">
    <img src="../../assets/images/network-checker-header.png" alt="header" class="w-auto h-8">
    <GenericButton v-if="passwordStore.validSession" type="blue" :disabled="false" :callback="logout" class="w-24 px-4"
    > Log out
    </GenericButton>
  </div>
</template>
