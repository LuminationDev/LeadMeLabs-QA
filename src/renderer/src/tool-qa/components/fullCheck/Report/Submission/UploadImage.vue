<script setup lang="ts">
import { ref } from 'vue';

const isDragging = ref(false);
const previewImage = ref('');

const handleFileUpload = (event) => {
  previewImage.value = URL.createObjectURL(event.target.files[0]);
};

const handleDragOver = () => {
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = () => {
  isDragging.value = false;
};
</script>

<template>
  <div class="h-32 mt-4">
    <div class="flex justify-center items-center drag-box w-full h-full relative text-center
                leading-95 text-gray-700 border border-gray-300 rounded-lg"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
    >
      <div class="flex flex-col items-center text-xs transition-transform" :class="{ 'transform scale-105': isDragging }">
        <img class="w-10 mb-2" alt="comment icon" src="../../../../../assets/icons/report-upload.svg"/>

        <div class="flex flex-row">
          <label for="uploadFile" class="font-semibold cursor-pointer text-blue-500 z-[1] hover:text-blue-300">Click to upload</label>
          <p class="ml-1 mb-1">or drag and drop</p>
        </div>

        <p>PNG, JGP or MP4 (max. (x)Mb)</p>
      </div>
      <input
          type="file"
          @change="handleFileUpload"
          id="uploadFile"
          class="absolute inset-0 opacity-0"
      />
    </div>
  </div>
  <div id="preview" class="text-center">
    <img :src="previewImage" alt="Preview" v-if="previewImage" style="max-width: 100%" />
  </div>
</template>
