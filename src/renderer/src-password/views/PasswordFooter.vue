<script setup lang="ts">
import GenericButton from "../../components/buttons/GenericButton.vue";
import { useRouter } from "vue-router";
const router = useRouter();

const props = defineProps({
  next: {
    type: [String, undefined],
    required: false
  },
  prev: {
    type: [String, undefined],
    required: false
  }
});

</script>

<template>
  <div class="py-10 flex-shrink-0 h-20 sticky bottom-0 w-full z-10 bg-white flex flex-row justify-between items-center border-t-2 border-b-gray-200">
    <GenericButton v-if="prev !== undefined" type="light" :callback="() => { router.push(prev) }"
    >Back
    </GenericButton>

    <div class="grow"></div>

    <GenericButton type="blue" :disabled="next === undefined" :callback="() => { router.push(next) }" class="w-auto px-4"
    > Next
    </GenericButton>
  </div>
</template>
