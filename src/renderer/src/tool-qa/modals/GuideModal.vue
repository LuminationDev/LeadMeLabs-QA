<script setup lang="ts">
import Modal from "./Modal.vue";
import { computed, ref } from "vue";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import {CheckGuideItem} from "../interfaces/_routeItems";
import vernMatrix from '../../assets/images/vern-matrix.png'

defineExpose({
  openModal
});

const props = defineProps({
  guides: {
    type: Object as () => Record<string, CheckGuideItem>,
    required: true,
    default: ""
  }
});

const fullStore = useFullStore();
const showModal = ref(false);
const comment = ref("");

const currentPage = ref(0)
function nextPage() {
  if (currentPage >= (selectedGuide.value.guide.length - 1)) {
    return
  }
  currentPage.value += 1;
}

function backPage() {
  if (currentPage < (selectedGuide.value.guide.length - 1)) {
    return
  }
  currentPage.value -= 1;
}

function selectPage(index) {
  if (index < (selectedGuide.value.guide.length - 1) || index >= (selectedGuide.value.guide.length - 1)) {
    return
  }
  currentPage.value = index
}

const selectedGuideKey = ref(null)
const selectedGuide = computed(() => {
  if (props.guides.length === 1) {
    return props.guides[0]
  }
  if (selectedGuideKey === null) {
    return null
  }
  return props.guides.find(element => element.value === selectedGuideKey.value)
})

function selectGuide(name: string) {
  selectedGuideKey.value = name
}

function openModal() {
  selectedGuideKey.value = null
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

const imageSrc = computed(() => {
  if (selectedGuide === null) {
    return null
  }
  if (selectedGuide.value.guide[currentPage.value].imageSource) {
    return selectedGuide.value.guide[currentPage.value].imageSource
  }
  return null
})

</script>

<template>

  <button class="w-20 h-10 flex justify-center items-center border-[1px]
               border-gray-500 rounded-lg cursor-pointer hover:bg-gray-200"
          @click="openModal"
  >
    <img class="w-5 h-5 mr-1" src="../../assets/icons/help-circle.svg" alt="question mark">
    <div class="text-sm font-semibold">
      Guide
    </div>
  </button>

  <Teleport to="body">
    <Modal :show="showModal" @close="closeModal">
      <template v-slot:header>
        <header class="h-20 px-6 w-96 bg-white flex items-center rounded-t-lg" :class="guides.length > 1 && selectedGuide ? 'justify-between' : 'justify-end'">
          <img v-if="guides.length > 1 && selectedGuide" v-on:click="() => { selectGuide(null) }" class="cursor-pointer" alt="back icon" src="../../assets/icons/back.svg"/>
          <span v-if="guides.length > 1 && selectedGuide">{{ selectedGuideKey }}</span>
          <img v-on:click="showModal = false" class="cursor-pointer" alt="close icon" src="../../assets/icons/close.svg"/>
        </header>
      </template>

      <template v-slot:content>
        <div class="px-6 w-96 bg-white pb-7 flex flex-col items-center">
          <div v-if="selectedGuide" class="flex flex-col">

            <img v-if="imageSrc" class="h-auto w-full object-contain" :src="imageSrc"/>
            <div v-else class="flex w-full justify-center items-center">
              <img class="h-32 w-32 object-contain" :src="vernMatrix"/>
            </div>
            <div class="flex flex-col items-center mt-4 w-80"
                 v-html="selectedGuide.guide[currentPage].text"/>
          </div>
          <div v-else class="flex flex-col">
            <h3>Multiple guides available:</h3>
            <div class="flex flex-col" v-for="(guide) in guides" :key="guide.key" @click="() => { selectGuide(key) }">
              <span class="cursor-pointer">{{ guide.key }}</span>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <footer class="w-full py-2 text-right flex flex-col bg-white rounded-b-lg px-6 pb-6">

          <div class="flex flex-row justify-center" v-if="selectedGuide && selectedGuide.guide.length > 1">
            <div v-for="(guide, index) in selectedGuide.guide" :key="index" class="first:-ml-2 last:-mr-2">
              <button class="w-3 h-3 rounded-full mx-2 cursor-pointer"
                      :class="currentPage === index ? 'bg-blue-700' : 'bg-gray-200'"
                      @click="() => { selectPage(index) }"/>
            </div>
          </div>
          <div class="flex flex-row w-full mt-8" v-if="selectedGuide && selectedGuide.guide.length > 1">
            <button class="w-1/2 h-11 mr-3 text-gray-800 font-semibold text-base border-2 border-gray-300 rounded-lg hover:bg-gray-200 font-medium cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                    :disabled="currentPage < (selectedGuide.guide.length - 1)"
                    v-on:click="backPage"
            >Back</button>

            <button class="w-1/2 h-11 text-white font-semibold text-base rounded-lg font-medium bg-blue-700 disabled:bg-blue-300 cursor-pointer disabled:cursor-not-allowed"
                    :disabled="currentPage >= (selectedGuide.guide.length - 1)"
                    v-on:click="nextPage"
            >Next</button>
          </div>
        </footer>
      </template>
    </Modal>
  </Teleport>
</template>

<style>
h3 {
  @apply font-semibold text-lg !important
}
p {
  @apply text-sm !important
}
</style>
