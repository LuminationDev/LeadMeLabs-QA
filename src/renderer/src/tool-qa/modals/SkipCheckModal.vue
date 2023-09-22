<script setup lang="ts">
import Modal from "./Modal.vue";
import { computed, ref } from "vue";
import {useRoute} from "vue-router";
import {useFullStore} from "@renderer/tool-qa/store/fullStore";

defineExpose({
  openModal
});

const props = defineProps({
  callback: {
    type: Function,
    required: true
  }
});

const fullStore = useFullStore();
const showModal = ref(false);
const comment = ref("");
const noComment = ref(false);

function openModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

const skip = () => {
  //Save the message
  const key = route.meta['trackerName'];
  if(key !== undefined && comment.value.length > 0) {
    fullStore.reportTracker[key]['comment'] = comment.value;
  }

  closeModal();
  props.callback();
  noComment.value = false; //Reset for next time
}

const canConfirm = computed(() => {
  return comment.value.length > 0 || noComment.value;
});

const route = useRoute();
</script>

<template>
  <Teleport to="body">
    <Modal :show="showModal" @close="closeModal">
      <template v-slot:header>
        <header class="h-20 px-4 w-96 bg-white flex justify-between items-center rounded-t-lg">
            <img alt="skip icon" src="../../assets/icons/skip.svg"/>

            <img v-on:click="showModal = false" class="cursor-pointer" alt="skip icon" src="../../assets/icons/close.svg"/>
        </header>
      </template>

      <template v-slot:content>
        <div class="px-6 w-96 bg-white pb-7 flex flex-col">
          <span class="text-lg font-semibold text-black mb-2">Skip Check?</span>

          <div class="text-sm">
            Are you sure you want to skip this check? If so, Please leave a comment and proceed.
          </div>

          <div class="flex flex-col my-4">
            <div class="mb-2 text-sm font-semibold">
              Comment
            </div>
            <input v-model="comment"
                   class="h-10 border-2 border-gray-200 rounded-lg px-2"
                   placeholder="e.g. Unable to access Bitwarden"/>
          </div>

          <div class="flex flex-row items-center">
            <input v-model="noComment" class="w-4 h-4 mr-2" id="noComment" type="checkbox">
            <label class="text-sm font-semibold cursor-pointer" for="noComment">Continue without comment</label>
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <footer class="w-full py-2 text-right flex flex-row bg-white rounded-b-lg px-6 pb-6">

          <button class="w-1/2 h-11 mr-3 text-gray-800 font-semibold text-base border-2 border-gray-300 rounded-lg hover:bg-gray-200 font-medium"
                  v-on:click="showModal = false"
          >Cancel</button>

          <button class="w-1/2 h-11 text-white font-semibold text-base rounded-lg font-medium"
                  :class="{
                    'bg-blue-600 hover:bg-blue-300': canConfirm,
                    'bg-blue-300': !canConfirm,
                  }"
                  :disabled="!canConfirm"
                  v-on:click="skip()"
          >Confirm</button>
        </footer>
      </template>
    </Modal>
  </Teleport>
</template>
