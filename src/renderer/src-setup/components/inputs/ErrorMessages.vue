<script setup lang="ts">
import { computed } from 'vue'
import { useOptionalValidations } from '../../../composables/requiredOptional'
import warning from '../../../assets/icons/warning.svg'
import errorIcon from '../../../assets/icons/error.svg'

const { testIfWouldPassRequired } = useOptionalValidations()

const props = defineProps({
    v$: {
        type: Object,
        required: true
    }
})

const wouldPass = computed(() => {
    return testIfWouldPassRequired(props.v$.$model)
})

defineEmits(['update:modelValue'])
</script>

<template>
    <div class="flex-col">
        <div v-if="v$ && v$.$error" class="flex flex-col">
            <div
                v-for="(error, index) in v$.$errors"
                :key="index"
                class="flex flex-row items-center text-red-500 mt-2"
            >
                <img
                    class="w-6 h-6 stroke-inactive fill-inactive shrink-0 max-w-none mr-1"
                    :src="errorIcon"
                    alt="error icon"
                />
                <span class="text-xs">{{ error.$message }}</span>
            </div>
        </div>
        <div
            v-if="v$ && v$.requiredOptional && !wouldPass && !v$.$error && v$.$dirty"
            class="flex flex-row mt-2 items-center"
        >
            <img
                class="w-6 h-6 stroke-inactive fill-inactive shrink-0 max-w-none mr-1"
                :src="warning"
                alt="warning icon"
            />
            <span class="text-orange-500 text-xs"
                >You may continue without this information, but it is required for the appliance to
                function.</span
            >
        </div>
    </div>
</template>
