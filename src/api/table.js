import request from '@/utils/request'

export function getList(data) {
  console.log('----------------')
  console.log(data)
  console.log('----------------')
  return request({
    url: '/userManage/page',
    method: 'post',
    data
  })
}
