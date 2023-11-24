<script setup lang="ts">
import Modal from "./Modal.vue";
import { computed, ref } from "vue";
import { CheckGuideItem } from "../interfaces/_routeItems";
import vernMatrix from '../../assets/images/vern-matrix.png';

const props = defineProps({
  guides: {
    type: Array<{[key: string], guide: Array<CheckGuideItem>}>,
    required: true
  }
});

const showModal = ref(false);
const currentPage = ref(0)
const nextPage = () => {
  if (selectedGuide.value?.guide && currentPage.value < selectedGuide.value.guide.length - 1) {
    currentPage.value += 1;
  }
}

const backPage = () => {
  if (selectedGuide.value?.guide && currentPage.value > 0) {
    currentPage.value -= 1;
  }
}

const selectPage = (index) => {
  if (selectedGuide.value?.guide && index === selectedGuide.value.guide.length - 1) {
    currentPage.value = index;
  }
}

//@ts-ignore
const selectedGuideKey = ref<string | null>(null);
const selectedGuide = computed(() => {
  if (props.guides.length === 1) {
    return props.guides[0]
  }
  if (selectedGuideKey.value === null) {
    return null
  }

  return props.guides.find(element => element.key === selectedGuideKey.value)
});

const selectGuide = (name: string | null) => {
  selectedGuideKey.value = name
  currentPage.value = 0
}

const openModal = () => {
  selectedGuideKey.value = null
  showModal.value = true;
  currentPage.value = 0
}

const closeModal = () => {
  showModal.value = false;
  currentPage.value = 0
}

const imageSrc = computed(() => {
  if (selectedGuide.value === null || selectedGuide.value === undefined) {
    return null
  }
  if (selectedGuide.value.guide[currentPage.value].imageSource) {
    return selectedGuide.value.guide[currentPage.value].imageSource
  }
  return null
});

defineExpose({
  openModal
});
</script>

<template>

  <button class="w-20 h-10 flex justify-center items-center border-[1px]
               border-gray-500 rounded-lg cursor-pointer hover:bg-gray-200"
          @click="openModal"
  >
    <img class="w-5 h-5 mr-1" src="../../assets/icons/help-circle.svg" alt="question mark">
    <span class="text-sm font-semibold">
      Guide
    </span>
  </button>

  <Teleport to="body">
    <Modal :show="showModal" @close="closeModal">
      <template v-slot:header>
        <header class="h-20 px-6 w-108 bg-white flex items-center rounded-t-lg" :class="guides.length > 1 && selectedGuide ? 'justify-between' : 'justify-end'">
          <img v-if="guides.length > 1 && selectedGuide" v-on:click="() => { selectGuide(null) }" class="cursor-pointer" alt="back icon" src="../../assets/icons/back.svg"/>
          <span v-if="guides.length > 1 && selectedGuide" class="text-lg font-bold text-black">{{ selectedGuideKey }}</span>
          <img v-on:click="showModal = false" class="cursor-pointer" alt="close icon" src="../../assets/icons/close.svg"/>
        </header>
      </template>

      <template v-slot:content>
        <div class="px-6 w-[400px] bg-white pb-7 flex flex-col items-center">
          <div v-if="selectedGuide" class="flex flex-col w-108 items-center">

            <img v-if="imageSrc" class="h-auto w-[300px] object-contain" :src="imageSrc" alt="content"/>
            <div v-else class="flex w-full justify-center items-center">
              <img class="h-32 w-32 object-contain" :src="vernMatrix" alt="vern matrix"/>
            </div>
            <div class="flex flex-col items-center mt-4 w-80 rendered-text"
                 v-html="selectedGuide.guide[currentPage].text"/>
          </div>
          <div v-else class="flex flex-col justify-center items-center">
            <div class="bg-gray-100 rounded-full p-2">
              <img src="../../assets/icons/question-mark.svg" class="h-full w-full">
            </div>
            <h3 class="text-black text-lg font-semibold">Multiple guides available</h3>
            <p class="text-gray-700">Please select which guide you would like to view.</p>

            <button class="flex flex-col border-gray-400 border-2 w-full rounded-lg p-4 items-center font-lg font-bold text-gray-700 mt-4 drop-shadow-md" v-for="guide in guides" :key="guide['key']" @click="() => { selectGuide(guide['key']) }">
              <span class="cursor-pointer">{{ guide.key }}</span>
            </button>
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <footer class="w-full py-2 text-right flex flex-col bg-white rounded-b-lg px-6 pb-6">

          <div class="flex flex-row justify-center" v-if="selectedGuide && selectedGuide.guide.length > 1">
            <div v-for="index in selectedGuide.guide.length" :key="index" class="first:-ml-2 last:-mr-2">
              <button class="w-3 h-3 rounded-full mx-2 cursor-pointer"
                      :class="currentPage === index - 1 ? 'bg-blue-700' : 'bg-gray-200'"
                      @click="() => { selectPage(index - 1) }"/>
            </div>
          </div>
          <div class="flex flex-row w-full mt-8" v-if="selectedGuide && selectedGuide.guide.length > 1">
            <button class="w-1/2 h-11 mr-3 text-gray-800 font-semibold text-base border-2 border-gray-300 rounded-lg hover:bg-gray-200 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                    :disabled="currentPage < 1"
                    v-on:click="backPage"
            >Back</button>

            <button class="w-1/2 h-11 text-white font-semibold text-base rounded-lg bg-blue-700 disabled:bg-blue-300 cursor-pointer disabled:cursor-not-allowed"
                    :disabled="currentPage >= (selectedGuide.guide.length - 1)"
                    v-on:click="nextPage"
            >Next</button>
          </div>
        </footer>
      </template>
    </Modal>
  </Teleport>
</template>
