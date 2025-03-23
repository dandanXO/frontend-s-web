<template>
  <Toast />

  <RouterView v-if="router.currentRoute.value.path === '/login'" />

  <BlockUI :blocked="store.isAuthLoading" style="width: 100vw; height: 100vh" v-else>
    <div class="layout">
      <HeaderComponent style="margin: 10px 10px 0" />

      <div class="content">
        <div>
          <PanelMenuComponent style="height: fit-content; margin-left: 10px" />
        </div>

        <div style="margin-right: 10px">
          <RouterView />
        </div>
      </div>
    </div>
  </BlockUI>
</template>

<script setup>
import { ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import HeaderComponent from './components/Header/HeaderComponent.vue'
import PanelMenuComponent from './components/PanelMenuComponent.vue'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/userStore'
import router from './router'
import { eventBus } from './utils/eventBus'

const store = useUserStore()
const toast = useToast()

let toastTimeout = ref(null)

const processToastQueue = () => {
  try {
    if (eventBus.toastQueue.length > 0) {
      const currentToast = eventBus.toastQueue[0]
      toast.add(currentToast)

      toastTimeout.value = setTimeout(() => {
        eventBus.toastQueue.shift()
        processToastQueue()
      }, currentToast.life)
    }
  } catch (e) {}
}
watch(
  () => eventBus.toastQueue,
  (newQueue) => {
    if (newQueue.length > 0) {
      processToastQueue()
    }
  },
)
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .content {
    width: 100%;
    display: grid;
    grid-template-columns: 13% 87%;
    gap: 10px;
  }
}
</style>
