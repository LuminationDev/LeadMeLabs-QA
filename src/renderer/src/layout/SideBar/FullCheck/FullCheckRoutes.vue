<script setup lang="ts">
import { computed } from "vue";
import { useFullStore } from "@renderer/store/fullStore";
import {QaCheck} from "@renderer/interfaces";
import FullCheckNavItems from "@renderer/layout/SideBar/FullCheck/FullCheckNavItems.vue";

const fullStore = useFullStore();

const completed = computed(() => {
  const reportTracker: QaCheck[] = fullStore.reportTracker["CABLING"];
  const progress = reportTracker.filter(item => item.passedCheck !== null).length;

  if(progress === 0) { //Not started
    return 'pending'
  } else if (progress < reportTracker.length) { //Not finished
    return 'incomplete'
  } else { //Complete
    return 'complete'
  }
});
</script>

<template>
  <nav
    class="flex flex-col w-full h-full text-black border-y-gray-100 border-y-2 overflow-y-auto gray-scrollbar"
  >
    <div>
      Networking
    </div>
    <div class="ml-5 flex flex-col">

      <FullCheckNavItems/>

      <div>
        Network
      </div>
      <div>
        CBus options
      </div>
      <div>
        Security
      </div>
    </div>

    <div>
      Windows
    </div>
    <div class="ml-5 flex flex-col">
      <div>
        BIOS
      </div>
      <div>
        Settings
      </div>
    </div>

    <div>
      IMVR Stations
    </div>
    <div class="ml-5 flex flex-col">
      <div>
        TCP Setup
      </div>
      <div>
        Stations
      </div>
    </div>

    <div>
      LeadMe
    </div>

    <div>
      Security
    </div>
  </nav>
</template>
