<script setup lang="ts">
import { ref } from 'vue'
import Spinner from '../loading/CircleSpinner.vue'
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
}
const asyncCall = (): Promise<void> => {
  return new Promise((resolve) => {
    resolve(props.callback())
  }).then(() => {spinner.value = false});
}
</script>

<template>
  <button
      :id="buttonId"
      :class="{
            'h-10 rounded-lg text-base': true,
            'w-32 bg-primary text-white mb-3 hover:bg-blue-400': type === 'primary',
            'w-32 text-white bg-blue-700 disabled:bg-blue-200 hover:bg-blue-400': type === 'light-blue',
            'w-32 bg-primary text-white hover:bg-blue-400 font-semibold': type === 'secondary',
            'w-32 bg-white border-2 border-primary hover:bg-primary hover:text-white text-primary':
                type === 'white',
            'w-20 bg-white border-gray-300 border-2 hover:bg-gray-100 text-gray-800 font-semibold disabled:bg-gray-200 disabled:text-black':
                type === 'light',
            'w-20 bg-white hover:text-gray-400 text-gray-800 font-semibold disabled:text-gray-400':
                type === 'text',
              'w-20 bg-white text-blue-600 font-semibold disabled:text-gray-400':
                type === 'active-text',
            'bg-blue-600 hover:bg-blue-400 disabled:bg-gray-200 disabled:text-gray-500 text-white font-semibold disabled:hover:bg-gray-300 disabled:cursor-not-allowed':
                type === 'blue',
            'w-36 bg-blue-50 border-blue-200 border-2 hover:bg-gray-50 text-blue-700 font-semibold disabled:bg-gray-200 disabled:text-black':
                type === 'transparent',
            'bg-white border-slate-800 border-2 hover:bg-gray-100 text-slate-800 font-semibold':
                type === 'preview',
            'bg-slate-500 disabled:hover:bg-slate-500 cursor-not-allowed': disabled,
            'w-4 h-4 bg-primary rounded-full': type === 'icon'
        }"
      class="p-2 flex justify-center items-center"
      :disabled="disabled"
      @click="onClick()"
  >
    <Spinner v-if="spinner"/>
    <slot v-else />
  </button>
</template>
