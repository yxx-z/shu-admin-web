import request from '@/utils/request'

export function recap() {
  return request({
    url: '/dashboard/recap',
    method: 'get'
  })
}
