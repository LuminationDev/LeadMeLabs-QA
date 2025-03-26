<script setup lang="ts">
import GenericButton from '../components/GenericButton.vue'
import router from '../router/router'
import {useLabStore} from "../store/labStore";
import {storeToRefs} from "pinia";

const labStore = useLabStore()
const { currentlyEditingAppliance } = storeToRefs(labStore)

const props = defineProps({
    meta: {
        type: Object,
        required: true
    }
})

const goPrevLink = (): void => {
    router.push(props.meta.prev)
}
const goNextLink = (): void => {
    router.push(props.meta.next)
}
</script>
<template>
    <GenericButton v-if="props.meta.prev" type="light" :callback="goPrevLink" :disabled="currentlyEditingAppliance"
        >Previous
    </GenericButton>
    <div class="grow"></div>
    <GenericButton v-if="props.meta.next" type="secondary" :callback="goNextLink" :disabled="currentlyEditingAppliance"
        >Next
    </GenericButton>
</template>
<style></style>
