<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-row justify-between items-center w-full">
      <div class="bg-blue-200 border-1 border-blue-400 text-blue-700 rounded-full h-5 font-semibold text-sm px-2">
        <slot name="step">Step 0</slot>
      </div>
      <button class="w-20 h-10 flex justify-center items-center border-[1px]
               border-gray-500 rounded-lg cursor-pointer hover:bg-gray-200"
      >
        <img class="w-5 h-5 mr-1" src="../../assets/icons/help-circle.svg" alt="question mark">
        <span class="text-sm font-semibold">
          Guide
        </span>
      </button>
    </div>

    <div>
      <slot name="heading">This is the section heading</slot>
    </div>

    <div>
      <slot name="subheading">This is the section subheading</slot>
    </div>

    <div>
      <slot name="body">This massive section is where all of the content goes</slot>
    </div>

  </div>
</template>
