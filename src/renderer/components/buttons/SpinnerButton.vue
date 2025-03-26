<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  callback: {
    type: Function,
    required: true
  },
});

const onClick = () => {
  if (props.state !== 'loading') {
    props.callback();
  }
}
</script>

<template>
  <div class="flex items-center justify-center px-2 h-10 rounded-lg"
       @click="onClick"
       :class="{
         'bg-blue-300 cursor-not-allowed': state === 'loading',
         'bg-blue-500 hover:bg-blue-300 hover:cursor-pointer': state !== 'loading'
       }">

    <div class="text-white text-sm" :class="{'mr-3': state === 'loading'}">
      {{text}}
    </div>

    <div class="w-6 h-6 mr-2" v-if="state === 'loading'">
      <svg class="w-full h-full" fill="white" width="24" height="24" viewBox="0 0 24 24"
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
