import { onBeforeMount, ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const isAuthLoading = ref(false)
  const theme = ref('light')

  onBeforeMount(() => {
    const theme = sessionStorage.getItem('theme')

    if (theme && theme === 'dark') {
      toggleDarkMode()
    }
  })

  const toggleDarkMode = () => {
    const isDarkMode = document.documentElement.classList.contains('my-app-dark')

    if (isDarkMode) {
      document.documentElement.classList.remove('my-app-dark')
      theme.value = 'light'
    } else {
      document.documentElement.classList.toggle('my-app-dark')
      theme.value = 'dark'
    }

    sessionStorage.setItem('theme', theme.value)
  }

  return { isAuthLoading, theme, toggleDarkMode }
})
