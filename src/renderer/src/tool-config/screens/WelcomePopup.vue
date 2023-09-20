<script setup lang="ts">
import GenericButton from '../components/GenericButton.vue'

const props = defineProps({
    overlayClick: {
        type: Function,
        required: true
    },
    buttonClick: {
        type: Function,
        required: true
    },
    existingFile: {
        type: Boolean,
        required: true
    }
})

function executeOverlayClick(): void {
    props.overlayClick()
}

function executeContinueClick(): void {
    props.buttonClick('continue')
}

function executeOtherClick(): void {
    props.buttonClick('other')
}

function executeNewClick(): void {
    props.buttonClick('new')
}
</script>
<template>
    <div
        class="grey-overlay absolute w-screen h-screen bg-gray-400 z-30 opacity-60 top-0 left-0 grid place-content-center"
        @click="executeOverlayClick()"
    ></div>
    <div
        class="popup-content z-50 w-[50vw] h-[50vh] max-w-[550px] max-h-[600px] bg-white rounded-3xl flex flex-col justify-center items-center absolute m-auto top-0 bottom-0 left-0 right-0"
    >
        <div v-if="existingFile" class="flex flex-col justify-center items-center">
            <div class="font-bold pb-2 text-2xl">Existing file found</div>
            <div class="pb-5 text-xl">Continue with existing file?</div>
            <GenericButton type="primary" class="p-2 mb-5 w-56" :callback="executeContinueClick"
                >Continue
            </GenericButton>
            <div class="text-lg mb-5">or</div>
        </div>
        <div v-else>
            <div class="font-bold mb-5 text-2xl">Welcome</div>
        </div>

        <GenericButton
            type="white"
            class="p-1 mb-5 bg-white border-primary w-56"
            :callback="executeNewClick"
            >Create new
        </GenericButton>
        <div v-if="!existingFile" class="text-lg mb-5">or</div>
        <GenericButton
            type="white"
            class="p-1 mb-5 bg-white border-primary w-56"
            :callback="executeOtherClick"
            >Open file
        </GenericButton>
    </div>
</template>
