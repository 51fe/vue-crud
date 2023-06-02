import { fireEvent, render, within, screen } from '@testing-library/vue'
import { editReceipt, getReceiptList, delReceipt } from '@/api/receipt'
import App from '@/App.vue'

jest.mock('../api/receipt')

const receipts = [{
  date: '2021-08-02 00:00:00',
  userName: '孙六',
  address: '金沙江路1518弄',
  id: 1,
  area: 310107,
  areaName: '上海市黄浦区',
  mobile: '15888888888'
}, {
  date: '2022-08-03 00:00:00',
  userName: '张三',
  address: '王府井大街56号',
  id: 2,
  area: 110105,
  areaName: '北京市朝阳区',
  mobile: '15188888888'
}, {
  date: '2022-08-03 00:00:00',
  userName: '李四',
  address: '望海路33号',
  id: 3,
  area: 440305,
  areaName: '广东省深圳市南山区',
  mobile: '15866666666'
}]

const defaultValue = {
  list: receipts,
  total: 3
}

async function filterData(value, placeholder) {
  getReceiptList.mockResolvedValue(value)
  const { getByPlaceholderText, getByTitle } = render(App)
  // init call
  expect(getReceiptList).toHaveBeenCalledTimes(1)
  if (placeholder) {
    await fireEvent.update(getByPlaceholderText(placeholder))
  }
  // search call
  await fireEvent.click(getByTitle('搜索'))
  expect(getReceiptList).toHaveBeenCalledTimes(2)
}

beforeEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
})

test('fetch receipts when mounted', async () => {
  getReceiptList.mockResolvedValue(defaultValue)
  const { getAllByRole } = render(App)
  // init call
  expect(await getReceiptList).toHaveBeenCalledTimes(1)
  const rows = getAllByRole('row')
  expect(rows.length).toBe(receipts.length + 1)
  expect(rows[0]).toHaveTextContent(/日期姓名省市区地址手机号码操作/)
  expect(rows[1]).toHaveTextContent(/孙六上海市黄浦区金沙江路1518弄15888888888/)
})

test('returns all rows without any search input', async () => {
  await filterData(defaultValue)
  const rows = screen.getAllByRole('row')
  expect(rows).toHaveLength(receipts.length + 1)
})

test('returns 1 row when set mobile to 151', async () => {
  const keyword = '151'
  const filtered = receipts.filter(item => new RegExp(keyword, 'i').test(item.mobile))
  await filterData({
    list: filtered,
    total: filtered.length
  }, '请输入手机号')
  expect(screen.getByText(/15188888888/)).toBeInTheDocument()
})

test('returns No data if name does not match', async () => {
  await filterData({ list: [], total: 0 }, '请输入姓名')
  const msg = await screen.findByText(/暂无数据/)
  expect(msg).toBeInTheDocument()
})

test('calls delReceipt to delete', async () => {
  // define mocks
  getReceiptList.mockResolvedValue(defaultValue)
  delReceipt.mockResolvedValue({})
  const { findByRole, getByRole } = render(App)
  // init call
  expect(getReceiptList).toHaveBeenCalledTimes(1)
  const row = await findByRole('row', { name: /李四/ })
  const btn = within(row).getByText(/删除/)
  await fireEvent.click(btn)
  const submitBtn = getByRole('button', { name: '确定' })
  await fireEvent.click(submitBtn)
  // delete call
  expect(delReceipt).toHaveBeenCalledTimes(1)
})

test('calls editReceipt to edit', async () => {
  getReceiptList.mockResolvedValue(defaultValue)
  editReceipt.mockResolvedValue({})
  const { getByRole, getByDisplayValue, findByRole } = render(App)
  expect(getReceiptList).toHaveBeenCalledTimes(1)
  // only test the row with user name of 孙六
  const name = RegExp(/孙六/)
  const row = await findByRole('row', { name })
  const btn = within(row).getByText(/编辑/)
  await fireEvent.click(btn)
  // only simply test user name
  const newName = '王五'
  await fireEvent.update(getByDisplayValue(name), newName)
  const submitBtn = getByRole('button', { name: '确 定' })
  await fireEvent.click(submitBtn)
  expect(editReceipt).toHaveBeenCalledTimes(1)
  // see user name updated
  expect(row).toHaveTextContent(newName)
})
