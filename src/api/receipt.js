import request from '../utils/request'

export function getReceiptList(params) {
  return request({
    url: '/receipts',
    method: 'get',
    params
  })
}

// 新增
export function addReceipt(data) {
  return request({
    url: '/receipts',
    method: 'POST',
    data
  })
}

// 修改
export function editReceipt(data) {
  const { id } = data
  return request({
    url: `/receipts/${id}`,
    method: 'PUT',
    data
  })
}

// 删除
export function delReceipt(id) {
  return request({
    url: `/receipts/${id}`,
    method: 'DELETE'
  })
}

export default {
  getReceiptList,
  addReceipt,
  editReceipt,
  delReceipt
}
