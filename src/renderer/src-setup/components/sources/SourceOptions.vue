<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'
import { isEqual, debounce } from 'lodash'
import { sourceObjectEpson, sourceObjectPanasonic } from '../constants/_labels'
import ErrorMessages from '../inputs/ErrorMessages.vue'

const props = defineProps({
  projectorType: {
    type: String,
    required: true
  },
  modelValue: {
    type: Object,
    required: true
  },
  v$: {
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

const sourceObject = props.projectorType === "epson" ? sourceObjectEpson : sourceObjectPanasonic;
const localOption = ref<InstanceType<typeof Object> | null>(null)
const customOption = ref<InstanceType<typeof Array<CustomOptionEntry>> | null>(null)
const selectedOption = ref<InstanceType<typeof Array<string>>>([])

onBeforeMount(() => {
    localOption.value = Object.assign({}, props.modelValue)
    //@ts-ignore type casting
    customOption.value = sourceObject.map((a) => {
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
    (e: 'updateOption', data)
}>()

const optionModified = computed(() => {
    return !isEqual(localOption.value, props.modelValue)
})

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
    //@ts-ignore type casting
    localOption.value = Object.assign({}, finalOptionObject)
    emit('updateOption', finalOptionObject)
}

const debounceHandleInput = debounce(function debounceCallback() {
    handleInput()
}, 200)
</script>

<template>
    <div id="sourceLabelsComponent" class="flex flex-col w-full">
        <div class="text-md font-bold">Choose Sources (Pick 3 only)</div>
        <div v-if="optionModified" class="text-sm text-red-600">options unsaved</div>
        <div
            v-for="(source, index) in sourceObject"
            :key="index"
            class="p-2 h-[60px] flex-row w-full justify-between"
            :class="{
                'text-gray-300': !selectedOption.find((el) => el == source.key)
            }"
        >
            <div class="flex-row items-center">
                <input
                    :id="`Source Option ${source.defaultLabel}`"
                    v-model="selectedOption"
                    type="checkbox"
                    :value="source.key"
                    class="w-6 h-6"
                    @change="debounceHandleInput"
                />
                <label :for="`Source Option ${source.defaultLabel}`" class="ml-2"
                    ><span>{{ source.defaultLabel }}</span></label
                >
            </div>
            <!--            todo - typescript errors - split the v-fors into components-->
            <input
                v-model="//@ts-ignore
                customOption.find((el: any) => el.key === source.key).label"
                :disabled="//@ts-ignore
                !selectedOption.find((el: any) => el === source.key)"
                class="textfield-primary disabled:border-gray-300"
                type="text"
                placeholder="Custom option"
                @input="debounceHandleInput"
            />
        </div>
        <ErrorMessages :v$="v$" />
    </div>
</template>
