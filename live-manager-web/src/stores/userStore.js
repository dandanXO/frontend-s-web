import { onBeforeMount, ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const isAuthLoading = ref(false)

  onBeforeMount(() => {
    const token = sessionStorage.getItem('token')

    if (token) {
      isLoggedIn.value = true
    }
  })

  return { isLoggedIn, isAuthLoading }
})
