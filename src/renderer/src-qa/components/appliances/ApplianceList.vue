<script setup lang="ts">
import * as CONSTANT from "../../../assets/constants";
import ItemHover from "../../../components/statuses/ItemHover.vue";
import IDStatus from "./ApplianceIdStatus.vue";
import ApplianceListModal from "../../../modals/ApplianceListModal.vue";
import CheckStatus from "../../../components/statuses/CheckStatus.vue";
import { computed, onBeforeMount, ref, watch } from "vue";
import { Appliance } from "../../../interfaces";
import { useFullStore } from "../../store/fullStore";
import { useStateStore } from "../../../store/stateStore";

const stateStore = useStateStore();
const fullStore = useFullStore();
const currentlyChecking = ref('');
const currentCheckCount = ref(0);
const typeCheck = ref('all'); //default to all
const checking = ref(false);
const error = ref('');
const duplicatesFound = ref(false);
const duplicates: Record<string, Appliance[]> = {};

/**
 * Sort through the appliance_list.json sent over by the NUC. The list contains all appliances, both Cbus and Epson.
 * Group them into their individual types (lights, projectors etc...).
 */
const groupedData = computed((): {[key: string]: Array<Appliance>} => {
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

// /**
//  * Test a certain type of appliance instead of running through the entire test set again.
//  * @param type A string of the appliance type (lights, blinds, etc...)
//  */
// const retest = async (type: string) => {
//   typeCheck.value = type;
//
//   const typeLength = fullStore.ApplianceList.filter(item => item.type === type).length;
//   if (typeLength === 0) {
//     error.value = "No appliances for type: " + type;
//     setTimeout(() => {
//       error.value = "";
//     }, 2000)
//     return;
//   }
//
//   await validateAppliance();
// }

const validateAppliance = async () => {
  checking.value = true;

  //Reset values on test restart
  resetTestValues();

  for (const appliance of specificAppliances.value) {
    currentCheckCount.value++;
    currentlyChecking.value = appliance.type;

    if (appliance.automationType === 'cbus') {
      performCbusCheck(appliance);
      await waitForResponse(appliance, 5000);
    } else if (appliance.automationType === 'epson') {
      performEpsonCheck(appliance);
      await waitForResponse(appliance, 10000);
    }
  }

  // Reset values after checks
  resetValues();
};

/**
 * Waits for a response on the specified appliance within a specified timeout.
 * This function watches for changes to the appliance response. If a response is received
 * within the specified timeout, the returned promise resolves. If no response is received
 * within the timeout, the promise is rejected with a timeout error.
 *
 * @param {object} appliance - The appliance object to monitor for a response.
 * @param {number} [timeout=5000] - The maximum time in milliseconds to wait for a response.
 * @returns {Promise} A promise that resolves when a response is received or rejects on a timeout.
 */
const waitForResponse = async (appliance, timeout) => {
  return new Promise((resolve) => {
    let responseTimer;
    let watcher;

    // Watch for changes to the appliance response
    watcher = watch(() => fullStore.ApplianceList, (newValue) => {
      const newAppliance = newValue.find(item => item.id === appliance.id);
      if (newAppliance !== undefined && newAppliance.correct !== undefined) {
        clearTimeout(responseTimer);  // Clear the timeout if a response is received
        watcher(); // Stop watching once a response is received
        setTimeout(resolve, 2000);
      }
    }, { deep: true });

    // Set a timeout to reject the promise if no response is received within the specified timeout
    responseTimer = setTimeout(() => {
      watcher(); // Stop watching
      const foundAppliance = fullStore.ApplianceList.find(item => item.id === appliance.id);
      if (foundAppliance) {
        foundAppliance.correct = false;
        foundAppliance.correctId = false;
        foundAppliance.checked = true;
      }
      resolve(null);
    }, timeout);
  });
};

/**
 * Send a message to the NUC to validate the ID that relates the appliance with the supplied automation address.
 * @param appliance
 */
const performCbusCheck = (appliance: Appliance) => {
  if (appliance.type === 'scenes') {
    useStateStore().sendMessage({
      action: CONSTANT.ACTION.CBUS_APPLIANCE_VALIDATION,
      actionData: {
        automationBase: appliance.automationBase,
        automationGroup: appliance.automationGroup,
        automationId: appliance.automationId,
        automationValue: appliance.automationValue
      }
    });
    return;
  }

  useStateStore().sendMessage({
    action: CONSTANT.ACTION.CBUS_APPLIANCE_VALIDATION,
    actionData: {
      automationBase: appliance.automationBase,
      automationGroup: appliance.automationGroup,
      automationId: appliance.automationId,
    }
  });
}

const performEpsonCheck = (appliance: Appliance) => {
  useStateStore().sendMessage({
    action: "EpsonApplianceStatusCheck",
    actionData: {
      id: appliance.id,
      check: appliance.type
    }
  });
}

const validateCbusConnection = async () => {
  fullStore.cbusConnection = "Loading"

  useStateStore().sendMessage({
    action: CONSTANT.ACTION.CBUS_CONNECTION_VALIDATION,
    actionData: {}
  });
};

const resetValues = () => {
  checking.value = false;
  currentCheckCount.value = 0;
  currentlyChecking.value = "";
};

/**
 * Reset the 'correct' and 'correctId' value for the appliances that are being tested.
 */
const resetTestValues = () => {
  const resetItem = (item) => { item.correct = undefined; item.correctId = undefined; item.checked = false; };
  const resetCondition = (item) => typeCheck.value === 'all' || item.type === typeCheck.value;
  fullStore.ApplianceList.forEach((item) => {
    if (resetCondition(item)) {
      resetItem(item);
    }
  });
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
 * Check for duplicate addresses in Appliance list
 */
const checkForDuplicates = () => {
  const uniqueCombinations = new Set<string>();

  fullStore.ApplianceList.forEach((item) => {
    const { automationBase, automationGroup, automationId, automationValue } = item;
    if (automationBase === undefined) return;

    let key = `${automationBase}-${automationGroup}-${automationId}`;
    if (item.type === 'scenes') {
      key += `-${automationValue}`;
    }

    if (uniqueCombinations.has(key)) {
      if (!duplicates[key]) {
        duplicates[key] = [item];
      } else {
        duplicates[key].push(item);
      }
    } else {
      uniqueCombinations.add(key);
    }
  });

  return duplicatesFound.value = Object.keys(duplicates).length > 0;
}

/**
 * Determine what callback to use.
 */
const checkCallback = () => {
  if(!fullStore.getCbusConnection) {
    validateCbusConnection();
  }
  else if (duplicatesFound.value) {
    checkForDuplicates();
  }
  else {
    startNewTest();
  }
}

/**
 * Determine if the necessary values are currently inputted to allow a user to progress with the tool.
 * If not, block the 'Next' button on the BottomBar until they are.
 */
onBeforeMount(() => {
  if(!fullStore.getCbusConnection) {
    validateCbusConnection();
    return;
  }

  if (checkForDuplicates()) {
    return;
  }

  if (fullStore.ApplianceList.length > 0 && fullStore.getCbusConnection) {
    startNewTest();
  }
});
</script>

<template>
  <!--    Testing Status    -->
  <CheckStatus
      :checking="duplicatesFound ? 'error' : testStatus"
      :callback="checkCallback"
      :message="checking ? `Checked appliance ${currentCheckCount} out of ${fullStore.ApplianceList.length} appliances.` : undefined"/>

  <div v-if="duplicatesFound" class="w-full mt-8 flex flex-col rounded-lg border-2 border-gray-200">
    <table class="w-full border-collapse">
      <tr class="text-left text-xs bg-gray-100 border border-gray-200">
        <th class="p-3">Name</th>
        <th class="w-16 text-center p-3">Address</th>
        <th class="w-28 text-center p-3"></th>
      </tr>

      <!--Table will not be built if NUC connection has not been made, fullStore.buildQA is triggered on response-->
      <tr v-for="key in Object.keys(duplicates)" class="text-sm border border-gray-200">
        <ItemHover title="Duplicate appliance" :message="'Duplicate CBus addresses found in appliance_list.json'"/>

        <td class="text-center">
          {{key}}
        </td>
      </tr>
    </table>
  </div>

  <div v-else class="w-full mt-8 flex flex-col rounded-lg border-2 border-gray-200">
    <table class="w-full border-collapse">
      <tr class="text-left text-xs bg-gray-100 border border-gray-200">
        <th class="p-3">Name</th>
        <th class="w-16 text-center p-3">#</th>
        <th class="w-16 text-center p-3">ID</th>
        <th class="w-28 text-center p-3"></th>
      </tr>

      <!--Table will not be built if NUC connection has not been made, fullStore.buildQA is triggered on response-->
      <tr v-for="(appliances, type) in groupedData" :key="type" class="text-sm border border-gray-200">
        <ItemHover :title="stateStore.capitalizeFirstLetter(<string>type)" :message="'Not sure what to do here'"/>

        <td class="text-center">{{appliances.length}}</td>

        <IDStatus :currently-checking="type === currentlyChecking" :automationType="appliances[0]['automationType']" :appliances="appliances"/>

        <ApplianceListModal :appliance-type="stateStore.capitalizeFirstLetter(<string>type)" :appliances="appliances"/>
      </tr>
    </table>
  </div>

  <div v-if="error.length > 0" class="text-red-500">
    {{error}}
  </div>
</template>
