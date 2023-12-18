<script setup lang="ts">
import UploadImage from "@renderer/src-qa/components/Report/Submission/UploadImage.vue";
</script>

<template>
  <div class="flex flex-col text-sm mt-4">
    <p class="font-semibold mb-1">Attach images</p>
    <p>Add photos and videos to add further context to your test</p>
    <UploadImage/>

    <p class="font-semibold mt-8 mb-1">Leave a Comment</p>
    <p>Add photos and videos to add further context to your test</p>

    <textarea placeholder="Enter a comment..." type="text" class="p-2 h-56 mt-4 border border-gray-300 rounded-lg resize-none"/>
  </div>
</template>
