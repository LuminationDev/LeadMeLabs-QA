<script setup lang="ts">
import { useStateStore } from "../../../store/stateStore";
import { computed, ref } from "vue";
import { Comment } from "../../../interfaces/_report";
import CommentInfo from "../../../modals/CommentInfo.vue";
import GenericButton from "../../../src-setup/components/GenericButton.vue";

const stateStore = useStateStore();
const tempStore = stateStore.getStore;

const comment = ref('')

const addComment = (commentText: string) => {
  if (!tempStore.reportTracker.comments) {
    tempStore.reportTracker.comments = []
  }
  tempStore.reportTracker.comments.push({ date: stateStore.formattedDate(true), content: commentText })
  comment.value = ''
}

const deleteComment = (index: number) => {
  if (!tempStore.reportTracker.comments) {
    return
  }
  tempStore.reportTracker.comments.splice(index, 1)
}

const currentComments = computed((): Comment[] => {
  return tempStore.reportTracker.comments ?? [];
});
</script>

<template>
  <div class="flex flex-col text-sm">
    <p class="font-semibold mb-1">Leave a Comment</p>

    <textarea placeholder="Enter a comment..."
              type="text"
              v-model="comment"
              class="p-2 h-56 mt-4 border border-gray-300 rounded-lg resize-none"/>

    <div class="flex flex-row justify-end mt-4">
      <GenericButton :callback="() => {addComment(comment)}" type="light-blue">Save</GenericButton>
    </div>
    <div v-if="tempStore.reportTracker.comments" class="flex flex-col w-full">
      Comments:
      <CommentInfo
          v-for="(comment, index) in tempStore.reportTracker.comments"
          :comment="comment"
          :index="index"
          :key="comment.content"
          @deleteComment="deleteComment"
      />
    </div>
  </div>
</template>
