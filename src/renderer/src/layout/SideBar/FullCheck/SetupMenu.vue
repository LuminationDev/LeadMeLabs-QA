<script setup lang="ts">
import MenuItem from "@renderer/layout/SideBar/FullCheck/components/MenuItem.vue";
import MenuSeparator from "@renderer/layout/SideBar/FullCheck/components/MenuSeparator.vue";
</script>

<!--TODO COMPLETE THIS AFTER CONFIG AND SETUP PAGES ARE DONE-->
<template>
  <div class="flex flex-col relative">
    <!--Category title-->
    <MenuItem title="Setup" route="/" :current="false" status="pending" :setup="true"/>

    <!--TODO COMPLETE THIS AFTER CONFIG AND SETUP PAGES ARE DONE-->
    <template v-if="false">
      <!--Sub-categories-->
      <div class="ml-5 flex flex-col relative">
        <MenuItem title="Devices" route="/"  :current="false" status="pending" :setup="true"/>

        <MenuSeparator :active="false"/>
      </div>

      <div class="ml-5 flex flex-col relative">
        <MenuItem title="Config" route="/"  :current="false" status="pending" :setup="true"/>
      </div>

      <!--Category separator-->
      <MenuSeparator :active="false"/>
    </template>
  </div>
</template>
