<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import emptyCircle from '../../../assets/icons/empty-circle.svg'
import warning from '../../../assets/icons/warning.svg'
import tick from '../../../assets/icons/tick.svg'
import router from '../../../src-qa/router/router'
import { useLabStore } from '@renderer/src-setup/store/labStore'
import { storeToRefs } from 'pinia'
import GenericPopup from '@renderer/src-setup/views/generic/GenericPopup.vue'

const props = defineProps({
  target: {
    type: String,
    required: true
  },
  completion: {
    type: Object,
    required: false
  }
})

const labStore = useLabStore()
const { currentlyEditingAppliance } = storeToRefs(labStore)
const navConfirmationModal = ref(false)

const active = computed(() => {
  const name = useRoute().name // current path
  const path = props.target.replace('/', '') // check it's this

  if (name === path) {
    return true
  } else return false
})

const customNavigationFunction = (target): void => {
  if (currentlyEditingAppliance.value) {
    navConfirmationModal.value = true
  } else {
    router.push(target)
  }
}

const handleClickConfirm = (target): void => {
  currentlyEditingAppliance.value = false
  navConfirmationModal.value = false
  router.push(target)
}
const handleClickCancel = (): void => {
  navConfirmationModal.value = false
}
</script>
<template>
  <div v-if="navConfirmationModal">
    <GenericPopup>
      <template #popupText>
        <p>You are editing an appliance, are you sure you wanted to leave?</p>
        <p>Your changes might not be saved. Click cancel or outside the dialog to cancel</p>
      </template>
      <template #buttonsRow>
        <button
            class="p-2 mx-4 w-24 bg-primary text-white rounded-lg"
            @click="handleClickConfirm(props.target)"
        >
          Confirm
        </button>
        <button
            class="p-2 mx-4 w-24 border-2 rounded-lg border-red-500 text-red-500"
            @click="handleClickCancel"
        >
          Cancel
        </button>
      </template>
    </GenericPopup>
  </div>
  <button
      class="hover:no-underline cursor-pointer font-medium border-0 border-transparent focus:border-0"
      @click="customNavigationFunction(props.target)"
  >
    <div
        class="nav-items-container m-5 text-black items-center rounded-full"
        :class="active ? 'nav-icons-active' : ''"
    >
      <div class="nav-icons drop-shadow-xl p-1 rounded-lg mr-4" :class="active ? '' : ''">
        <img
            v-if="!completion"
            class="w-6 h-6 stroke-inactive fill-inactive shrink-0 max-w-none"
            :src="emptyCircle"
            alt="icon denoting empty state"
        />
        <img
            v-else-if="!completion.valid && completion.count > 0"
            class="w-6 h-6 stroke-inactive fill-inactive shrink-0 max-w-none"
            :src="warning"
            alt="warning icon"
        />
        <img
            v-else-if="completion.valid && completion.count > 0"
            class="w-6 h-6 stroke-inactive fill-inactive shrink-0 max-w-none"
            :src="tick"
            alt="tick icon"
        />
        <img
            v-else
            class="w-6 h-6 stroke-inactive fill-inactive shrink-0 max-w-none"
            :src="emptyCircle"
            alt="icon denoting empty state"
        />
      </div>
      <slot></slot>
    </div>
  </button>
</template>

<style scoped>
.nav-items-container:hover {
  box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2);
}
</style>
