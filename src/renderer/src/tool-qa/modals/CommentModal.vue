<script setup lang="ts">
import Modal from "./Modal.vue";
import GenericButton from "@renderer/tool-qa/components/_generic/buttons/GenericButton.vue";
import CommentInfo from "@renderer/tool-qa/modals/CommentInfo.vue";
import { computed, ref } from "vue";
import { Comment } from "@renderer/tool-qa/interfaces/_report";
import AddCommentSvg from "@renderer/assets/icons/AddCommentSvg.vue";

defineExpose({
  openModal
});

const props = defineProps({
  mode: {
    type: String,
    required: false,
    default: "button"
  },
  title: {
    type: String,
    required: false,
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

const showModal = ref(false);
const comment = ref("");

function openModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

const inputRef = ref<HTMLTextAreaElement | null>(null);
const minHeight = 48;  // Minimum height for the textarea
const maxHeight = 200;  // Maximum height for the textarea

const updateTextareaHeight = () => {
  if (inputRef.value !== null) {
    const lineHeight = parseInt(window.getComputedStyle(inputRef.value).lineHeight, 10);
    const numLines = Math.floor((inputRef.value.scrollHeight - 20) / lineHeight);
    let newHeight;

    if (numLines > 1) {
      newHeight = Math.min(maxHeight, Math.max(minHeight, inputRef.value.scrollHeight));
    } else {
      newHeight = Math.min(maxHeight, Math.max(minHeight, inputRef.value.scrollHeight - 18));
    }

    inputRef.value.style.height = 'auto';  // Reset height to auto
    inputRef.value.style.height = `${newHeight}px`;  // Set new height
  }
};

const addComment = () => {
  //Save the message
  if (comment.value.length > 0) {
    props.callback(comment.value);
  }

  comment.value = "";
}

const deleteComment = (index: number) => {
  props.currentComments.splice(index, 1);
}

const modalTitle = computed(() => {
  if(props.title === undefined) {
    return "Please leave a comment.";
  } else {
    return `Leave a comment attached to '${props.title}'.`;
  }
});

const canConfirm = computed(() => {
  return comment.value.length > 0;
});
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
          <span class="text-lg font-semibold text-black mb-2">Comments</span>

          <div class="text-sm">
            {{modalTitle}}
          </div>

          <CommentInfo v-for="(comment, index) in currentComments" @deleteComment="deleteComment" :index="index" :comment="comment"/>

          <hr class="my-4">
          <div class="flex flex-col relative">
            <textarea v-model="comment" ref="inputRef" @input="updateTextareaHeight"
                   class="border-2 border-gray-200 rounded-lg"
                   placeholder="Add a comment"/>

            <AddCommentSvg @click="addComment" fill="#1570EF" class="absolute cursor-pointer right-2 bottom-2.5 hover:opacity-60"/>
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <footer class="w-full py-2 text-right flex flex-row bg-white rounded-b-lg px-6 pb-6">
          <button class="w-1/2 h-11 mr-3 text-gray-800 font-semibold text-base border-2 border-gray-300 rounded-lg hover:bg-gray-200"
                  v-on:click="showModal = false"
          >Back</button>

          <button class="w-1/2 h-11 text-white font-semibold text-base rounded-lg"
                  :class="{
                    'bg-blue-600 hover:bg-blue-300': canConfirm,
                    'bg-blue-300': !canConfirm,
                  }"
                  :disabled="!canConfirm"
                  v-on:click="closeModal"
          >Done</button>
        </footer>
      </template>
    </Modal>
  </Teleport>
</template>

<style scoped>
textarea {
  width: 100%;
  padding: 10px 24px 10px 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  resize: none;
  overflow-y: auto;
  height: 48px; /* Initial height */
  min-height: 48px; /* Minimum height */
  max-height: 100px; /* Maximum height */
  line-height: 24px; /* Set the line height for accurate calculations */
}
</style>
