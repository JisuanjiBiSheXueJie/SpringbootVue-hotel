import request from '@/utils/request'

const URL = 'admin'

export function login(username, password) {
  return request({
    url: URL + '/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token, username) {
  return request({
    url: URL + '/info',
    method: 'post',
    data: {
      token,
      username
    }
  })
}

export function getByUsername(val) {
  return request({
    url: URL + '/withUsername',
    method: 'post',
    data: {
      username: val
    }
  })
}

export function logout() {
  return request({
    url: URL + '/logout',
    method: 'post'
  })
}
