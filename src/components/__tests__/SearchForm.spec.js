import { fireEvent, render } from '@testing-library/vue'
import SearchForm from '../SearchForm.vue'
import options from '../AreaCascader/area'

// only changes the day
const today = new Date()
const y = today.getFullYear()
const m = (today.getMonth() + 1).toString().padStart(2, '0')
const fakeForm = {
  userName_like: '李',
  mobile_like: '134',
  date_gte: `${y}-${m}-11 00:00:00`,
  date_lte: `${y}-${m}-15 00:00:00`,
  areaName_like: '广东省',
  area_like: 4403,
  area: 440305
}

test('emits search event when click search button or press enter', async () => {
  const {
    emitted,
    getByPlaceholderText,
    getAllByRole,
    getByText,
    getByTitle,
    getByTestId
  } = render(SearchForm)
  const userNameInput =  getByPlaceholderText('请输入姓名')
  await fireEvent.update(userNameInput, fakeForm.userName_like)

  const mobileInput = getByPlaceholderText('请输入手机号')
  await fireEvent.update(mobileInput, fakeForm.mobile_like)

  const gtePicker = getByPlaceholderText('开始日期')
  await fireEvent.focus(gtePicker)
  const beginDay = getAllByRole('cell', { name: '11'})[0]
  await fireEvent.click(beginDay)

  const ltePicker = getByPlaceholderText('结束日期')
  await fireEvent.focus(ltePicker)
  const endDay = getAllByRole('cell', { name: '15'})[1]
  await fireEvent.click(endDay)

  getByPlaceholderText('请选择省')
  await fireEvent.click(getByText(fakeForm.areaName_like))

  getByPlaceholderText('请选择市')
  const cities = options.find(item => item.label === fakeForm.areaName_like)?.children
  const city = cities.find(item => item.value === fakeForm.area_like * 100)
  if(city) {
    await fireEvent.click(getByText(city?.label))
  }
  getByPlaceholderText('请选择区')
  if(city?.children) {
    const area = city?.children.find(item => item.value === fakeForm.area)
    await fireEvent.click(getByText(area?.label))
  }
  const searchBtn = getByTitle(/搜索/)
  // Click search button
  await fireEvent.click(searchBtn)
  // Assert the right event has been emitted.
  expect(emitted().search[0][0]).toEqual(fakeForm)
  // Press enter
  await fireEvent.keyUp(getByTestId('search-form'), { key: 'Enter', code: 'Enter', charCode: 13 })
  expect(emitted().search[1][0]).toEqual(fakeForm)
})
