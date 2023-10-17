<script setup lang="ts">
import { ref } from 'vue'
import CircleSpinner from "@renderer/tool-qa/components/_generic/loading/CircleSpinner.vue";

const spinner = ref(false)
const props = defineProps({
  type: {
    type: String,
    required: false
  },
  callback: {
    type: Function,
    required: true
  },
  disabled: {
    type: Boolean,
    required: false
  },
  customClass: {
    type: String,
    required: false,
    default: ''
  },
  buttonId: {
    type: String,
    required: false,
    default: 'button'
  }
})
const onClick = async (): Promise<void> => {
  spinner.value = true;
  await asyncCall()
  spinner.value = false;
}

const asyncCall = (): Promise<void> => {
  return new Promise((resolve) => {
    resolve(props.callback())
  }).then()
}
</script>
<template>
  <button
    :id="buttonId"
    :class="{
      'rounded-lg text-base': true,
      'w-32 text-white bg-primary mb-3 hover:bg-blue-400': type === 'primary',
      'w-32 text-white bg-blue-700 disabled:bg-blue-200 hover:bg-blue-400': type === 'light-blue',
      'w-32 text-white bg-primary hover:bg-blue-400 font-semibold': type === 'secondary',
      'w-32 border-2 border-primary hover:bg-primary hover:text-white text-primary':
          type === 'white',
      'w-32 bg-white border-gray-200 disabled:bg-gray-200 disabled:text-black border-2 hover:bg-gray-100 text-blue-500 font-semibold':
          type === 'light',
      'bg-white border-slate-800 border-2 hover:bg-gray-100 text-slate-800 font-semibold':
          type === 'preview',
      'bg-slate-500 disabled:hover:bg-slate-500 cursor-not-allowed': disabled,
      'w-4 h-4 bg-primary rounded-full': type === 'icon'
    }"
    class="p-2 h-10 flex justify-center items-center"
    :disabled="disabled"
    @click="onClick()"
  >
    <CircleSpinner class="h-32" v-if="spinner" />
    <slot v-else />
  </button>
</template>
