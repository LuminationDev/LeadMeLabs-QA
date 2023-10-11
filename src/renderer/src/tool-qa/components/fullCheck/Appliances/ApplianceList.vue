<script setup lang="ts">
import * as CONSTANT from "@renderer/assets/constants";
import ItemHover from "@renderer/tool-qa/components/fullCheck/ItemHover.vue";
import IDStatus from "@renderer/tool-qa/components/fullCheck/Appliances/ApplianceIdStatus.vue";
import ApplianceListModal from "@renderer/tool-qa/modals/ApplianceListModal.vue";
import CheckStatus from "@renderer/tool-qa/components/fullCheck/CheckStatus.vue";
import { computed, onBeforeMount, ref } from "vue";
import { Appliance } from "@renderer/tool-qa/interfaces";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";

const stateStore = useStateStore();
const fullStore = useFullStore();
const currentlyChecking = ref('');
const currentCheckCount = ref(0);
const typeCheck = ref('all'); //default to all
const checking = ref(false);
const error = ref('');

/**
 * Sort through the appliance_list.json sent over by the NUC. The list contains all appliances, both Cbus and Epson.
 * Group them into their individual types (lights, projectors etc...).
 */
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

/**
 * Collect only the cbus automation type of appliances in list.
 */
const cbusAppliances = computed(() => {
  if (typeCheck.value === 'all') {
    return fullStore.ApplianceList.filter(item => item.automationType === 'cbus').length;
  }
  return fullStore.ApplianceList.filter(item => item.automationType === 'cbus' && item.type === typeCheck.value).length;
});

/**
 * Return all appliances or just the ones with a certain type (lights, projectors etc...).
 */
const specificAppliances = computed(() => {
  if (typeCheck.value === 'all') {
    return fullStore.ApplianceList;
  }
  return fullStore.ApplianceList.filter(item => item.type === typeCheck.value);
});

/**
 * Run through the appliance list, asking the NUC to check the values of the appliances against the Cbus.
 */
const startNewTest = async () => {
  typeCheck.value = 'all';
  await validateAppliance();
}

/**
 * Test a certain type of appliance instead of running through the entire test set again.
 * @param type A string of the appliance type (lights, blinds, etc...)
 */
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

//TODO need to implement tests for Projectors/Sources (EPSON devices) & Scenes (Same base/group/id - different value)
const validateAppliance = async () => {
  checking.value = true;

  for (const appliance of specificAppliances.value) {
    currentCheckCount.value++;
    currentlyChecking.value = appliance.type;

    if (appliance.automationType === 'cbus') {
      await performCbusCheck(appliance);
    } else if (appliance.automationType === 'epson') {
      await performEpsonCheck(appliance);
    }

    // Wait for a set period before moving to the next one
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Reset values after checks
  resetValues();
};

/**
 * Send a message to the NUC to validate the ID that relates the appliance with the supplied automation address.
 * @param appliance
 */
const performCbusCheck = (appliance: Appliance) => {
  fullStore.sendMessage({
    action: CONSTANT.ACTION.CBUS_APPLIANCE_VALIDATION,
    actionData: {
      automationBase: appliance.automationBase,
      automationGroup: appliance.automationGroup,
      automationId: appliance.automationId,
    }
  });
}

const performEpsonCheck = (appliance: Appliance) => {
  console.log(`Doing epson stuff for ${JSON.stringify(appliance)}`);
}

const validateCbusConnection = async () => {
  fullStore.cbusConnection = "Loading"

  fullStore.sendMessage({
    action: CONSTANT.ACTION.CBUS_CONNECTION_VALIDATION,
    actionData: {}
  });
};

const resetValues = () => {
  checking.value = false;
  currentCheckCount.value = 0;
  currentlyChecking.value = "";
};

const testStatus = computed(() => {
  if (fullStore.cbusConnection === "Loading") {
    return 'testing';
  } else if(!fullStore.getCbusConnection) {
    return "error_cbus";
  } else {
    return checking.value ? 'testing' : 'done';
  }
});

/**
 * Determine if the necessary values are currently inputted to allow a user to progress with the tool.
 * If not, block the 'Next' button on the BottomBar until they are.
 */
onBeforeMount(() => {
  if(!fullStore.getCbusConnection) {
    validateCbusConnection();
    return;
  }

  if (fullStore.ApplianceList.length > 0) {
    startNewTest();
  }
});
</script>

<template>
  <!--    Testing Status    -->
  <CheckStatus
      :checking="testStatus"
      :callback="fullStore.getCbusConnection ? startNewTest : validateCbusConnection"
      :message="checking ? `Checked appliance ${currentCheckCount} out of ${cbusAppliances} appliances.` : undefined"/>

  <div class="w-full mt-8 flex flex-col rounded-lg border-2 border-gray-200">
    <table class="w-full border-collapse">
      <tr class="text-left text-xs bg-gray-100 border border-gray-200">
        <th class="p-3">Name</th>
        <th class="w-16 text-center p-3">ID</th>
        <th class="w-28 text-center p-3"></th>
      </tr>

      <!--Table will not be built if NUC connection has not been made, fullStore.buildQA is triggered on response-->
      <tr v-for="(appliances, type) in groupedData" :key="type" class="text-sm border border-gray-200">
        <ItemHover :title="stateStore.capitalizeFirstLetter(type)" :message="'Not sure what to do here'"/>

        <IDStatus :currently-checking="type === currentlyChecking" :appliances="appliances"/>

        <ApplianceListModal :appliance-type="stateStore.capitalizeFirstLetter(type)" :appliances="appliances"/>
      </tr>
    </table>
  </div>

  <div v-if="error.length > 0" class="text-red-500">
    {{error}}
  </div>
</template>
