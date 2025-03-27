<template>
  <PanelMenu :model="items" />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const items = ref([
{
    label: '流媒体',
    icon: 'pi pi-user',
    items: [
      {
        label: '流媒体列表',
        icon: 'pi pi-user',
        command: () => {
          router.push('/stream/list')
        },
      },
      {
        label: '我的直播',
        icon: 'pi pi-user',
        command: () => {
          router.push('/stream/my-streams')
        },
      },
    ],
  },
  // {
  //   label: '会员',
  //   icon: 'pi pi-user',
  //   items: [
  //     {
  //       label: '会员列表',
  //       icon: 'pi pi-user',
  //       command: () => {
  //         router.push('/member/list')
  //       },
  //     },
  //     {
  //       label: '新增会员',
  //       icon: 'pi pi-user',
  //       command: () => {
  //         router.push('/member/add')
  //       },
  //     },
  //   ],
  // },
  // {
  //   label: '代理',
  //   icon: 'pi pi-user',
  //   items: [
  //     {
  //       label: '代理列表',
  //       icon: 'pi pi-user',
  //     },
  //     {
  //       label: '代理总结',
  //       icon: 'pi pi-user',
  //     },
  //     {
  //       label: '代理存提汇总',
  //       icon: 'pi pi-user',
  //     },
  //     {
  //       label: '代理平账记录',
  //       icon: 'pi pi-user',
  //     },
  //   ],
  // },
])
</script>
