<script setup lang="ts">
import { useRoute } from "vue-router";
import OptionButton from "@renderer/tool-qa/components/welcome/OptionButton.vue";
import vern from "../../../assets/images/vern-stand.svg";
import LoginModal from "@renderer/tool-qa/modals/LoginModal.vue";

const route = useRoute();
</script>

<template>
  <div class="w-full h-auto my-4 flex flex-col">

    <p class="text-xl text-black font-semibold mb-3">{{route.name === 'welcome' ? "Select your Tool" : "Select your Check Type"}}</p>

    <div class="w-full h-auto mb-4 flex flex-col">
      <hr class="my-4">

      <div v-if="route.name === 'welcome'" class="h-96 w-full mt-16 flex flex-row">

        <!--Setup tool (Config tool)-->
        <div class="w-full p-4">
          <OptionButton title="Lab Setup" subtitle="Configure a Learning Lab" to="/config/welcome">
            <img class="w-24 mb-4" :src="vern" alt="vern stand"/>
          </OptionButton>
        </div>

        <div class="flex flex-col w-full p-4">
          <!--QA tool choice-->
          <div class="w-full h-full">
            <LoginModal/>
          </div>

          <!--Generate Handover Doc-->
          <div class="w-full h-full pt-4">
            <OptionButton title="Network Tool" subtitle="Run a network diagnostic check" to="/network-diagnostic/test"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
