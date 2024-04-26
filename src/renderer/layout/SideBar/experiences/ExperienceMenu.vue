<script setup lang="ts">
import SetupMenu from "../menu/SetupMenu.vue";
import MenuGroup from "../menu/MenuGroup.vue";
import { IMVR } from "../../../assets/checks/_fullcheckValues";
</script>

<template>
  <div class="flex flex-col ml-4 relative">
    <SetupMenu/>

    <!--IMVR menu items-->
    <div class="flex flex-col relative">
      <MenuGroup title="IMVR"
                 :category="IMVR"
                 :auto-checks="['pre_experience_checks', 'experience_checks', 'imvr_checks']"
                 :pre-check="true"
                 :separator="false"/>
    </div>
  </div>
</template>
