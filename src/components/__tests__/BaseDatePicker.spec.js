import { fireEvent, render, screen } from '@testing-library/vue'
import BaseDatePicker from '../BaseDatePicker.vue'
import { parseDateTime } from '@/utils'

test('renders correctly by default', () => {
  const { html } = render(BaseDatePicker)
  screen.getByPlaceholderText('请选择')
  expect(html()).toMatchSnapshot()
})

test('changes props correctly', () => {
  const value = '2022-08-02'
  const placeholder = '开始日期'
  render(BaseDatePicker, {
    props: {
      value,
      placeholder
    }
  })
  screen.getByPlaceholderText(placeholder)
  screen.getByDisplayValue(value)
})

test('emits input event correctly', async () => {
  const day = 15
  const { emitted } = render(BaseDatePicker)
  // opens the dropdown menu by focus the input
  await fireEvent.focus(screen.getByRole('textbox'))
  const today = new Date()
  const cell = screen.getByRole('cell', { name: day})
  // emits the event when click the date button
  await fireEvent.click(cell)
  const selected = today.setDate(day)
  expect(emitted().input[0][0]).toBe(parseDateTime(selected, '{y}-{m}-{d} 00:00:00'))
})

