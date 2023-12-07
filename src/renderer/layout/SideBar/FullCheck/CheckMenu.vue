<script setup lang="ts">
import {
  CONFIGURATION,
  HARDWARE,
  IMVR,
  NETWORK,
  PROGRAMS,
  SECURITY,
  SOFTWARE,
  WINDOWS
} from "../../../assets/checks/_fullcheckValues";
import MenuGroup from "@renderer/layout/SideBar/FullCheck/components/MenuGroup.vue";
</script>

<template>
  <div class="flex flex-col relative">
    <MenuGroup title="Hardware" :category="HARDWARE"/>
    <MenuGroup title="Network" :category="NETWORK" :auto-checks="['network_checks']"/>
    <MenuGroup title="Windows" :category="WINDOWS" :auto-checks="['windows_checks']"/>
    <MenuGroup title="Configuration" :category="CONFIGURATION" :auto-checks="['configuration_checks']"/>
    <MenuGroup title="Security" :category="SECURITY" :auto-checks="['security_checks']"/>
    <MenuGroup title="Software" :category="SOFTWARE" :auto-checks="['software_checks', 'steam_config_checks']"/>
    <MenuGroup title="IMVR" :category="IMVR" :auto-checks="['pre_experience_checks', 'experience_checks', 'imvr_checks']" :pre-check="true"/>
    <MenuGroup title="Programs" :category="PROGRAMS" :separator="false"/>
  </div>
</template>
