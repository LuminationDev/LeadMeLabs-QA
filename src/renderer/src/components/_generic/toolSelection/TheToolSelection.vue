<script setup lang="ts">
import { RouterLink } from "vue-router";
import CheckSelection from "@renderer/components/_generic/toolSelection/CheckSelection.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div class="w-full h-auto my-4 flex flex-col">

    <p class="text-xl text-black font-semibold mb-3">Select you Setup Tool</p>

    <div class="w-full h-auto mb-4 flex flex-col">
      <hr class="my-4">

      <div v-if="route.name === 'selection'" class="flex flex-row">
        <!--Setup tool (Config tool)-->
        <router-link class="hover:no-underline" to="/selection">
          <img class="cursor-pointer hover:bg-blue-200" alt="quick station check" src="../../../assets/deleteLater/setupToolButton.png">
        </router-link>

        <div class="flex flex-col">
          <!--QA tool choice-->
          <router-link class="hover:no-underline" to="/check/selection">
            <img class="cursor-pointer hover:bg-blue-200" alt="quick station check" src="../../../assets/deleteLater/qaToolButton.png">
          </router-link>

          <!--Generate Handover Doc-->
          <router-link class="hover:no-underline" to="/report">
            <img class="cursor-pointer hover:bg-blue-200" alt="quick station check" src="../../../assets/deleteLater/generateHandButton.png">
          </router-link>
        </div>
      </div>

      <CheckSelection v-else-if="route.name === 'check-selection'" />
    </div>
  </div>
</template>
