<script setup lang="ts">
import {computed} from "vue";
import tick from '@renderer/assets/icons/tick.svg'
import error from '@renderer/assets/icons/error.svg'

const props = defineProps({
  state: {
    type: String,
    required: true
  },
  deviceName: {
    type: String,
    required: false
  }
})

const text = computed(() => {
  switch (props.state) {
    case 'loading':
      return 'Connecting to ' + (props.deviceName ? props.deviceName : 'device')
    case 'failed':
      return 'Connection attempt failed'
    case 'success':
      return 'Connected'
  }
  return 'Unknown state'
})

const colour = computed(() => {
  switch (props.state) {
    case 'loading':
      return 'text-blue-700'
    case 'failed':
      return 'text-red-600'
    case 'success':
      return 'text-emerald-600'
  }
  return 'text-gray-500'
})
</script>

<template>
  <div class="flex flex-row">
    <div class="w-6 h-6 mr-2">
      <img class="w-full h-full" v-if="state === 'success'" :src="tick"/>
      <img class="w-full h-full" v-if="state === 'failed'" :src="error"/>
      <svg class="w-full h-full" v-if="state === 'loading'" fill="#1D4ED8" width="24" height="24" viewBox="0 0 24 24"
           xmlns="http://www.w3.org/2000/svg">
        <g class="spinner_OSmW">
          <rect x="11" y="1" width="2" height="5" opacity=".14"/>
          <rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29"/>
          <rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43"/>
          <rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57"/>
          <rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71"/>
          <rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86"/>
          <rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)"/>
        </g>
      </svg>
    </div>

    <span v-if="state !== 'unstarted'" :class="colour">{{ text }}</span>
  </div>
</template>
<style>
.spinner_OSmW {
  transform-origin: center;
  animation: spinner_T6mA .75s step-end infinite
}

@keyframes spinner_T6mA {
  8.3% {
    transform: rotate(30deg)
  }
  16.6% {
    transform: rotate(60deg)
  }
  25% {
    transform: rotate(90deg)
  }
  33.3% {
    transform: rotate(120deg)
  }
  41.6% {
    transform: rotate(150deg)
  }
  50% {
    transform: rotate(180deg)
  }
  58.3% {
    transform: rotate(210deg)
  }
  66.6% {
    transform: rotate(240deg)
  }
  75% {
    transform: rotate(270deg)
  }
  83.3% {
    transform: rotate(300deg)
  }
  91.6% {
    transform: rotate(330deg)
  }
  100% {
    transform: rotate(360deg)
  }
}</style>