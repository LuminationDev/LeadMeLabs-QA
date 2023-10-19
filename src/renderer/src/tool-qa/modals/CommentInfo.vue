<script setup lang="ts">
import TrashSvg from "@renderer/assets/icons/TrashSvg.vue";
import PencilSvg from "@renderer/assets/icons/PencilSvg.vue";
import { Comment } from "@renderer/tool-qa/interfaces/_report";
import { ref, watchEffect } from "vue";
import CrossSvg from "@renderer/assets/icons/CrossSvg.vue";
import CheckSvg from "@renderer/assets/icons/CheckSvg.vue";

const editing = ref(false);
const inputRef = ref<HTMLTextAreaElement | null>(null);

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  comment: {
    type: Object as () => Comment,
    required: true
  }
});

const editComment = ref(props.comment.content);

const edit = () => {
  if(editing.value === false) {
    editing.value = true;
  }
}

/**
 * The user has finished editing, either update the underlying props.comment or revert back to the original.
 */
const finishEdit = (cancelled: boolean) => {
  if (!editing.value) return;

  if (cancelled) {
    editComment.value = props.comment.content;
  } else {
    props.comment.content = editComment.value;
  }

  editing.value = false;
}

watchEffect(() => {
  // Update inputRef when the input element is rendered
  if (editing.value) {
    inputRef.value = document.querySelector('textarea');
  }

  if (inputRef.value && editing.value === true) {
    inputRef.value.focus();
  }
});
</script>

<template>
  <div class="flex flex-col mt-4">
    <div class="flex flex-row items-center justify-between mb-1">
      <div class="text-xs mb-1">
        {{ comment.date }}
      </div>
      <div>
        <CheckSvg v-if="editing" @click="finishEdit(false)" class="w-4 h-4 mr-2 cursor-pointer hover:opacity-60" fill="#047857"/>
        <CrossSvg v-if="editing" @click="finishEdit(true)" class="w-4 h-4 mr-2 cursor-pointer hover:opacity-60" fill="#D92D20"/>
        <PencilSvg v-if="!editing" @click="edit" class="w-4 mr-2 cursor-pointer hover:opacity-60" fill="#475467"/>
        <TrashSvg @click="$emit('deleteComment', index)" class="w-4 cursor-pointer hover:opacity-60" fill="#475467"/>
      </div>
    </div>

    <textarea v-if="editing" ref="inputRef" v-model="editComment"
           class="break-all border border-blue-500 text-black text-sm font-light p-2 rounded-b-lg rounded-tr-lg"/>

    <div v-else class="break-all bg-blue-500 text-white text-sm font-light p-2 rounded-b-lg rounded-tr-lg">
      {{ comment.content }}
    </div>
  </div>
</template>
