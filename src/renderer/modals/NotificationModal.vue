<script setup lang="ts">
import Modal from "./Modal.vue";
import { useStateStore } from "../store/stateStore";

defineExpose({
  openModal
});

defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
});

const stateStore = useStateStore();

function openModal() {
  stateStore.openModal = true;
}

function closeModal() {
  stateStore.openModal = false;
}
</script>

<template>
  <Teleport to="body">
    <Modal :show="stateStore.openModal" @close="closeModal">
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
        <footer class="my-2 text-right flex flex-row justify-end">
          <button class="w-20 h-10 mr-4 text-blue-500 text-base rounded-lg hover:bg-gray-200 font-medium"
                  v-on:click="stateStore.openModal = false"
          >Cancel</button>
        </footer>
      </template>
    </Modal>
  </Teleport>
</template>
