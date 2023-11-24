<script setup lang="ts">
import { defineProps } from 'vue';
import RetrySvg from "../../../../assets/icons/RetrySvg.vue";

const props = defineProps({
  checking: {
    type: String,
    required: true
  },
  callback: {
    type: Function,
    required: false
  },
  message: {
    type: String,
    required: false
  }
});

const titleMap = {
  testing: 'Testing...',
  error: 'Error',
  error_cbus: 'C-Bus not connected',
  sign_in: 'You are offline',
  done: 'Done',
  uploading: 'Uploading report',
  submitted: 'Successfully uploaded',
};
const getTitle = () => titleMap[props.checking] || '';

const classMap = {
  testing: 'text-blue-600',
  uploading: 'text-blue-600',
  error: 'text-red-600',
  error_cbus: 'text-red-600',
  sign_in: 'text-red-600',
  done: 'text-green-700',
  submitted: 'text-green-700',
};
const getTextColor = () => classMap[props.checking] || '';

const descriptionMap = {
  testing: 'Running automated QA checks.',
  uploading: 'Your report is currently being uploaded to the cloud.',
  error: 'An unexpected error has occurred.',
  error_cbus: 'The NUC is unable to establish connection to the C-Bus.',
  sign_in: 'Your report could not be saved to the cloud.',
  done: 'Automated tests have been completed.',
  submitted: 'Your test report has been uploaded to the cloud.',
};
const getDescription = () => descriptionMap[props.checking] || '';

const attemptCallback = () => {
  if (props.callback !== undefined) {
    props.callback();
  }
}
</script>

<template>
  <div
    class="flex flex-row justify-between w-full h-20 border-collapse rounded-lg border-[1px]"
    :class="{
      'bg-blue-50 border-blue-400': checking === 'testing' || checking === 'uploading',
      'bg-red-50 border-red-400': checking === 'error' || checking === 'error_cbus' || checking === 'sign_in',
      'bg-green-50 border-green-500': checking === 'done' || checking === 'submitted',
    }"
  >
    <div>
      <div class="flex flex-col p-2">
        <img v-if="checking === 'testing' || checking === 'uploading'" src="../../../../assets/icons/checking-testing.svg" :alt="`${checking} icon`" />
        <img v-else-if="checking === 'error' || checking === 'error_cbus' || checking === 'sign_in'" src="../../../../assets/icons/checking-error.svg" :alt="`${checking} icon`" />
        <img v-else-if="checking === 'done' || checking === 'submitted'" src="../../../../assets/icons/checking-done.svg" :alt="`${checking} icon`" />
      </div>

      <div class="flex flex-col p-2 justify-center">
        <div class="font-semibold" :class="getTextColor()">
          {{ getTitle() }}
        </div>

        <div :class="getTextColor()">
          {{ message ?? getDescription() }}
        </div>
      </div>
    </div>

    <div v-if="callback !== undefined && checking !== 'testing' && checking !== 'sign_in'" @click="attemptCallback"
         class="flex flex-row mr-4 cursor-pointer items-center hover:opacity-60">
      <RetrySvg :fill="checking.includes('error') ? '#B42318' : '#067647'" class="w-5 mr-1.5"/>
      <div class="font-semibold" :class="{
        'text-[#B42318]': checking.includes('error'),
        'text-[#067647]': !checking.includes('error')
      }">
        Test again
      </div>
    </div>
  </div>
</template>