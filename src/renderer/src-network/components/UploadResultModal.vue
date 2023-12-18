<script setup lang="ts">
import Modal from "../../modals/Modal.vue";

const props = defineProps({
  message: {
    type: String,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Modal :show="true" @close="closeModal">
      <template v-slot:header>
        <header class="h-12 px-8 w-128 flex justify-between items-center rounded-t-lg">
          <div class="flex flex-col">
            <span class="font-semibold text-lg font-medium text-black">{{ message === 'success' ? 'Upload Succeeded' : 'Upload Failed' }}</span>
          </div>
        </header>
      </template>

      <template v-slot:content>
        <div class="px-8 w-128 py-8 bg-white flex flex-col">
          <span v-if="message === 'success'">Thank you. You can now exit the tool.</span>
          <span v-else>Please try again, or download the report and email it to your Lumination ICT contact.</span>
        </div>
      </template>

      <template v-slot:footer>
        <footer class="mt-4 mb-2 mx-2 flex flex-col">
          <div class="text-right flex flex-row justify-between">
            <button class="w-24 h-10 text-blue-500 text-base rounded-lg hover:bg-gray-200 font-medium"
                    v-on:click="closeModal"
            >Close</button>
          </div>
        </footer>
      </template>
    </Modal>
  </Teleport>
</template>
