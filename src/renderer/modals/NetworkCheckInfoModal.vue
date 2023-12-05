<script setup lang="ts">
import Modal from "./Modal.vue";
import { ref } from "vue";
import { useNetworkStore } from "../src-network/store/networkStore";

defineProps({
  category: {
    type: String,
    required: true
  }
});

const networkStore = useNetworkStore();
const showModal = ref(false);

function openModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}
</script>

<template>
  <td class="text-center">
    <div @click="openModal" class="w-fit mx-auto font-semibold text-blue-600 cursor-pointer">More info</div>
  </td>

  <Teleport to="body">
    <Modal :show="showModal" @close="closeModal">
      <template v-slot:header>
        <header class="h-12 px-8 w-128 bg-white flex justify-between items-center rounded-t-lg">
          <div class="bg-white flex flex-col">
            <span class="text-lg font-medium text-black">{{category}}</span>
          </div>
        </header>
      </template>

      <template v-slot:content>
        <div class="px-8 w-128 max-h-96 overflow-auto pt-3 flex flex-col mb-3">
          <div v-for="(check, index) in networkStore.reportTracker[category]" :key="index">
            {{check}}
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <footer class="my-2 text-right flex flex-row justify-end">
          <button class="w-20 h-10 mr-4 text-blue-500 text-base rounded-lg hover:bg-gray-200 font-medium"
                  v-on:click="showModal = false"
          >Cancel</button>
        </footer>
      </template>
    </Modal>
  </Teleport>
</template>
