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
            const userId = response.data.id
            sessionStorage.setItem('token', token)
            sessionStorage.setItem('userId', userId)
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
        'token': `${token}`,
        'Content-Type': 'application/json'
      }
    })
  },

  // 更新敏感字
  updateSensitiveWord(data) {
    const token = sessionStorage.getItem('token')
    
    return api.put(`/session/sensitive-words/${data.id}`, data, {
      headers: {
        'token': `${token}`,
        'Content-Type': 'application/json'
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
  },
  // 查询聊天室记录
  getChatHistory(data) {
    const token = sessionStorage.getItem('token')

    return api.post('/session/live/history', data, {
      headers: {
        'token': `${token}`,
        'Content-Type': 'application/json'
      }
    })
  },
  blockUserApi(data) {
    const token = sessionStorage.getItem('token')

    return api.put('/session/block', data, {
      headers: {
        'token': `${token}`,
        'Content-Type': 'application/json'
      }
    })
  },
  unblockUserApi(data) {
    const token = sessionStorage.getItem('token')

    return api.put('/session/unblock', data, {
      headers: {
        'token': `${token}`,
        'Content-Type': 'application/json'
      }
    })
  },
  getBlockList() {
    const token = sessionStorage.getItem('token')

    return api.get('/session/block/list', {
      headers: {
        'token': `${token}`
      }
    })
  },
  updateRoomInfo(streamId, title, message) {
    const token = sessionStorage.getItem('token')
    return api.put(`/session/info/${streamId}`, { title, message }, {
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
          console.error('更新直播標題失敗:', error)
          return null
        })
  },
  getLiveMonitorScores(streamNames) {
    const token = sessionStorage.getItem('token');
    return api.get(`/session/monitor/score?streamNames=${streamNames.toString()}`, {
      headers: {
        'token': token
      }
    })
        .then(response => {
          if (response.code === 0) {
            return response.data;
          }
          return null;
        })
        .catch(error => {
          console.error('取得監控分數失敗:', error);
          return null;
        });
  }
}
