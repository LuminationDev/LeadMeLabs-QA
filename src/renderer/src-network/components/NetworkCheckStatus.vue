<script setup lang="ts">
import { defineProps } from 'vue';
import { useStateStore } from "../../store/stateStore";
import RetrySvg from "../../assets/icons/RetrySvg.vue";

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

const classMap = {
  testing: 'text-blue-600',
  error: 'text-red-600',
  done: 'text-green-700',
};
const getTextColor = () => classMap[props.checking] || '';

const descriptionMap = {
  testing: 'Running automated tests.',
  error: 'An unexpected error has occurred.',
  done: 'Automated tests have been completed.'
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
      'bg-gray-50 border-gray-300': checking === 'caution',
      'bg-blue-50 border-blue-400': checking === 'testing',
      'bg-red-50 border-red-400': checking === 'error',
      'bg-green-50 border-green-500': checking === 'done',
    }"
  >
    <div>
      <div class="flex flex-col p-2">
        <img v-if="checking === 'caution'" src="../../assets/icons/checking-caution.svg" :alt="`${checking} icon`" />
        <img v-else-if="checking === 'testing'" src="../../assets/icons/checking-testing.svg" :alt="`${checking} icon`" />
        <img v-else-if="checking === 'error'" src="../../assets/icons/checking-error.svg" :alt="`${checking} icon`" />
        <img v-else-if="checking === 'done'" src="../../assets/icons/checking-done.svg" :alt="`${checking} icon`" />
      </div>

      <div class="flex flex-col p-2 justify-center">
        <div class="font-semibold" :class="getTextColor()">
          {{ useStateStore().capitalizeFirstLetter(checking) }}
        </div>

        <div v-if="checking !== 'caution'" :class="getTextColor()">
          {{ getDescription() }}
        </div>
        <div v-else class="text-xs">
          <p>Please <span class="font-semibold">do not close</span> this program or restart your device while checks are running.
          Also, please be prepared to allow <span class="font-semibold">two admin permissions</span>. Network checks will take approx. 2 minutes.</p>
        </div>

      </div>
    </div>

    <div v-if="callback !== undefined && checking !== 'testing' && checking !== 'sign_in'" class="flex items-center">
      <div v-if="checking === 'caution'"  @click="attemptCallback"
           class="flex mr-2 items-center justify-center bg-blue-500 h-8 w-28 rounded-lg
           text-white text-xs hover:cursor-pointer hover:bg-blue-300"
      >
        <img class="h-5 w-5 mr-2" src="../../assets/icons/play-circle.svg" alt="play"/>
        Run checks
      </div>

      <div v-else @click="attemptCallback"
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
  </div>
</template>
