<script setup lang="ts">
import checkBgBlue from '../../assets/icons/check-bg-blue.svg'
import pendingProgress from '../../assets/icons/pending-progress.svg'
import pendingAction from '../../assets/icons/pending-action.svg'
import {ref} from "vue";

const props = defineProps({
  numberOfSections: {
    type: Number,
    required: true
  },
  currentSection: {
    type: Number,
    required: true
  }
});

const numberOfSectionsAway = ref(1)
const previousSection = ref(0)

function select(index) {
  numberOfSectionsAway.value = Math.abs(props.currentSection - index)
  previousSection.value = props.currentSection
  emit('select', index)
}

const emit = defineEmits<{
  (e: 'select', value: number): void
}>()

</script>

<template>
  <div class="h-full px-10 flex flex-col">
    <div class="flex flex-col justify-center items-center" v-for="(value, index) in numberOfSections" :key="index" @click="() => { select(index) }">
      <img v-if="index < currentSection" :src="checkBgBlue" />
      <img v-else-if="index === currentSection" :src="pendingProgress" />
      <img v-else-if="index > currentSection" :src="pendingAction" />
      <div v-if="index < (numberOfSections - 1)" class="w-1 h-20 vertical-bar rounded-full my-3" :class="{
        'vertical-bar--filled': currentSection > index,
        'vertical-bar--duration-50': numberOfSectionsAway === 1,
        'vertical-bar--duration-25': numberOfSectionsAway === 2,
        'vertical-bar--duration-17': numberOfSectionsAway === 3,
        'vertical-bar--delay-33': ((previousSection - index === 3) && numberOfSectionsAway === 3) || (previousSection - index === -2) && numberOfSectionsAway === 3,
        'vertical-bar--delay-17': ((previousSection - index === 2) && numberOfSectionsAway === 3) || (previousSection - index === -1) && numberOfSectionsAway === 3,
        'vertical-bar--delay-25': ((previousSection - index === 2) && numberOfSectionsAway === 2) || ((previousSection - index === -1) && numberOfSectionsAway === 2)
      }"></div>
    </div>
  </div>
</template>

<style>
.vertical-bar {
  background: #B9C0D4;
  background: linear-gradient(to top, #B9C0D4 50%, #1570EF 50%);
  background-size: 100% 200%;
  background-position:left bottom;
  transition:all 0.5s ease;
}
.vertical-bar--filled {
  background-position:left top;
}

.vertical-bar--duration-50 {
  transition-duration: 0.5s;
}

.vertical-bar--delay-33 {
  transition-delay: 0.33s;
}

.vertical-bar--duration-25 {
  transition-duration: 0.25s;
}
.vertical-bar--delay-25 {
  transition-delay: 0.25s;
}

.vertical-bar--duration-17 {
  transition-duration: 0.17s;
}
.vertical-bar--delay-17 {
  transition-delay: 0.17s;
}
</style>
