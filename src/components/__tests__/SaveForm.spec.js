import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/vue'
import SaveForm from '../SaveForm.vue'
import rules from '@/utils/rules'

const { date, userName, area, address, mobile } = rules

const initForm = {
  date: '2022-08-15 00:00:00',
  userName: '李四',
  area: 440305,
  areaName: '广东省深圳市南山区',
  address: '望海路33号',
  mobile: '15866666666'
}

const newForm = {
  date: '2022-08-16 00:00:00',
  userName: '王五',
  area: 440111,
  areaName: '广东省广州市白云区',
  address: '白云路100号',
  mobile: '15166666666'
}

const setUp = () =>
  render(SaveForm, {
    props: {
      value: {}
    }
  })

test('fills and changes form fields correctly', async () => {
  const { emitted, getByText, getByDisplayValue } = render(SaveForm, {
    props: {
      value: initForm
    }
  })
  const userNameInput = getByDisplayValue(initForm.userName)
  await fireEvent.update(userNameInput, newForm.userName)

  const addressInput = getByDisplayValue(initForm.address)
  await fireEvent.update(addressInput, newForm.address)

  const mobileInput = getByDisplayValue(initForm.mobile)
  await fireEvent.update(mobileInput, newForm.mobile)

  const date = initForm.date.substring(0, 10)
  const gtePicker = getByDisplayValue(date)
  await fireEvent.touch(gtePicker)
  const day = newForm.date.substring(8, 10)
  const beginDay = screen.getAllByRole('cell', { name: day })[0]
  await fireEvent.click(beginDay)

  const areaCascader = await screen.findByDisplayValue('广东省 / 深圳市 / 南山区')
  // actives the dropdown menu by clicking the input
  await fireEvent.click(areaCascader)
  // emits the event by clicking the area
  await fireEvent.click(getByText(/广州市/))
  await fireEvent.click(getByText(/白云区/))

  await fireEvent.click(screen.getByRole('button', { name: /确 定/ }))
  // Assert the right event has been emitted.
  expect(emitted().submit[0]).toEqual([newForm])
})

test('clear form fields before add', async () => {
  const { getAllByRole } = setUp()
  const defaultInputPlaceHolder = '请输入'
  const defaultSelectPlaceHolder = '请选择'
  const datePicker = getAllByRole('textbox')[0]
  expect(datePicker).toHaveProperty('placeholder', defaultSelectPlaceHolder)
  const userNameInput = getAllByRole('textbox')[1]
  expect(userNameInput).toHaveProperty('placeholder', defaultInputPlaceHolder)
  const areaCascader = getAllByRole('textbox')[2]
  expect(areaCascader).toHaveProperty('placeholder', defaultSelectPlaceHolder)
  const addressInput = getAllByRole('textbox')[3]
  expect(addressInput).toHaveProperty('placeholder', defaultInputPlaceHolder)
  const mobileInput = getAllByRole('textbox')[4]
  expect(mobileInput).toHaveProperty('placeholder', defaultInputPlaceHolder)

  for (const key in rules) {
    rules[key]?.forEach?.(item => {
      if (item.message) {
        expect(screen.queryByText(item.message)).not.toBeInTheDocument()
      }
    })
  }
})

describe('validation', () => {
  test('validates userName', async () => {
    const { queryByText } = setUp()
    let errMsg = userName[0].message
    const input = screen.getAllByRole('textbox')[1]
    // required
    await fireEvent.touch(input)
    expect(await screen.findByText(errMsg)).toBeInTheDocument()
    // valid
    await fireEvent.update(input, newForm.userName)
    waitForElementToBeRemoved(() => queryByText(errMsg))
  })

  test('validates address', async () => {
    const { queryByText } = setUp()
    let errMsg = address[0].message
    const input = screen.getAllByRole('textbox')[3]
    // required
    await fireEvent.touch(input)
    expect(await screen.findByText(errMsg)).toBeInTheDocument()
    // valid
    await fireEvent.update(input, newForm.address)
    waitForElementToBeRemoved(() => queryByText(errMsg))
  })

  test('validates phone', async () => {
    const { findByText } = setUp()
    let errMsg = mobile[0].message
    const input = screen.getAllByRole('textbox')[4]
    // required
    await fireEvent.touch(input)
    expect(await findByText(errMsg)).toBeInTheDocument()
    // format
    errMsg = mobile[1].message
    await fireEvent.update(input, 'abc')
    expect(await findByText(errMsg)).toBeInTheDocument()
    // valid
    await fireEvent.update(input, newForm.mobile)
    expect(screen.queryByText(errMsg)).not.toBeInTheDocument()
  })

  test('validates date', async () => {
    const { getAllByRole } = setUp()
    const errMsg = date[0].message
    const input = getAllByRole('textbox')[0]
    // required
    await fireEvent.click(screen.getByRole('button', { name: /确 定/ }))
    expect(await screen.findByText(errMsg)).toBeInTheDocument()
    // valid
    await fireEvent.focus(input)
    const cell = screen.getByRole('cell', { name: 15 })
    await fireEvent.click(cell)
    expect(screen.queryByText(errMsg)).not.toBeInTheDocument()
  })

  test('validates area', async () => {
    const { getByText } = setUp()
    const errMsg = area[0].message
    // required
    await fireEvent.click(screen.getByRole('button', { name: /确 定/ }))
    expect(await screen.findByText(errMsg)).toBeInTheDocument()
    // valid
    const input = screen.getAllByRole('textbox')[2]
    await fireEvent.click(input)
    await fireEvent.click(getByText('广东省'))
    await fireEvent.click(getByText('深圳市'))
    await fireEvent.click(getByText('南山区'))
    expect(screen.queryByText(errMsg)).not.toBeInTheDocument()
  })
})
