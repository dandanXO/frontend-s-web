<template>
  <Toast />

  <LoginView v-if="!isLoggedIn" />
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
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import HeaderComponent from './components/Header/HeaderComponent.vue'
import PanelMenuComponent from './components/PanelMenuComponent.vue'
import LoginView from './views/LoginView.vue'
import Toast from 'primevue/toast'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'

const store = useUserStore()

const { isLoggedIn } = storeToRefs(store)
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
