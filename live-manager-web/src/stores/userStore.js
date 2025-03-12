import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const isAuthLoading = ref(false)

  return { isLoggedIn, isAuthLoading }
})
