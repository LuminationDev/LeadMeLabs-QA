<script setup lang="ts">
import { useStateStore } from "../../../store/stateStore";
import { SoftwareInfo } from "../../../interfaces";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import * as CONSTANT from "../../../assets/constants";
import InformationRow from "../InformationRow.vue";

const stateStore = useStateStore();
const { software }: SoftwareInfo = storeToRefs(stateStore);

onBeforeMount(() => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.SOFTWARE_CHANNEL,
  });
});
</script>

<template>
  <div v-for="(value, key) in software" :key="key">
    <InformationRow :title="stateStore.insertSpaceBetweenCapitalLetters(key)" :value="value ?? `Unknown`"/>
  </div>
</template>
