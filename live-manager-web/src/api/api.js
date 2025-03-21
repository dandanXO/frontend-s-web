import axios from 'axios'
import { ResponseCode } from './response'
import router from '../router'
import { eventBus } from '../utils/eventBus'

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token')

    const isLoginPage = router.currentRoute.value.path === '/login'

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    } else if (!isLoginPage) {
      router.push({ name: 'login' })
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    if (
      response.data.code === ResponseCode.ERR_SYSTEM ||
      response.data.code === ResponseCode.ERR_USER_NOT_FOUND ||
      response.data.code === ResponseCode.ERR_DB_ACCESS
    ) {
      eventBus.showToast({
        severity: 'error',
        summary: 'Error',
        detail: response.data.message,
      })
      return Promise.reject(new Error(response.data.message))
    }
    return response.data
  },
  (error) => {
    eventBus.showToast({
      severity: 'error',
      summary: 'Error',
    })
    return Promise.reject(error)
  },
)

export default api
