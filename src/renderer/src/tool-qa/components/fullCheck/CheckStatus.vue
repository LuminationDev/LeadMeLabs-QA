<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps(['checking']);

const titleMap = {
  testing: 'Testing...',
  error: 'Error',
  done: 'Done',
};
const getTitle = () => titleMap[props.checking] || '';

const classMap = {
  testing: 'text-blue-600',
  error: 'text-red-600',
  done: 'text-green-700',
};
const getTextColor = () => classMap[props.checking] || '';

const descriptionMap = {
  testing: 'Running automated QA checks.',
  error: 'An unexpected error has occurred.',
  done: 'Automated tests have been completed.',
};
const getDescription = () => descriptionMap[props.checking] || '';
</script>

<template>
  <div
      class="flex flex-row w-full h-20 border-collapse rounded-lg border-[1px]"
      :class="{
      'bg-blue-50 border-blue-400': checking === 'testing',
      'bg-red-50 border-red-400': checking === 'error',
      'bg-green-50 border-green-500': checking === 'done',
    }"
  >
    <div class="flex flex-col p-2">
      <img v-if="checking === 'testing'" src="../../../assets/icons/checking-testing.svg" :alt="`${checking} icon`" />
      <img v-else-if="checking === 'error'" src="../../../assets/icons/checking-error.svg" :alt="`${checking} icon`" />
      <img v-else-if="checking === 'done'" src="../../../assets/icons/checking-done.svg" :alt="`${checking} icon`" />
    </div>

    <div class="flex flex-col p-2 justify-center">
      <div class="font-semibold" :class="getTextColor()">
        {{ getTitle() }}
      </div>

      <div :class="getTextColor()">
        {{ getDescription() }}
      </div>
    </div>
  </div>
</template>