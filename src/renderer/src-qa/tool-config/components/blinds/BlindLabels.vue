<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { cloneDeep, debounce } from 'lodash'
import { blindsObject } from '../constants/_labels'

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    }
})

interface CustomOptionEntry {
    id: number
    label: string
    key?: string
    defaultLabel?: string
}

const localOption = ref<InstanceType<typeof Object> | null>(null)
const customOption = ref<InstanceType<typeof Array<CustomOptionEntry>> | null>(null)
const selectedOption = ref([] as string[])

onBeforeMount(() => {
    localOption.value = Object.assign({}, props.modelValue)
    // @ts-ignore default label field todo
    customOption.value = blindsObject.map((a) => {
        return { ...a }
    })
    if (props.modelValue && customOption.value) {
        customOption.value.forEach((element) => {
            if (element.key && props.modelValue[element.key] !== undefined) {
                element.label = props.modelValue[element['key']]
            }
        })

        selectedOption.value = Object.keys(props.modelValue)
    }
})

// defineEmits(['updateOption'])
const emit = defineEmits<{
    // update label
    (e: 'updateLabel', data)
}>()

function handleInput(): void {
    const finalOptionObject = {}
    for (const value of selectedOption.value) {
        if (customOption.value !== null) {
            const customOptionSingle = customOption.value.find((el: any) => el.key == value)
            if (customOptionSingle) {
                //@ts-ignore assigning string
                finalOptionObject[value] = customOptionSingle['label']
            }
        }
    }
    localOption.value = cloneDeep(finalOptionObject)
    emit('updateLabel', finalOptionObject)
}

const debounceHandleInput = debounce(function debounceCallback() {
    handleInput()
}, 200)
</script>

<template>
    <div id="sourceLabelsComponent" class="flex flex-col mt-2 w-full">
        <div class="text-md font-bold">Override Labels</div>
        <div
            v-for="(blind, index) in blindsObject"
            :key="index"
            class="p-2 h-[60px] flex-row w-full items-center"
        >
            <span class="w-20"
                >{{
                    //@ts-ignore
                    customOption.find((el) => el.key == blind.key).defaultLabel
                }}:</span
            >
            <!--            todo - typescript errors - split the v-fors into components-->
            <input
                v-model="
                    //@ts-ignore
                    customOption.find((el) => el.key == blind.key).label
                "
                class="textfield-primary disabled:border-gray-300"
                type="text"
                placeholder="Custom option"
                @input="debounceHandleInput"
            />
        </div>
    </div>
</template>
