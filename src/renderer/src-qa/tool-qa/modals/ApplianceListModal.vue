<script setup lang="ts">
import Modal from "@renderer/tool-qa/modals/Modal.vue";
import { ref } from "vue";
import { Appliance } from "@renderer/tool-qa/interfaces";
import { useStateStore } from "@renderer/tool-qa/store/stateStore";

defineProps({
  applianceType: {
    type: String,
    required: true
  },
  appliances: {
    type: Array<Appliance>,
    required: true
  }
});

const stateStore = useStateStore();
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
            <span class="text-lg font-medium text-black">{{applianceType}}</span>
          </div>
        </header>
      </template>

      <template v-slot:content>
        <div class="px-8 w-128 max-h-96 overflow-auto pt-3 flex flex-col mb-3">
          <div v-for="(appliance, index) in appliances" :key="index">
            <div class="flex flex-col w-full mt-4">
              <span v-for="(value, key) in appliance" :key="key" class="ml-2">
                <span v-if="value !== null && value !== '' && key !== 'correct' && key !== 'correctId'"
                  class="flex flex-row"
                  :class="{
                    'text-green-500': (key === 'id' && appliance['correctId'] === true) || (key === 'defaultPassword' && appliance['defaultPassword'] === true),
                    'text-red-500': (key === 'id' && appliance['correctId'] === false) || (key === 'defaultPassword' && appliance['defaultPassword'] === true),
                  }"
                >
                  <span class="w-40">{{ stateStore.capitalizeFirstLetter(key) }}:</span>
                  <span>{{ value ?? "Not found" }}</span>
                </span>
              </span>
              <hr class="mt-4">
            </div>
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
