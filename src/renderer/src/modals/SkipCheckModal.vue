<script setup lang="ts">
import Modal from "./Modal.vue";
import { ref } from "vue";

defineExpose({
  openModal
});

defineProps({
  callback: {
    type: Function,
    required: true
  }
});

const showModal = ref(false);
const comment = ref();

function openModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}
</script>

<template>
  <Teleport to="body">
    <Modal :show="showModal" @close="closeModal">
      <template v-slot:header>
        <header class="h-12 px-8 w-128 bg-white flex justify-between items-center rounded-t-lg">
          <div class="bg-white flex flex-col">
            <span class="text-xl font-semibold text-black">Skip Check?</span>
          </div>
        </header>
      </template>

      <template v-slot:content>
        <div class="px-8 w-128 pt-3 pb-7 flex flex-col mb-3">
          <div>
            Are you sure you want to skip this check? If so, Please leave a comment and proceed.
          </div>

          <div class="flex flex-col my-4">
            <div class="mb-2 text-lg font-semibold">
              Comment
            </div>
            <input class="h-10 border-2 border-gray-400 rounded px-2" v-model="comment"/>
          </div>

          <div class="flex flex-row items-center">
            <input class="w-4 h-4 mr-4" name="noComment" type="checkbox">
            <label for="noComment">Continue without comment</label>
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <footer class="my-2 text-right flex flex-row justify-end">
          <button class="w-20 h-10 mr-4 text-blue-500 text-base rounded-lg hover:bg-gray-200 font-medium"
                  v-on:click="showModal = false"
          >Cancel</button>

          <button class="w-20 h-10 mr-4 text-blue-500 text-base rounded-lg hover:bg-gray-200 font-medium"
                  v-on:click="showModal = false; callback()"
          >Confirm</button>
        </footer>
      </template>
    </Modal>
  </Teleport>
</template>
