import request from '../util/request'

export function merge(form) {
  return request({
    url: '/merge',
    method: 'post',
    data: form
  })
}
// 登录
export function loginInterface(data) {
  return request({
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      transformRequest: function (obj) {
          var str = [];
          for (var p in obj) {
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
          return str.join("&");
      },
      url: '/login',
      method: 'post',
      data: data
  })
}



