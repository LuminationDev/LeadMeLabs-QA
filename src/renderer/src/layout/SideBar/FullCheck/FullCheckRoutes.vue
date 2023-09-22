<script setup lang="ts">
import FullCheckItem from "@renderer/layout/SideBar/FullCheck/FullCheckItem.vue";
import logo from '@renderer/assets/images/tool-logo.svg';
import { useRoute } from "vue-router";

const networkNav = [
  { title: "Cabling & Routing", objectName: "CABLING", progress: 10, routeName: 'full-cabling' },
  { title: "Network", objectName: "NETWORK", progress: 20, routeName: 'full-network' },
  { title: "CBus Options", objectName: "CBUS", progress: 30, routeName: 'full-cbus-options' }
]

const softwareNav = [
  { title: "Steam", objectName: "STEAM", progress: 50, routeName: 'full-steam' }
]

const windowsNav = [
  { title: "BIOS", objectName: "BIOS", progress: 50, routeName: 'full-bios' },
  { title: "Settings", objectName: "WINDOWS", progress: 60, routeName: 'full-windows-settings' },
]

const physicalNav = [
  { title: "Keyboard", objectName: "KEYBOARD", progress: 70, routeName: 'full-keyboard' },
  { title: "Vive", objectName: "VIVE", progress: 80, routeName: 'full-vive' },
  { title: "Projector", objectName: "PROJECTOR", progress: 90, routeName: 'full-projector' },
]

const securityNav = [
  { title: "BIOS", objectName: "BITWARDEN", progress: 91, routeName: 'full-bitwarden' },
]

const route = useRoute();
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden scrollbar-hide">
    <div class="flex justify-center mt-5 sticky flex-shrink-0">
      <router-link to="/settings">
        <img class="h-full" :src="logo" alt="LeadMe Labs Logo" />
      </router-link>
    </div>

    <nav class="flex flex-col w-full h-full text-black overflow-y-auto gray-scrollbar">
      <!--Navbar Title with sub-categories below-->
      <FullCheckItem :active="route.path.includes('/check/full/networking')" title="Networking" :object-values="networkNav"/>
      <FullCheckItem :active="route.path.includes('/check/full/windows')" title="Windows" :object-values="windowsNav"/>
      <FullCheckItem :active="route.path.includes('/check/full/software')" title="Software" :object-values="softwareNav"/>
      <FullCheckItem :active="route.path.includes('/check/full/physical')" title="Physical" :object-values="physicalNav"/>
      <FullCheckItem :active="route.path.includes('/check/full/security')" title="Security" :object-values="securityNav" :last-item="true"/>
    </nav>

    <div class="flex h-20 sticky items-center flex-col flex-shrink-0 justify-center">
      <div class="flex flex-row w-48 justify-between mb-2">
        <div class="text-sm font-semibold">QA Test</div>

        <div class="bg-blue-50 text-blue-600 rounded-xl px-1.5 py-0.5 cursor-pointer border-[1px]
                    border-blue-400 font-semibold text-xs hover:bg-gray-50">
          Save & Exit
        </div>
      </div>

      <div class="flex flex-row items-center">
        <div class="w-40 relative">
          <div
              class="bg-slate-800 rounded-full h-2 absolute z-10"
              :style="{ width: route.meta['progress'] + '%' }"
          ></div>
          <div class="w-40 bg-zinc-300 rounded-full h-2 absolute"></div>
        </div>
        <div class="flex justify-start h-3.5 ml-3 w-6">
          <span class="text-sm font-semibold">{{ route.meta['progress'] }}%</span>
        </div>
      </div>
    </div>

  </div>
</template>
