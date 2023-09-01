<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useStateStore } from "../../../store/stateStore";
import { storeToRefs } from "pinia";
import * as CONSTANT from "../../../assets/constants";
import { WindowsInfo } from "../../../interfaces";
import InformationRow from "../InformationRow.vue";

const stateStore = useStateStore();
const { windows }: WindowsInfo = storeToRefs(stateStore);

onBeforeMount(() => {
  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.WINDOW_CHANNEL,
  });
});
</script>

<template>
  <div class="flex flex-col">
    <div v-for="(value, key) in windows" :key="key">
      <InformationRow v-if="key !== `Firewall`" :title="stateStore.insertSpaceBetweenCapitalLetters(key)" :value="value ?? `Unknown`"/>
    </div>

    <div v-if="windows.Firewall != null" class="flex flex-col">
      <span class="my-2 font-semibold">Firewall Details:</span>

      <div v-for="(value, key) in windows.Firewall" :key="key">
        <div class="w-32 ml-6 font-medium">{{key}}</div>

        <div class="flex flex-col mb-3">
          <div v-for="(innerValue, key) in value" :key="key">
            <div class="flex flex-row">
              <div class="w-28 font-medium">{{stateStore.insertSpaceBetweenCapitalLetters(key)}}:</div><div>{{innerValue}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
