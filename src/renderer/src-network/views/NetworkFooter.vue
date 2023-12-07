<script setup lang="ts">
import GenericButton from "../../components/buttons/GenericButton.vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  numberOfPages: {
    type: Number,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'next'): void
}>()

</script>

<template>
  <div class="py-10 flex-shrink-0 h-20 sticky bottom-0 w-full z-10 bg-white flex flex-row justify-between items-center border-t-2 border-b-gray-200">
    <GenericButton v-if="currentPage > 0" type="light" :callback="() => { $emit('back') }"
    >Back
    </GenericButton>

    <div class="grow"></div>

    <!--Skip without a comment-->
    <GenericButton type="blue" :disabled="currentPage + 1 >= numberOfPages" :callback="() => { $emit('next') }" class="w-auto px-4"
    > Next
    </GenericButton>
  </div>
</template>
