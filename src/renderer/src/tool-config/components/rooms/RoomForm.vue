<script setup lang="ts">
import { onBeforeMount, onMounted, reactive, ref } from 'vue'

import { Room } from '../../models'
import { cloneDeep } from 'lodash'
import useVuelidate from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import TextInput from '../inputs/TextInput.vue'
import GenericButton from '../GenericButton.vue'

const props = defineProps({
    room: {
        type: Room,
        required: true
    }
})
const type = 'rooms'
const roomNameInputRef = ref<InstanceType<typeof HTMLTextAreaElement> | null>(null)

onBeforeMount(() => {
    state.id = props.room.id
    state.name = props.room.name
})

onMounted(() => {
    if (roomNameInputRef.value !== null) {
        roomNameInputRef.value.focus()
    }
})
const state = reactive({
    id: 0,
    name: ''
})
const rules = {
    id: { required },
    name: { required, minLength: minLength(3) }
}

const v$ = useVuelidate(rules, state)

const emit = defineEmits<{
    (e: 'saveItem', type: string, value: Room): void
    (e: 'addItem', type: string): void
    (e: 'deleteItem', type: string, id: number): void
}>()

function save(): void {
    emit('saveItem', type, cloneDeep(state))
}

function remove(): void {
    emit('deleteItem', type, state.id)
}
</script>
<template>
    <div class="light-form flex flex-col">
        <div class="flex flex-row items-center">
            <TextInput
                ref="roomNameInputRef"
                v-model="v$.name.$model"
                field-id="room-name"
                :v$="v$.name"
                class="mr-1 w-80 h-[108px]"
                placeholder="E.g. Classroom"
            >
                <template #label> Name</template>
                >
            </TextInput>
            <GenericButton id="save-button" class="h-fit mr-2 mb-0" :callback="save" type="primary">
                Save
            </GenericButton>
            <GenericButton
                id="delete-button"
                class="h-fit px-2 flex items-center border-red-500 border-2 hover:bg-red-100 text-red-500 rounded-lg text-base"
                :callback="remove"
                >Delete
            </GenericButton>
        </div>
    </div>
</template>

<style lang=""></style>
