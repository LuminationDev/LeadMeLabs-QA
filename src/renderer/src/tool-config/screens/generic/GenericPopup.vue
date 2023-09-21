<script setup lang="ts"></script>
<template>
    <div
        class="grey-overlay absolute w-screen h-screen bg-gray-400 z-20 opacity-60 top-0 left-0 grid place-content-center"
    ></div>
    <div
        class="w-96 h-72 z-30 justify-center items-center absolute m-auto top-0 bottom-0 left-0 right-0 bg-white flex-col border-2 border-primary rounded-lg py-2 px-10"
    >
        <slot name="popupText"></slot>
        <div class="flex-row mt-10">
            <slot name="buttonsRow"></slot>
        </div>
    </div>
</template>
