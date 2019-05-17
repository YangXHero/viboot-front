import request from '../util/request'

export function merge(form) {
  return request({
    url: '/merge',
    method: 'post',
    data: form
  })
}
export function login(form) {
  return request({
    url: '/merge',
    method: 'post',
    data: form
  })
}



