import { reactive } from 'vue'

export const eventBus = reactive({
  toastQueue: [],
  showToast({ severity, summary, detail, life = 3000 }) {
    this.toastQueue.push({ severity, summary, detail, life })

    // Manually trigger reactivity
    this.toastQueue = [...this.toastQueue]
  },
  clearToast() {
    this.toastQueue = []
  },
})
