import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/userManage/page',
    method: 'post',
    data
  })
}

export function kickOut(data) {
  return request({
    url: '/userManage/kickOut',
    method: 'post',
    data
  })
}

export function banned(data) {
  return request({
    url: '/userManage/banned',
    method: 'post',
    data
  })
}
