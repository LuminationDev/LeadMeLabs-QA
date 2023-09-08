<script setup lang="ts">
import FullCheckNavItem from "@renderer/layout/SideBar/FullCheck/FullCheckNavItem.vue";
</script>

<template>
  <nav
    class="flex flex-col w-full h-full text-black border-y-gray-100 border-y-2 overflow-y-auto gray-scrollbar"
  >
    <FullCheckNavItem title="Networking" :object-names="['CABLING', 'NETWORK', 'CBUS', 'SECURITY']"/>
    <div class="ml-5 flex flex-col">
      <FullCheckNavItem title="Cabling & Routing" :object-names="['CABLING']"/>
      <FullCheckNavItem title="Network" :object-names="['NETWORK']"/>
      <FullCheckNavItem title="CBus options" :object-names="['CBUS']"/>
      <FullCheckNavItem title="Security" :object-names="['SECURITY']"/>
    </div>

    <FullCheckNavItem title="Windows" :object-names="['BIOS', 'WINDOWS']"/>
    <div class="ml-5 flex flex-col">
      <FullCheckNavItem title="BIOS" :object-names="['BIOS']"/>
      <FullCheckNavItem title="Settings" :object-names="['WINDOWS']"/>
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
