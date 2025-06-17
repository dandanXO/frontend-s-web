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
  },
  //sport-live
  getLiveSportMonitorList(data) {
    const token = sessionStorage.getItem('token');
    return api.post('/session/live-sport/monitor/query', data, {
      headers: {
        'token': `${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.code === 0) {
        return response.data;
      }
      return null;
    })
    .catch(error => {
      console.error('獲取監控列表失敗:', error)
      return null;
    });
  },
  // 獲取直播串流列表
getStreamList (request)  {
  const token = sessionStorage.getItem('token');
  return api.get('/session/live-sport/stream/list', { // 注意：原始是 GET, ContentType.form，這裡假設後端接口改為 POST
    headers: {
      'token': `${token}`,
      'Content-Type': 'application/json' // 根據原始 ContentType.form，可能需要確認後端實際預期的是什麼
    }
  })
  .then(response => {
    if (response.code === 0) {
      return response.data;
    }
    // 如果 code 不為 0，可以拋出錯誤或返回 null
    console.error('獲取串流列表失敗:', response.message || '未知錯誤');
    return null;
  })
  .catch(error => {
    console.error('獲取串流列表請求失敗:', error);
    return null;
  });
},

// 獲取聊天記錄
getChatHistory (query, body) {
  const token = sessionStorage.getItem('token');
  return api.post(`/session/live-sport/chat/history${query}`, body, {
    headers: {
      'token': `${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.code === 0) {
      return response.data;
    }
    console.error('獲取聊天記錄失敗:', response.message || '未知錯誤');
    return null;
  })
  .catch(error => {
    console.error('獲取聊天記錄請求失敗:', error);
    return null;
  });
},

// 封鎖用戶 API
blockUserApi (request)  {
  const token = sessionStorage.getItem('token');
  return api.put('/session/live-sport/chat-block', request, { // PUT 請求
    headers: {
      'token': `${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.code === 0) {
      return response.data; // 或直接返回 true/false 表示成功失敗
    }
    console.error('封鎖用戶失敗:', response.message || '未知錯誤');
    return null;
  })
  .catch(error => {
    console.error('封鎖用戶請求失敗:', error);
    return null;
  });
},

// 解除封鎖用戶 API
unblockUserApi  (request) {
  const token = sessionStorage.getItem('token');
  return api.put('/session/live-sport/chat-block/unblock', request, { // PUT 請求
    headers: {
      'token': `${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.code === 0) {
      return response.data; // 或直接返回 true/false 表示成功失敗
    }
    console.error('解除封鎖用戶失敗:', response.message || '未知錯誤');
    return null;
  })
  .catch(error => {
    console.error('解除封鎖用戶請求失敗:', error);
    return null;
  });
}
}
