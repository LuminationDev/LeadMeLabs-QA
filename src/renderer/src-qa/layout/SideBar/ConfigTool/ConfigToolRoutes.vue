<script setup lang="ts">
import { useLabStore } from "@renderer/tool-config/store/labStore";
import { useChecklistStore } from "@renderer/tool-config/store/checklistStore";
import { useRoute } from "vue-router";
import NavItems from "@renderer/layout/SideBar/ConfigTool/NavItems.vue";
import logo from '../../../assets/icons/leadmeLabsLogo.svg'
import welcome from '../../../assets/images/sidebar-welcome.png'

const labStore = useLabStore();
const checklistStore = useChecklistStore();
const route = useRoute();
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden scrollbar-hide">

    <div class="flex justify-center h-10 mt-5 mb-5 sticky flex-shrink-0">
      <router-link to="/settings">
        <img class="h-full" :src="logo" alt="LeadMe Labs Logo" />
      </router-link>
    </div>

    <div
        v-if="route.name === 'config-welcome' || route.name === 'config-home'"
        class="w-full overflow-y-hidden border-t-gray-100 border-t-2"
    >
      <img class="h-full w-full object-cover" :src="welcome" alt="LeadMe Labs Logo" />
    </div>

    <nav
        v-else
        class="flex flex-col w-full h-full text-black border-y-gray-100 border-y-2 overflow-y-scroll gray-scrollbar"
    >
      <NavItems :completion="{ valid: true, count: 1 }" target="/config/welcome">Welcome</NavItems>
      <NavItems :completion="checklistStore.getCompletedStatus" target="/config/checklist"
          >Checklist
      </NavItems>
      <NavItems :completion="labStore.getCompletedStatus.rooms" target="/config/rooms"
          >Rooms</NavItems
      >
      <NavItems :completion="labStore.getCompletedStatus.lights" target="/config/lights"
          >Lights
      </NavItems>
      <NavItems :completion="labStore.getCompletedStatus.blinds" target="/config/blinds"
          >Blinds
      </NavItems>
      <NavItems :completion="labStore.getCompletedStatus.projectors" target="/config/projectors"
          >Projectors
      </NavItems>
      <NavItems :completion="labStore.getCompletedStatus.splicers" target="/config/splicers"
          >Splicers
      </NavItems>
      <NavItems :completion="labStore.getCompletedStatus.ledRings" target="/config/ledRings"
          >LED Rings
      </NavItems>
      <NavItems :completion="labStore.getCompletedStatus.stations" target="/config/stations"
          >Stations
      </NavItems>
      <NavItems :completion="labStore.getCompletedStatus.scenes" target="/config/scenes"
          >Scenes
      </NavItems>
      <NavItems target="/config/final">Final</NavItems>
    </nav>

    <div class="flex h-20 sticky items-center flex-col flex-shrink-0 justify-center">
      <div class="flex justify-start w-11/12">
        <span class="text-xs">{{ route.meta['progress'] }}%</span>
      </div>
      <div class="w-11/12 relative">
        <div
          class="bg-slate-800 rounded-full h-2 absolute z-10"
          :style="{ width: route.meta['progress'] + '%' }"
        ></div>
        <div class="w-full bg-zinc-300 rounded-full h-2 absolute"></div>
      </div>
    </div>
  </div>
</template>
