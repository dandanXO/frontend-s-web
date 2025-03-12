import { onBeforeMount, ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const isAuthLoading = ref(false)
  const theme = ref('light')

  onBeforeMount(() => {
    const token = sessionStorage.getItem('token')

    if (token) {
      isLoggedIn.value = true
    }

    const theme = sessionStorage.getItem('theme')

    if (theme && theme === 'dark') {
      toggleDarkMode()
    }
  })

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('my-app-dark')
    theme.value = 'dark'
    sessionStorage.setItem('theme', theme.value)
  }

  return { isLoggedIn, isAuthLoading, theme, toggleDarkMode }
})
