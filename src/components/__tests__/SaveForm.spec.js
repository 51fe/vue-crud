import { fireEvent, render, screen } from '@testing-library/vue'
import SaveForm from '../SaveForm.vue'
import { receiptRules } from '@/utils/validate'

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

test('fills and changes form fields correctly',  async () => {
  const {
    emitted,
    getByRole,
    getAllByRole,
    getByText,
    getByDisplayValue,
    findByDisplayValue
  } = render(SaveForm,{
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
  const beginDay = getAllByRole('cell', { name: day})[0]
  await fireEvent.click(beginDay)

  const areaCascader = await findByDisplayValue('广东省 / 深圳市 / 南山区')
  // actives the dropdown menu by clicking the input
  await fireEvent.click(areaCascader)
  // emits the event by clicking the area
  await fireEvent.click(getByText(/广州市/))
  await fireEvent.click(getByText(/白云区/))
  await fireEvent.click(getByRole('button', { name: /确 定/}))
  // Assert the right event has been emitted.
  expect(newForm).toEqual(initForm)
  expect(emitted().submit[0]).toEqual([newForm])
})

test('clear form fields before add',  async () => {
  const { queryByText, getAllByRole } = render(SaveForm, {
    props: {
      value: {},
      opened: true
    }
  })
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

  for (const key in receiptRules) {
     receiptRules[key]?.forEach?.(item => {
       if(item.message) {
         expect(queryByText(item.message)).toBeNull()
       }
     })
  }
})

describe('validation', ()=> {
  const toSubmit = async(errMgs) =>  {
    // invalid
    await fireEvent.click(screen.getByRole('button', { name: '确 定'}))
    expect(screen.getByText(errMgs)).toBeVisible()
  }

  const checkInputValidation = async (index, value, errMsg) => {
    // invalid
    await toSubmit(errMsg)
    // valid
    const input = screen.getAllByRole('textbox')[index]
    await fireEvent.update(input, value)
    await fireEvent.blur(input)
    expect(screen.queryByText(errMsg)).toBeNull()
  }
  test('validates inputs', async () => {
    render(SaveForm, {
      props: {
        value: {}
      }
    })
    await checkInputValidation(1,  newForm.userName, receiptRules.userName[0].message)
    await checkInputValidation(3, newForm.address, receiptRules.address[0].message)
    await checkInputValidation(4, newForm.mobile, receiptRules.mobile[0].message)
  })

  test('validates phone format', async () => {
    const { queryByText, findByText, getAllByRole } = render(SaveForm, {
      props: {
        value: {}
      }
    })
    // invalid
    const input = getAllByRole('textbox')[4]
    const errMsg = receiptRules.mobile[1].message
    await fireEvent.update(input, 'abc')
    expect(await findByText(errMsg)).toBeVisible()
    // valid
    await fireEvent.update(input, newForm.mobile)
    expect(queryByText(errMsg)).toBeNull()
  })

  test('validates date', async () => {
    const { getAllByRole, queryByText } = render(SaveForm, {
      props: {
        value: {}
      }
    })
    const errMsg = receiptRules.date[0].message
    // invalid
    await toSubmit(errMsg)
    // valid
    const input = getAllByRole('textbox')[0]
    await fireEvent.focus(input)
    const cell = screen.getByRole('cell', { name: 15 })
    await fireEvent.click(cell)
    expect(queryByText(errMsg)).toBeNull()
  })

  test('validates area', async () => {
    const { getAllByRole, getByText, queryByText } = render(SaveForm, {
      props: {
        value: {
          area: undefined
        }
      }
    })
    const errMsg = receiptRules.area[0].message
    // invalid
    await toSubmit(errMsg)
    // valid
    const input = getAllByRole('textbox')[2]
    await fireEvent.click(input)
    await fireEvent.click(getByText('广东省'))
    await fireEvent.click(getByText( '深圳市'))
    await fireEvent.click(getByText('南山区'))
    expect(queryByText(errMsg)).toBeNull()
  })
})
