import { fireEvent, render, screen } from '@testing-library/vue'
import BasePagination from '../BasePagination.vue'

const setUp = () => {
  return render(BasePagination, {
    props: {
      total: 32
    }
  })
}

test('renders correctly by default', () => {
  const { html } = setUp()
  screen.getByText(/共 32 条/i)
  expect(html()).toMatchSnapshot()
})

test('emits events correctly when click the pager number', async() => {
  const page = 2
  const { emitted } = setUp()
  const numberBtn = screen.getByText(page, { selector: '.number' })
  // click page 2 button
  await fireEvent.click(numberBtn)
  expect(emitted()['update:page'][0][0]).toBe(page)
  expect(emitted()['pagination'][0][0].page).toBe(page)
})

test('emits events correctly when click the page size item', async() => {
  const limit = 30
  const { emitted } = setUp()
  const item = screen.getByText(new RegExp(`${limit}条/页`))
  // click the second item
  await fireEvent.click(item)
  expect(emitted()['update:limit'][0][0]).toBe(limit)
  expect(emitted()['pagination'][0][0].limit).toBe(limit)
})


