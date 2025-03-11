<template>
  <div class="layout">
    <HeaderComponent />

    <div class="content">
      <MegaMenu :model="items" orientation="vertical" style="height: fit-content">
        <template #start> </template>
      </MegaMenu>

      <RouterView />
      <!-- <Card>
      <template #title>Simple Card</template>
      <template #content>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error
          repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa
          ratione quam perferendis esse, cupiditate neque quas!
        </p>
      </template>
    </Card> -->
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import Card from 'primevue/card'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import HeaderComponent from './components/Header/HeaderComponent.vue'

const router = useRouter()

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
  padding: 10px;
  gap: 10px;

  .content {
    width: 100%;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
  }
}
</style>
