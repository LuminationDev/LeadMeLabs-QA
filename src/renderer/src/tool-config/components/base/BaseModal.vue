<script setup lang="ts">
import { useConfigStore } from '../../store/configStore'
import { onMounted } from 'vue'

const configStore = useConfigStore()
const { clearErrorMessage, clearSystemMessage } = configStore

const props = defineProps({
    type: {
        type: String,
        required: true
    }
})

const closeModal = (): void => {
    if (props.type == 'error') {
        clearErrorMessage(0)
    } else if (props.type == 'system') {
        clearSystemMessage(0)
    }
}
onMounted(() => {
    setTimeout(closeModal, 3000)
})
</script>
<template>
    <div
        class="w-auto h-auto p-2 rounded-lg flex justify-between hover:cursor-pointer text-sm mb-2"
        :class="{
            'bg-red-100 hover:bg-amber-100': type === 'error',
            'bg-secondary text-white hover:bg-contrast': type === 'system'
        }"
        @click="closeModal"
    >
        <slot></slot>
    </div>
</template>
