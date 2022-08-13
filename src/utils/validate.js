/**
 * 检验邮编
 * @param rule
 * @param value
 * @param callback
 */
export function zipValidator(rule, value, callback) {
  const reg = /(^\d{6}$)/
  if (value) {
    if (!reg.test(value)) {
      callback(new Error('请输入正确的邮编'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
