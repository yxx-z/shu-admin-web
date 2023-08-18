import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/userManage/page',
    method: 'post',
    data
  })
}
