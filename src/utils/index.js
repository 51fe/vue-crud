/**
 * Parse the time to string
 * @param {(Date|string|number)} time
 * @param {string} format
 * @returns {string | null}
 */
export function parseDateTime(time, format ='{y}-{m}-{d} {h}:{i}:{s}') {
  if (arguments.length === 0 || !time) {
    return null
  }
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['一', '二', '三', '四', '五', '六', '日'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * 根据值获取标签
 * @param list
 * @param value
 * @returns {string|*}
 */
export function getLabel(list, value) {
  const found = list?.find((item) => item.value == value)
  if (found) return found.label
  return ''
}

/**
 * 根据区码查找区名
 * @param list
 * @param value
 * @returns {string|*}
 */
export function getAreaNameByCode(list, value) {
  if(Array.isArray(list)) {
    for (const item of list) {
      if (item.value === value) {
        return item.label
      } else if (item.children?.length > 0) {
        return getAreaNameByCode(item.children, value)
      }
    }
  }
  return ''
}

/**
 * 简单深度拷贝
 * @param data
 * @returns {any}
 */
export function deepClone(data) {
  return JSON.parse(JSON.stringify(data))
}
