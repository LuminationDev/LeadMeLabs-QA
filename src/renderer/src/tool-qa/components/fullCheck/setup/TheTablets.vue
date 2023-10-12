<script setup lang="ts">
import TabletSvg from "@renderer/assets/icons/TabletSvg.vue";
import StatusIcon from "@renderer/tool-qa/components/_generic/StatusIcon.vue";
import GenericButton from "@renderer/tool-config/components/GenericButton.vue";
import ConnectingSpinner from "@renderer/tool-qa/components/_generic/loading/ConnectingSpinner.vue";
import * as CONSTANT from "@renderer/assets/constants";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";

const fullStore = useFullStore();
const tabletIp = ref("");

const { connectedTabletCount } = storeToRefs(fullStore)

const tabletConnectionState = computed(() => {
  if (fullStore.tablets.length < 1) {
    return 'unstarted'
  }
  const tablet = fullStore.tablets[fullStore.tablets.length - 1]
  if (tablet.connecting) {
    return 'loading'
  }
  return tablet.connected ? 'unstarted' : 'failed' // unstarted because it's already in the list in this case
})

async function connectToTablet() {
  fullStore.addUnconnectedTablet(tabletIp.value)
  fullStore.sendMessage({
    action: CONSTANT.ACTION.CONNECT_TABLET,
    actionData: {
      tabletIp: tabletIp.value
    }
  })
  tabletIp.value = ''
}

const toggleShowTabletForm = ref(false)
const showTabletForm = computed(() => {
  if (fullStore.connectedTabletCount < 1) {
    return true
  }
  return toggleShowTabletForm.value
});

watch(connectedTabletCount, (newValue) => {
  toggleShowTabletForm.value = false
})
</script>

<template>
  <div class="w-full border-2 border-gray-200 rounded-xl p-4 flex flex-col">
    <div class="flex flex-row items-center h-full" v-if="fullStore.connectedTabletCount === 0">
      <StatusIcon status="grey" class="w-16 h-16 mr-8">
        <template v-slot:icon="{ fill }">
          <TabletSvg :fill="fill" />
        </template>
      </StatusIcon>
      <span class="text-lg font-semibold col-span-4">Connect to tablets</span>
    </div>
    <div class="flex flex-row items-center h-full" v-else>
      <StatusIcon status="green" class="w-16 h-16 mr-8">
        <template v-slot:icon="{ fill }">
          <TabletSvg :fill="fill" />
        </template>
      </StatusIcon>
      <div class="flex flex-row justify-between items-center w-full">
        <div class="text-lg font-semibold">
          {{ fullStore.connectedTabletCount }} tablet is connected
        </div>
        <GenericButton :callback="() => {toggleShowTabletForm = !toggleShowTabletForm}"><span class="text-blue-700 font-semibold">{{ toggleShowTabletForm ? 'Close' : 'Connect another tablet' }}</span></GenericButton>
      </div>
    </div>
    <div class="ml-24 flex flex-col" v-if="showTabletForm">
      <label for="tabletIp" class="text-sm font-semibold">Tablet IP address</label>
      <input type="text" name="tabletIp" v-model="tabletIp" placeholder="192.168.1.99" class="w-80 h-10 my-2 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"/>
      <div class="flex flex-row items-center">
        <GenericButton class="mr-2" type="light-blue" :callback="connectToTablet">Connect</GenericButton>
        <ConnectingSpinner :state="tabletConnectionState" device-name="tablet" />
      </div>
    </div>
  </div>
</template>
