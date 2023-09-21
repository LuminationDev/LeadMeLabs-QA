<script setup lang="ts">
import GenericButton from '@renderer/tool-config/components/GenericButton.vue'
import FinalPopup from "./FinalPopup.vue";
import { ref } from "vue";

const showPopup = ref(false)

function openPopup(): void {
    showPopup.value = true
}

function closePopup(): void {
    showPopup.value = false
}

</script>
<template>
    <div>
        <FinalPopup
            v-if="showPopup"
            :handle-click-outside="closePopup"/>
        <div class="w-full flex-col">
            <div class="flex flex-col w-full justify-center mb-5 mt-5 h-12 flex-shrink-0">
                <div class="flex flex-row justify-between items-center">
                    <h1 class="font-bold text-xl">Finish</h1>
                </div>
            </div>
            <div class="border-t-gray-100 border-t-2 flex flex-col">
                <p class="mt-10">
                    You've finished configuring your lab! Navigate with the sidebar to fill out any outstanding
                    information, or press complete to save and finish up.
                </p>
                <GenericButton type="primary" :callback="openPopup" class="p-2 mt-10">Complete</GenericButton>
            </div>
        </div>
    </div>
</template>
