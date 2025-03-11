<template>
  <PanelMenu :model="items" />
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  {
    label: '会员',
    icon: 'pi pi-user',
    items: [
      {
        label: '会员列表',
        icon: 'pi pi-user',
      },
      {
        label: '会员编辑日志',
        icon: 'pi pi-user',
      },
      {
        label: '会员账号冻结记录',
        icon: 'pi pi-user',
      },
      {
        label: '会员平账记录',
        icon: 'pi pi-user',
      },
    ],
  },
  {
    label: '代理',
    icon: 'pi pi-user',
    items: [
      {
        label: '代理列表',
        icon: 'pi pi-user',
      },
      {
        label: '代理总结',
        icon: 'pi pi-user',
      },
      {
        label: '代理存提汇总',
        icon: 'pi pi-user',
      },
      {
        label: '代理平账记录',
        icon: 'pi pi-user',
      },
    ],
  },
])
</script>
