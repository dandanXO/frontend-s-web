<template>
  <div class="card" style="position: relative">
    <ProgressBar
      v-if="store.isAuthLoading"
      mode="indeterminate"
      style="height: 6px; position: absolute; top: 0px; width: 100%"
    ></ProgressBar>

    <Menubar :model="items">
      <template #start>
        <img width="50px" src="../../assets/logo.png" />
      </template>
      <template #item="{ item, props, hasSubmenu, root }">
        <BreacrumbComponent />
      </template>
      <template #end>
        <div class="flex items-center gap-2" style="display: flex; gap: 10px; align-items: center">
          <ThemeToggle />
          <!-- <SiteToggle /> -->
          <div style="display: flex; align-items: center; gap: 10px">
            <div
              style="
                display: inline-block;
                width: 8px;
                height: 8px;
                background: #67c23a;
                border-radius: 50%;
                margin-right: 10px;
              "
            ></div>
          </div>
          <!-- <LangToggle /> -->
          <Avatar
            image="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
            shape="circle"
          />
          <Button label="退出" severity="contrast" @click="onLogout" />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LangToggle from './LangToggle.vue'
import ThemeToggle from './ThemeToggle.vue'
import BreacrumbComponent from './BreacrumbComponent.vue'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/userStore'
import router from '@/router'

const store = useUserStore()

const items = ref([{}])

const toast = useToast()

const onLogout = () => {
  store.isAuthLoading = true

  sessionStorage.removeItem('token')
  store.isAuthLoading = false
  router.replace({ path: '/login' })
  toast.add({ severity: 'success', summary: '成功退出', life: 3000 })
}
</script>

<style lang="scss"></style>
