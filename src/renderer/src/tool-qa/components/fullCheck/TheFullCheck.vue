<script setup lang="ts">
import GenericLayout from "@renderer/tool-qa/components/checks/GenericLayout.vue";
import { useRoute } from "vue-router";
import { ref } from "vue";
import * as CONSTANT from "@renderer/assets/constants";
import { useStateStore } from "../../store/stateStore";
import { useFullStore } from "../../store/fullStore";
import GenericButton from "@renderer/tool-qa/components/_generic/buttons/GenericButton.vue";

const route = useRoute();

const stateStore = useStateStore();
const fullStore = useFullStore();

const nucAddress = ref("")
const tabletIp = ref("")
const encryptionKey = ref("")

async function connectToNuc() {
  stateStore.key = encryptionKey.value;
  fullStore.nucAddress = nucAddress.value;

  //@ts-ignore
  api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
    channelType: CONSTANT.CHANNEL.TCP_COMMAND_CHANNEL,
    key: stateStore.key,
    address: stateStore.ipAddress,
    port: stateStore.serverPort,
    command: "start"
  });

  fullStore.sendMessage({
    action: CONSTANT.ACTION.CONNECT,
    actionData: {}
  })
}

async function connectToTablet() {

  fullStore.sendMessage({
    action: CONSTANT.ACTION.CONNECT_TABLET,
    actionData: {
      tabletIp: tabletIp.value
    }
  })
}

function startTest() {
  const groupsToRun = fullStore.processQaList()
  console.log(groupsToRun)
  groupsToRun.forEach(group => {
    fullStore.startQa(group)
    fullStore.sendMessage({
      action: CONSTANT.ACTION.RUN_STATION_GROUP,
      actionData: {
        group,
        stationIds: ['all']
      }
    })
  })
  fullStore.sendMessage({
    action: CONSTANT.ACTION.RUN_TABLET_ALL,
    actionData: {
      tabletIpAddresses: [tabletIp.value]
    }
  })
}
</script>

<template>
  <GenericLayout>
    <template v-slot:title>
      <p class="text-xl font-semibold text-black mb-3">Full Lab Check</p>
    </template>

    <template v-slot:content>
      Please enter the NUC address and encryption key and then connect.

      <div class="flex flex-col">
        <input type="text" name="nucAddress" v-model="nucAddress" placeholder="192.168.1.100" class="w-80 h-10 my-2 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"/>
        <input type="text" name="encryptionKey" v-model="encryptionKey" placeholder="Key" class="w-80 h-10 mb-2 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"/>

        <GenericButton type="primary" :callback="connectToNuc">Connect</GenericButton>


        <input type="text" name="tabletIp" v-model="tabletIp" placeholder="192.168.1.99" class="w-80 h-10 my-2 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"/>

        <GenericButton type="primary" :callback="connectToTablet">Connect</GenericButton>

        <div class="flex flex-row">
          <span class="font-semibold mr-2">Server is connected:</span>
          {{ fullStore.connected }}
        </div>
        <div>Tablets:
        {{ fullStore.tablets }}</div>
      </div>

      <div v-if="fullStore.connected" class="flex flex-col">
        <hr class="my-5">

        Successfully connected<br/>
        There are {{ fullStore.ApplianceList.length }} appliances<br/>
        There are {{ fullStore.NucStationList.length }} stations<br/>
        {{ fullStore.NucStationList.filter(station => station.status === "On").length }} stations are on and ready<br/>

        <div class="mb-4 flex flex-row items-center">
          CBus Connection:
          <span class="mx-2" :class="{
            'text-green-500': fullStore.getCbusConnection === 'Connection available',
            'text-red-500': fullStore.getCbusConnection !== 'Connection available',
          }">
            {{fullStore.getCbusConnection === 'Connection available' ? "Available" : fullStore.getCbusConnection}}
          </span>
        </div>


        <GenericButton type="primary" :callback="startTest">Start Test</GenericButton>

        <div class="flex flex-col">
          <div v-for="(group, index) in fullStore.qaGroups" :key="index" class="flex flex-col">
            <div v-for="(check, index2) in group.checks" :key="index2" class="flex flex-col">
              <div v-for="(station, index3) in check.stations" :key="index3" class="flex flex-col">
                {{ check.id }}: {{ station.passedStatus }}({{ station.checkingStatus }}): {{ station.message }}
              </div>
            </div>
          </div>


<!--          <div v-for="(station, index) in fullStore.Stations" :key="index" class="flex flex-col">-->
<!--            <div v-for="check in station.qaChecks" :key="check.id">-->
<!--              <span :class="check.passedStatus === 'passed' ? 'bg-green-500' : 'bg-red-500'">{{ check.passedStatus }}</span>-->
<!--              <span>{{ check.id }}</span>-->
<!--              <span>{{ check.message }}</span>-->
<!--            </div>-->
<!--            <div>-->
<!--              {{ station.details }}-->
<!--            </div>-->
<!--            <div>-->
<!--              {{ station.expectedDetails }}-->
<!--            </div>-->
<!--            <div v-for="check in station.getComputedChecks()" :key="check.id">-->
<!--              <span :class="check.passedStatus === 'passed' ? 'bg-green-500' : 'bg-red-500'">{{ check.passedStatus }}</span>-->
<!--              <span>{{ check.id }}</span>-->
<!--              <span>{{ check.message }}</span>-->
<!--            </div>-->

<!--          </div>-->
        </div>
      </div>

    </template>
  </GenericLayout>
</template>
