import request from '@/utils/request'

export function upload(formData) {
  return request({
    url: '/file/upload', // 您的后端接口的URL
    method: 'post',
    headers: {
      // 设置请求头，指定发送的数据为 formData
      'Content-Type': 'multipart/form-data'
    },
    // 直接将 formData 作为请求数据
    data: formData
  })
}

// 轮播图分页
export function rotationPage(data) {
  return request({
    url: '/rotation/page',
    method: 'post',
    data
  })
}

// 删除轮播图
export function fileDel(data) {
  return request({
    url: '/rotation/del',
    method: 'post',
    data
  })
}

// 上下线
export function onLine(data) {
  return request({
    url: '/rotation/onLine',
    method: 'post',
    data
  })
}
