<script setup lang="ts">
import { useRoute } from "vue-router";
import OptionButton from "@renderer/tool-qa/components/_generic/welcome/OptionButton.vue";
import vern from "@renderer/assets/images/vern-stand.svg";

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
          <div class="w-full h-full pb-4">
            <OptionButton title="QA Test" subtitle="Run a Quality Assurance Test" to="/check/full"/>
          </div>

          <!--Generate Handover Doc-->
          <div class="w-full h-full pt-4">
            <OptionButton title="Handover Doc" subtitle="Generate a Handover Document" to="/report"/>
          </div>
        </div>
      </div>

      <div v-else-if="route.name === 'check-selection'" class="h-96 w-full mt-16 flex flex-row">
          <!--Quick Check-->
          <div class="w-full h-full p-4">
            <OptionButton title="Quick Check" subtitle="Test a Single Station" to="/check/quick"/>
          </div>

          <!--Full Check-->
          <div class="w-full h-full p-4">
            <OptionButton title="Full Check" subtitle="Test the Entire Lab" to="/check/full"/>
          </div>
      </div>
    </div>
  </div>
</template>
