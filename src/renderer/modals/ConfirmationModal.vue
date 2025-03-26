<script setup lang="ts">
import Modal from "./Modal.vue";
import { ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  callback: {
    type: Function,
    required: false,
  }
});

const showModal = ref(false);

function openModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function triggerCallback() {
  props.callback();
  closeModal();
}
</script>

<template>
  <div @click="openModal"
       class="w-32 h-8 flex items-center justify-center rounded-lg bg-blue-500 text-white cursor-pointer hover:bg-blue-500"
  >Load</div>

  <Teleport to="body">
    <Modal :show="showModal" @close="closeModal">
      <template v-slot:header>
        <header class="h-12 px-8 w-128 bg-white flex justify-between items-center rounded-t-lg">
          <div class="bg-white flex flex-col">
            <span class="text-lg font-medium text-black">{{title}}</span>
          </div>
        </header>
      </template>

      <template v-slot:content>
        <div class="px-8 w-128 pt-3 pb-7 flex flex-col items-center mb-3">
          <p>{{message}}</p>
        </div>
      </template>

      <template v-slot:footer>
        <footer class="my-2 text-right flex flex-row justify-center">
          <button class="w-24 h-10 mr-20 text-white text-base rounded-lg bg-blue-500 hover:bg-blue-400 font-medium"
                  v-on:click="triggerCallback"
          >Load</button>

          <button class="w-24 h-10 text-red-500 text-base rounded-lg hover:bg-gray-200 font-medium"
                  v-on:click="closeModal"
          >Cancel</button>
        </footer>
      </template>
    </Modal>
  </Teleport>
</template>
