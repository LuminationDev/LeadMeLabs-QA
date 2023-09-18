<script setup lang="ts">
import InformationTitle from "@renderer/components/checks/InformationTitle.vue";
import GenericButton from "@renderer/components/_generic/buttons/GenericButton.vue";
import { computed, onBeforeMount, ref, watchEffect } from "vue";
import { Appliance } from "@renderer/interfaces";
import { useFullStore } from "@renderer/store/fullStore";
import { useStateStore } from "@renderer/store/stateStore";
import * as CONSTANT from "@renderer/assets/constants";
import BasicApplianceCheck from "@renderer/components/fullCheck/Appliances/BasicApplianceCheck.vue";

const stateStore = useStateStore();
const fullStore = useFullStore();
const currentCheckCount = ref(0);
const typeCheck = ref('all'); //default to all
const checking = ref(true);
const error = ref('');

const groupedData = computed(() => {
  const data = fullStore.ApplianceList;

  if (data.length === 0) {
    return {};
  }

  const groupedData = data.reduce((acc, item: Appliance) => {
    const itemType: string = item.type;
    acc[itemType] = acc[itemType] || [];
    acc[itemType].push(item);
    return acc;
  }, {});

  for (const itemType in groupedData) {
    if (groupedData.hasOwnProperty(itemType)) {
      groupedData[itemType].sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  return groupedData;
});

const currentlyAnswered = computed(() => {
  return fullStore.ApplianceList.filter(item => item.correct === true || item.correct === false).length;
});

const cbusAppliances = computed(() => {
  if (typeCheck.value === 'all') {
    return fullStore.ApplianceList.filter(item => item.automationType === 'cbus').length;
  }
  return fullStore.ApplianceList.filter(item => item.automationType === 'cbus' && item.type === typeCheck.value).length;
})

const specificAppliances = computed(() => {
  if (typeCheck.value === 'all') {
    return fullStore.ApplianceList;
  }
  return fullStore.ApplianceList.filter(item => item.type === typeCheck.value);
})

/**
 * Run through the appliance list, asking the NUC to check the values of the appliances against the Cbus.
 */
const startNewTest = async () => {
  typeCheck.value = 'all';
  await validateAppliance();
}

const retest = async (type: string) => {
  typeCheck.value = type;

  if (cbusAppliances.value === 0) {
    error.value = "No CBus appliances for type: " + type;
    setTimeout(() => {
      error.value = "";
    }, 2000)
    return;
  }

  await validateAppliance();
}

const validateAppliance = async () => {
  checking.value = true;
  for(let i = 0; i < specificAppliances.value.length; i++) {
    if(specificAppliances.value[i].automationType !== 'cbus') continue;
    currentCheckCount.value++;

    //@ts-ignore
    api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
      channelType: CONSTANT.CHANNEL.TCP_CLIENT_CHANNEL,
      key: stateStore.key,
      address: fullStore.nucAddress,
      port: 55556,
      data: CONSTANT.MESSAGE.CBUS_APPLIANCE_VALIDATION + stateStore.getServerDetails +
          `:${specificAppliances.value[i]['automationBase']}:${specificAppliances.value[i]['automationGroup']}:${specificAppliances.value[i]['automationId']}`
    });

    //Wait for a set period before moving to the next one
    //Todo test how many might overload the cbus?
    await new Promise(resolve => setTimeout(resolve, 500));

    //Break the loop if there is a timeout or error returned
    //break;
  }
  checking.value = false;
  currentCheckCount.value = 0;
}

/**
 * The precedent for if a user can continue to the next segment.
 */
const calcProceed = () => {
  stateStore.canProceed = (currentlyAnswered.value === fullStore.ApplianceList.length && fullStore.ApplianceList.length !== 0);
}

/**
 * Watch for any changes in the calcProceed to re-evaluate if the user can continue.
 */
watchEffect(() => {
  calcProceed();
});

/**
 * Determine if the necessary values are currently inputted to allow a user to progress with the tool.
 * If not, block the 'Next' button on the BottomBar until they are.
 */
onBeforeMount(() => {
  calcProceed();
});
</script>

<template>
  <GenericButton v-if="fullStore.ApplianceList.length > 0" type="primary" :callback="startNewTest">Start Test</GenericButton>

  <div v-if="checking">
    Checked appliance {{currentCheckCount}} out of {{cbusAppliances}} CBus appliances.
  </div>

  <div v-if="error.length > 0" class="text-red-500">
    {{error}}
  </div>

  <InformationTitle
      class="mb-4"
      title="Appliances"
      :current-keys="currentlyAnswered"
      :total-keys="fullStore.ApplianceList.length"/>

  <!--Display the NUC response below-->
  <div class="flex flex-col" v-for="(appliances, type) in groupedData" :key="type">
    <BasicApplianceCheck
        :appliances="appliances"
        :type="type"
        @retest="retest"/>
  </div>
</template>
