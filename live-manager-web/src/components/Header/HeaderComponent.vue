<template>
  <div class="card" style="position: relative">
    <ProgressBar
      v-if="isLoading"
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
          <SiteToggle />
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
            <div>Mobile: <span style="font-weight: bold">15</span></div>
            <div>PC: <span style="font-weight: bold">11</span></div>
            <div>
              <span style="color: #409eff">提现终审</span>: <span style="font-weight: bold">0</span>
            </div>
            <div>
              <span style="color: #409eff">风险终审</span>: <span style="font-weight: bold">0</span>
            </div>
          </div>
          <LangToggle />
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
import { ref, inject } from 'vue'
import LangToggle from './LangToggle.vue'
import SiteToggle from './SiteToggle.vue'
import BreacrumbComponent from './BreacrumbComponent.vue'
import { useToast } from 'primevue/usetoast'

const isLoading = ref(false)

const items = ref([{}])

const isLoggedIn = inject('isLoggedIn')

const toast = useToast()

const onLogout = () => {
  isLoading.value = true

  setTimeout(() => {
    isLoggedIn.value = false
    isLoading.value = false
    toast.add({ severity: 'success', summary: '成功退出', life: 3000 })
  }, 2000)
}
</script>

<style lang="scss"></style>
