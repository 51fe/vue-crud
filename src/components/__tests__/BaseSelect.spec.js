import { fireEvent, render, screen } from '@testing-library/vue'
import BaseSelect from '../BaseSelect.vue'

const options = [{
  id: 1,
  brand: '移动'
}, {
  id: 2,
  brand: '联通'
}, {
  id: 3,
  brand: '电信'
}]
const defaultPlaceholder = '请选择'

const setUp = (overrides) => {
  return render(BaseSelect, {
    props: {
      options,
      labelKey: 'brand',
      valueKey: 'id',
      ...overrides
    }
  })
}

const getOptionByLabel = (label) => screen.getByRole('listitem', {
  hidden: true,
  name: (content, el) => el.textContent === label
})

test('renders correctly by default', () => {
  const { html } = setUp()
  screen.getByPlaceholderText(defaultPlaceholder)
  const list = screen.getAllByRole('listitem', { hidden: true })
  expect(list).toHaveLength(options.length)
  expect(html()).toMatchSnapshot()
})

test('changes props correctly', async () => {
  const placeholder = '请选择营运商'
  const value = 3
  setUp({
    placeholder,
    value
  })
  // change placeholder and current selected
  screen.getByPlaceholderText(placeholder)
  expect(getOptionByLabel('电信')).toHaveClass('selected')
})

test('emits input event correctly when selected', async () => {
  const { emitted } = setUp()
  //  trigger an update event by clicking the <option> element.
  await fireEvent.click(getOptionByLabel('电信'))
  expect(emitted().input[0][0]).toBe(3)
})

test('Passes and returns a string when select multiple items', async () => {
  const value = '1, 2'
  const { emitted } = setUp({
    multiple: true,
    value
  })
  // current selected 移动, 联通
  value.split(',').forEach(id => {
    const found = options.find(item => item.id === parseInt(id))
    if (found) {
      getOptionByLabel(found.brand)
    }
  })
  // select all
  await fireEvent.click(getOptionByLabel('电信'))
  expect(emitted().input[0][0]).toBe('1,2,3')
})
