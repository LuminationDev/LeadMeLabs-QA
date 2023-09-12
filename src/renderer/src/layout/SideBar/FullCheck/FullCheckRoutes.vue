<script setup lang="ts">
import FullCheckItem from "@renderer/layout/SideBar/FullCheck/FullCheckItem.vue";

const networkNav = [
  { title: "Cabling & Routing", objectName: "CABLING" },
  { title: "Network", objectName: "NETWORK" },
  { title: "CBus options", objectName: "CBUS" },
  { title: "Security", objectName: "SECURITY" }
]

const windowsNav = [
  { title: "BIOS", objectName: "BIOS" },
  { title: "Settings", objectName: "WINDOWS" },
]
</script>

<template>
  <nav
    class="flex flex-col w-full h-full text-black border-y-gray-100 border-y-2 overflow-y-auto gray-scrollbar"
  >
    <!--Navbar Title with sub-categories below-->
    <FullCheckItem title="Networking" :object-values="networkNav"/>
    <FullCheckItem title="Windows" :object-values="windowsNav"/>
    <FullCheckItem title="LeadMe" :object-values="[]"/>
    <FullCheckItem title="Security" :object-values="[]"/>

    <!--Appliances are handled differently-->
    <div>
      Appliances
    </div>
    <div class="ml-5 flex flex-col">
      <div>
        TCP Setup
      </div>
      <div>
        Appliance list
      </div>
    </div>

    <!--Stations are handled differently-->
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
  </nav>
</template>
