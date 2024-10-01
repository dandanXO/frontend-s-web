import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { i18n } from './i18n'
import { router } from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App)
.use(i18n)
.use(router)
.use(ElementPlus)
.mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})
