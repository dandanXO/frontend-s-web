import { createApp } from 'vue'
import vueI18n from './i18n'
import App from './App.vue'
import router from './router'
import { store } from './store'
import '@/assets/iconfont/iconfont.css'
import '@/styles/index.scss'
import 'element-plus/theme-chalk/index.css'
import 'normalize.css'
import * as directives from '@/directives'
import '@/permission'
import '@/icons'
import SvgIcon from '@/components/SvgIcon/index.vue'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import dayjs from 'dayjs'
import SlideVerify from '@/components/slider/index.vue'

dayjs.Ls.en.weekStart = 1
const app = createApp(App)
app.use(ElementPlus)

app.component('SvgIcon', SvgIcon)
app.component('SlideVerify', SlideVerify)

Object.keys(directives).forEach(key => {
  app.directive(key, directives[key])
})

app
  .use(createPinia())
  .use(vueI18n)
  .use(store)
  .use(router)
  .mount('#app')
var link = document.querySelector("link[rel~='icon']")
if (!link) {
  link = document.createElement('link')
  link.rel = 'icon'
  document.head.appendChild(link)
}
if (window.location.host.indexOf('dy') > -1 || window.location.pathname.indexOf('dy') > -1) {
  link.href = '/dy-favicon.ico'
} else if (window.location.host.indexOf('xf') > -1 || window.location.pathname.indexOf('xf') > -1) {
  link.href = '/xf-favicon.ico'
} else if (window.location.host.indexOf('my') > -1 || window.location.pathname.indexOf('my') > -1) {
  link.href = '/my-favicon.ico'
} else if (window.location.host.indexOf('vi') > -1 || window.location.pathname.indexOf('vi') > -1) {
  link.href = '/vi-favicon.ico'
} else if (
  window.location.host.indexOf('th') > -1 ||
  window.location.host.indexOf('ph') > -1
  || window.location.pathname.indexOf('th') > -1
  || window.location.pathname.indexOf('ph') > -1
) {
  link.href = '/th-favicon.ico'
} else if (window.location.host.indexOf('lh') > -1  || window.location.pathname.indexOf('lh') > -1) {
  link.href = '/lh-favicon.ico'
} else {
  link.href = '/dy-favicon.ico'
}
