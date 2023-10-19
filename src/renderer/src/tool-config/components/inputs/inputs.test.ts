import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import GenericButton from '../GenericButton.vue'
import NumberInput from './NumberInput.vue'
import TextInput from './TextInput.vue'

test('mount GenericButton', async () => {
    expect(GenericButton).toBeTruthy()
    const wrapper = mount(GenericButton, {
        props: {
            type: 'primary',
            callback: () => {}
        }
    })
    expect(wrapper.html()).toContain('button')
})

test('mount NumberInput', async () => {
    expect(NumberInput).toBeTruthy()
    const wrapper = mount(NumberInput, {
        props: {
            v$: {
                $invalid: false,
                $touch: () => {}
            },
            modelValue: 10,
            fieldId: 'test_number_field'
        }
    })
    expect(wrapper.html()).toContain('input')
})
test('mount TextInput', async () => {
    expect(TextInput).toBeTruthy()
    //@ts-ignore unmatched overload
    const wrapper = mount(TextInput, {
        props: {
            v$: {
                $invalid: false,
                $touch: () => {}
            },
            modelValue: 'Test text field value',
            fieldId: 'test_text_field',
            placeholder: 'Enter text value here'
        }
    })
    expect(wrapper.html()).toContain(
        '<input id="test_text_field" placeholder="Enter text value here" type="text" class="textfield-primary">'
    )
    const textfield = wrapper.find('input')
    await textfield.setValue('Classroom')
    expect(wrapper.find('input').element.value).toBe('Classroom')
})
