<template>
  <Toast />

  <LoginView v-if="!isLoggedIn" />
  <div class="layout" v-else>
    <HeaderComponent />

    <div class="content">
      <MegaMenu :model="items" orientation="vertical" style="height: fit-content">
        <template #start> </template>
      </MegaMenu>

      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, provide } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import HeaderComponent from './components/Header/HeaderComponent.vue'
import LoginView from './views/LoginView.vue'
import Toast from 'primevue/toast'
const router = useRouter()

const isLoggedIn = ref(true)

provide('isLoggedIn', isLoggedIn)

const items = ref([
  {
    label: '首页',
    icon: 'pi pi-box',
    command: () => {
      router.push('/')
    },
  },
  {
    label: '会员管理',
    icon: 'pi pi-box',
    items: [
      [
        {
          label: '会员',
          items: [
            {
              label: '会员列表',
              command: () => {
                router.push('/member-list')
              },
            },
            { label: '会员编辑日志' },
            { label: '会员账号冻结记录' },
            { label: '会员账号冻结记录' },
            { label: '会员平账记录' },
          ],
        },
      ],
      [
        {
          label: '代理',
          items: [
            { label: '代理列表' },
            { label: '代理总结' },
            { label: '代理存提汇总' },
            { label: '代理存提汇总' },
            { label: '代理平账记录' },
          ],
        },
      ],
      [
        {
          label: '邀请',
          items: [{ label: '会员邀请统计' }, { label: '同步邀请关系' }],
        },
      ],
    ],
  },
  {
    label: '资金管理',
    icon: 'pi pi-box',
    items: [
      [
        {
          label: '存款管理',
          items: [{ label: '存提催单' }, { label: '线上存款' }, { label: '存款记录' }],
        },
      ],
    ],
  },
])
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
    grid-template-columns: 1fr 85%;
    gap: 10px;
  }
}
</style>
