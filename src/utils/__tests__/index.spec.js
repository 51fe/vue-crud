import { parseDateTime, getLabel, getAreaNameByCode, deepClone } from '../index'

describe('parseDateTime', () => {
  test('returns null if time is undefined', () => {
    expect(parseDateTime()).toBeNull()
  })

  test('returns date string if time is Date', () => {
    const date = new Date(2022, 7, 15, 0, 0, 0)
    expect(parseDateTime(date)).toBe('2022-08-15 00:00:00')
  })

  test('returns date string if time is String', () => {
    expect(parseDateTime('2022-08-15')).toBe('2022-08-15 00:00:00')
  })

  test('returns date string if time is Number', () => {
    const date = new Date(2022, 7, 15, 0, 0, 0)
    expect(parseDateTime(date.getTime())).toBe('2022-08-15 00:00:00')
  })

  test('returns a format date string if format parameter is set', () => {
    const date = new Date(2022, 7, 15, 0, 0, 0)
    expect(parseDateTime(date, '{y}年{m}月{d}日 {h}时{i}分{s}秒')).toBe('2022年08月15日 00时00分00秒')
  })
})

describe('getLabel', () => {
  test('returns empty string if list is undefined or empty', () => {
    expect(getLabel([])).toBe('')
    expect(getLabel()).toBe('')
  })

  test('returns empty string if not found', () => {
    const list = [{
      value: 1,
      label: '移动'
    }, {
      value: 2,
      label: '联通'
    }, {
      value: 3,
      label: '电信'
    }]
    expect(getLabel(list , 0)).toBe('')
  })

  test('returns the label by a value from the list', () => {
    const list = [{
      value: 1,
      label: '移动'
    }, {
      value: 2,
      label: '联通'
    }, {
      value: 3,
      label: '电信'
    }]
    const label = getLabel(list, 1)
    expect(label).toBe('移动')
  })
})

describe('getAreaNameByCode', () => {
  const areas = [{
    value: 440000,
    label: '广东省',
    children: [{
      value: 440300,
      label: '深圳市',
      children: [
        { value: 440303, label: '罗湖区' },
        { value: 440304, label: '福田区' },
        { value: 440305, label: '南山区' },
        { value: 440306, label: '宝安区' }
      ]
    }]
  }]
  test('returns empty string if list is undefined or empty', () => {
    expect(getAreaNameByCode([])).toBe('')
    expect(getAreaNameByCode()).toBe('')
  })

  test('returns empty string if value is invalid', () => {
    expect(getAreaNameByCode(areas, 440399)).toBe('')
  })
  test('returns area name if area code is valid', () => {
    expect(getAreaNameByCode(areas, 440000)).toBe('广东省')
    expect(getAreaNameByCode(areas, 440300)).toBe('深圳市')
    expect(getAreaNameByCode(areas, 440305)).toBe('南山区')
  })
})

describe('deepClone', () => {
  test('returns a clone object', () => {
    const person = {
      name: 'tom',
      age: 24
    }
    const cloned = deepClone(person)
    cloned.age  = 26
    expect(person.age).toBe(24)
    expect(cloned).not.toEqual(person)
  })

  test('returns a clone array', () => {
    const persons = [{
      name: 'tom',
      age: 24
    }, {
      name: 'jerry',
      age: 25
    }]
    const cloned = deepClone(persons)
    cloned[1].age  = 26
    expect(persons[0].age).toBe(24)
    expect(cloned).not.toEqual(persons)
  })
})
