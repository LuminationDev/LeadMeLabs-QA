<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="w-full h-auto my-4 flex flex-col">

    <!--TODO replace with the proper section below when design is ready-->
    <!--<p class="text-lg text-black mb-3">Select you Setup Tool</p>-->
    <img alt="title" src="../../../assets/deleteLater/toolSelection.png" class="w-96"/>

    <div class="w-full h-auto mb-4 flex flex-col">
      <hr class="my-4">

      <router-link class="hover:no-underline" to="/check/quick">
        <img @click="" class="cursor-pointer hover:bg-blue-200" alt="quick station check" src="../../../assets/deleteLater/qsc.png">
      </router-link>

      <router-link class="hover:no-underline" to="/check/full">
        <img class="cursor-pointer hover:bg-blue-200" alt="quick station check" src="../../../assets/deleteLater/flc.png">
      </router-link>

      <div>
        <img class="cursor-pointer hover:bg-blue-200" alt="quick station check" src="../../../assets/deleteLater/lct.png">
      </div>
    </div>
  </div>
</template>
