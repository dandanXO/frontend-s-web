import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import './assets/main.scss'
import 'primeicons/primeicons.css'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
// *** 關鍵的服務引入 ***
import ConfirmationService from 'primevue/confirmationservice';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(ToastService)
app.use(ConfirmationService)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: '.my-app-dark',
      cssLayer: false,
    },
  },
})

app.component('Toast', Toast)

app.mount('#app')
