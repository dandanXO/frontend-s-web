<template>
  <Toast />

  <LoginView v-if="!isLoggedIn" />
  <BlockUI :blocked="store.isAuthLoading" v-else>
    <div class="layout">
      <HeaderComponent style="margin: 10px 10px 0" />

      <div class="content">
        <div>
          <!-- <MegaMenu
          :model="items"
          orientation="vertical"
          style="height: fit-content; margin-left: 10px"
        >
          <template #start> </template>
        </MegaMenu> -->

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
import { RouterView } from 'vue-router'
import HeaderComponent from './components/Header/HeaderComponent.vue'
import PanelMenuComponent from './components/PanelMenuComponent.vue'
import LoginView from './views/LoginView.vue'
import Toast from 'primevue/toast'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'

const store = useUserStore()

const { isLoggedIn } = storeToRefs(store)

// const items = ref([
//   {
//     label: '首页',
//     icon: 'pi pi-box',
//     command: () => {
//       router.push('/')
//     },
//   },
//   {
//     label: '会员管理',
//     icon: 'pi pi-box',
//     items: [
//       [
//         {
//           label: '会员',
//           items: [
//             {
//               label: '会员列表',
//               command: () => {
//                 router.push('/member-list')
//               },
//             },
//             { label: '会员编辑日志' },
//             { label: '会员账号冻结记录' },
//             { label: '会员账号冻结记录' },
//             { label: '会员平账记录' },
//           ],
//         },
//       ],
//       [
//         {
//           label: '代理',
//           items: [
//             { label: '代理列表' },
//             { label: '代理总结' },
//             { label: '代理存提汇总' },
//             { label: '代理存提汇总' },
//             { label: '代理平账记录' },
//           ],
//         },
//       ],
//       [
//         {
//           label: '邀请',
//           items: [{ label: '会员邀请统计' }, { label: '同步邀请关系' }],
//         },
//       ],
//     ],
//   },
//   {
//     label: '资金管理',
//     icon: 'pi pi-box',
//     items: [
//       [
//         {
//           label: '存款管理',
//           items: [{ label: '存提催单' }, { label: '线上存款' }, { label: '存款记录' }],
//         },
//       ],
//     ],
//   },
// ])
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
