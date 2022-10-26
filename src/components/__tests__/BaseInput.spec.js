import { fireEvent, render, screen } from '@testing-library/vue'
import BaseInput from '../BaseInput.vue'

test('renders correctly by default', () => {
  const { html } = render(BaseInput)
  screen.getByPlaceholderText('请输入')
  expect(html()).toMatchSnapshot()
})

test('changes props correctly', () => {
  const value = 'hello'
  const placeholder = '请输入姓名'
  render(BaseInput, {
    props: {
      value,
      placeholder
    }
  })
  screen.getByPlaceholderText(placeholder)
  screen.getByDisplayValue(value)
})

test('emits input event correctly', async () => {
  const { emitted } = render(BaseInput)
  const value = 'world'
  const input = screen.getByRole('textbox')
  await fireEvent.update(input, value)
  expect(emitted().input[0][0]).toBe(value)
})


