import api from '../api/api'
import axios from 'axios'

export const DashboardService = {
  logIn(username, password) {
    return new Promise((resolve, reject) => {
      const formData = new FormData()

      formData.append('loginName', username)
      formData.append('password', password)

      api
        .post('/member/login', formData)
        .then((response) => {
          if (response.code == 0) {
            const token = response.data.token
            sessionStorage.setItem('token', token)
            resolve(true)
          } else {
            resolve(false)
          }
        })
        .catch((error) => {
          reject(false)
        })
    })
  },

  // 獲取流媒體列表
  getStreamList() {
    const token = sessionStorage.getItem('token')
    return api
      .get('/session/getSchedules', {
        headers: {
          'token': `${token}`
        }
      })
      .then((response) => {
        if (response.code === 0) {
          return response.data || [];
        }
        return [];
      })
      .catch((error) => {
        console.error('獲取流媒體列表失敗:', error)
        return [];
      })
  },

  // 獲取我的直播列表
  getMyStreams() {
    const token = sessionStorage.getItem('token')
    return api.get('/session/getMySchedule', {
      headers: {
        'token': `${token}`
      }
    })
    .then((response) => {
      if (response.code === 0) {
        return response.data || [];
      }
      return [];
    })
    .catch((error) => {
      console.error('獲取流媒體列表失敗:', error)
      return [];
    })
  },

  // 更改我的直播狀態
  changeMyStreamStatus(streamId, streamerStatus) {
    const token = sessionStorage.getItem('token')
    return api.put(`/session/changeMyScheduleStatus/${streamId}`, {
      streamerStatus
    }, {
      headers: {
        'token': `${token}`
      }
    })
    .then((response) => {
      if (response.code === 0) {
        return response.data
      }
      return null
      })
      .catch((error) => {
        console.error('更改我的直播狀態失敗:', error)
        return null
      })
  },

  // 獲取敏感字列表
  getSensitiveWords() {
    const token = sessionStorage.getItem('token')

    return api.get('/session/sensitive-words', {
      headers: {
        'token': `${token}`
      }
    })
  },

  // 新增敏感字
  addSensitiveWord(data) {
    const token = sessionStorage.getItem('token')

    return api.post('/session/sensitive-words', data, {
      headers: {
        'token': `${token}`
      }
    })
  },

  // 更新敏感字
  updateSensitiveWord(data) {
    const token = sessionStorage.getItem('token')

    return api.put(`/session/sensitive-words/${data.id}`, data, {
      headers: {
        'token': `${token}`
      }
    })
  },

  // 刪除敏感字
  deleteSensitiveWord(id) {
    const token = sessionStorage.getItem('token')

    return api.delete(`/session/sensitive-words/${id}`, {
      headers: {
        'token': `${token}`
      }
    })
  }
}
