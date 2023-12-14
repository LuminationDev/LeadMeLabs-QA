<script setup lang="ts">
import { ref } from "vue";
import GenericButton from "../../../components/buttons/GenericButton.vue";
import * as CONSTANT from "../../../assets/constants";

const labLocation = ref("");
const numberOfStations = ref("");

const generate = () => {
  console.log("Generating passwords");
}
</script>

<template>
  <div class="flex flex-col justify-center col-span-4 ml-24">
    <div class="flex flex-row">
      <div class="flex flex-col mr-8">
        <label for="labLocation" class="text-sm font-semibold mb-2">Lab Location</label>
        <input type="text" name="labLocation" v-model="labLocation" placeholder="Thebarton" class="w-80 h-10 mb-4 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"/>

        <label for="numberOfStations" class="text-sm font-semibold mb-2">Number of Stations</label>
        <input type="text" name="numberOfStations" v-model="numberOfStations" placeholder="3" class="w-80 h-10 mb-4 px-2 py-1 border-[1px] border-gray-400 rounded-lg shadow-sm"/>
      </div>
    </div>

    <div class="flex flex-row items-center mt-4">
      <GenericButton type="light-blue" :callback="generate" class="mr-4">Generate</GenericButton>
    </div>
  </div>
</template>
