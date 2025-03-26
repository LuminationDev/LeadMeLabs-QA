<script setup lang="ts">
import { computed, ref } from 'vue'
import GenericButton from '../../components/GenericButton.vue'
import { useConfigStore } from '../../store/configStore'
import { storeToRefs } from 'pinia'
import UploadFilesPopup from "../UploadFilesPopup.vue";
const configStore = useConfigStore()
const { showPreview } = storeToRefs(configStore)
const { setShowPreview } = configStore

const uploadingFiles = ref(false)

const props = defineProps({
    type: {
        type: String,
        required: true
    },
    textType: {
        type: String,
        required: true
    }
})

const uppercaseTextType = computed(() => {
    return (
        props.textType.split('')[0].toUpperCase() +
        props.textType.substring(1, props.textType.length)
    )
})

const openPreview = (): void => {
    setShowPreview(true)
}
</script>
<template>
    <!-- Should have Title, heading, ToolTip and add new button  -->
    <div :class="type" class="flex flex-col w-full justify-center mb-5 mt-5 h-12 flex-shrink-0">
        <div class="flex flex-row justify-between items-center">
            <h1 class="font-bold text-xl">{{ uppercaseTextType }} Setup</h1>
            <div class="flex flex-row h-full">
                <GenericButton class="mr-5" v-if="!showPreview" type="preview" :callback="openPreview"
                >JSON Preview</GenericButton>
                <GenericButton class="mr-5 h-full" type="primary" :callback="() => { uploadingFiles = true }"
                >Upload Files</GenericButton>
            </div>
        </div>
        <UploadFilesPopup v-if="uploadingFiles" :close="() => {uploadingFiles = false}"/>
    </div>
</template>
