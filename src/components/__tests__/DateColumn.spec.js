import { render, screen } from '@testing-library/vue'
import DateColumn from '../DateColumn.vue'

const setUp = (format = '{y}-{m}-{d}') => {
  return render({
    components: { DateColumn },
    template: `<el-table :data="[{ date: '2022-08-15 08:00:00'}]">
        <date-column prop="date" :format="format" label="日期"></date-column>
      </el-table>`,
    data() {
      return {
        format
      }
    }
  })
}

test('renders correctly by default', async () => {
  setUp()
  const header = await screen.findByRole('columnheader')
  expect(header).toHaveTextContent('日期')
  const row = await screen.findByRole('cell')
  expect(row).toHaveTextContent('2022-08-15')
})

test('changes props correctly', async () => {
  setUp('{y}年{m}月{d}日')
  const row = await screen.findByRole('cell')
  expect(row).toHaveTextContent('2022年08月15日')
})
