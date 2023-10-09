<script setup lang="ts">
import Modal from "./Modal.vue";
import GenericButton from "@renderer/tool-qa/components/_generic/buttons/GenericButton.vue";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useFullStore } from "@renderer/tool-qa/store/fullStore";
import { Comment } from "@renderer/tool-qa/interfaces/_reportCheck";

defineExpose({
  openModal
});

const props = defineProps({
  mode: {
    type: String,
    required: false,
    default: "button"
  },
  currentComments: {
    type: Array as () => Comment[],
    required: false,
    default: []
  },
  callback: {
    type: Function,
    required: true
  }
});

const fullStore = useFullStore();
const showModal = ref(false);
const comment = ref("");

function openModal() {
  // comment.value = props.currentComment;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

const addComment = () => {
  //Save the message
  if (comment.value.length > 0) {
    props.callback(comment.value);
  }

  closeModal();
  comment.value = "";
}

const canConfirm = computed(() => {
  return comment.value.length > 0;
});

const route = useRoute();
</script>

<template>
  <GenericButton v-if="mode === 'button'" class="mr-4" type="transparent" :callback="openModal"
  >Add Comment
  </GenericButton>

  <img v-else-if="mode === 'icon-empty'" v-on:click="openModal" class="cursor-pointer" src="../../assets/icons/comment-empty.svg" alt="comment"/>

  <div v-else-if="mode === 'icon'" v-on:click="openModal" class="relative">
    <span class="w-2.5 cursor-pointer text-center text-xs font-semibold text-blue-700 absolute left-[4px] top-0.5">{{currentComments.length}}</span>
    <img class="cursor-pointer" src="../../assets/icons/comment.svg" alt="comment"/>
  </div>


  <Teleport to="body">
    <Modal :show="showModal" @close="closeModal">
      <template v-slot:header>
        <header class="h-20 px-4 w-96 bg-white flex justify-between items-center rounded-t-lg">
            <img alt="comment icon" src="../../assets/icons/comment-title.svg"/>

            <img v-on:click="showModal = false" class="cursor-pointer" alt="skip icon" src="../../assets/icons/close.svg"/>
        </header>
      </template>

      <template v-slot:content>
        <div class="px-6 w-96 bg-white pb-7 flex flex-col">
          <span class="text-lg font-semibold text-black mb-2">Add comment?</span>

          <div class="text-sm">
            Please leave a comment.
          </div>

          <div class="flex flex-col mt-4" v-for="comment in currentComments">
            <div class="text-xs mb-1">
              {{ comment.date }}
            </div>
            <div class="bg-blue-500 text-white text-sm font-light p-2 rounded-b-lg rounded-tr-lg">
              {{ comment.content }}
            </div>
          </div>

          <div class="flex flex-col mt-6">
            <div class="mb-2 text-sm font-semibold">
              Comment
            </div>
            <input v-model="comment"
                   class="h-10 border-2 border-gray-200 rounded-lg px-2"
                   placeholder="e.g. Unable to access Bitwarden"/>
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <footer class="w-full py-2 text-right flex flex-row bg-white rounded-b-lg px-6 pb-6">

          <button class="w-1/2 h-11 mr-3 text-gray-800 font-semibold text-base border-2 border-gray-300 rounded-lg hover:bg-gray-200"
                  v-on:click="showModal = false"
          >Cancel</button>

          <button class="w-1/2 h-11 text-white font-semibold text-base rounded-lg"
                  :class="{
                    'bg-blue-600 hover:bg-blue-300': canConfirm,
                    'bg-blue-300': !canConfirm,
                  }"
                  :disabled="!canConfirm"
                  v-on:click="addComment()"
          >Confirm</button>
        </footer>
      </template>
    </Modal>
  </Teleport>
</template>
