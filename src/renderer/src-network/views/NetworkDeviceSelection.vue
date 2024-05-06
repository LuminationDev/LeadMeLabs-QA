<script setup lang="ts">
import NetworkSection from "./NetworkSection.vue";
import StationSvg from "../../assets/icons/vue/StationSvg.vue";
import NucSvg from "../../assets/icons/vue/NucSvg.vue";
import LaptopSvg from "../../assets/icons/vue/LaptopSvg.vue";
import {ref} from "vue";

const props = defineProps({
  guide: {
    type: Array,
    required: true
  }
})

const deviceOptions = [
  {
    id: 'station',
    displayName: 'Station',
    icon: StationSvg
  },
  {
    id: 'nuc',
    displayName: 'NUC',
    icon: NucSvg
  },
  {
    id: 'laptop',
    displayName: 'Laptop',
    icon: LaptopSvg
  }
]

const selection = ref(null)

</script>
<template>
  <NetworkSection :guide="props.guide">
    <template v-slot:step>Step 1</template>
    <template v-slot:heading>Choose your test device</template>
    <template v-slot:subheading>Select the device you are currently operating</template>
    <template v-slot:body>
      <div class="flex flex-row justify-between w-full">
        <div v-for="device in deviceOptions" :id="device.id"
             @click="() => { selection = device.id }"
             class="h-50 w-50 p-20 flex flex-col justify-center items-center border-2 border-solid flex-shrink-0 rounded-2xl cursor-pointer"
             :class="selection === device.id ? 'border-blue-500' : 'border-gray-300'">
          <component :is="device.icon" :fill="selection === device.id ? '#175CD3' : '#344054'" class="h-16 w-16"/>
          <span>{{ device.displayName }}</span>
        </div>
      </div>
    </template>
  </NetworkSection>
</template>
