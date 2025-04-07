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
    icon: 'pi pi-sync',
    items: [
      {
        label: '流媒体列表',
        icon: 'pi pi-sync',
        command: () => {
          router.push('/stream/list')
        },
      },
      {
        label: '我的直播',
        icon: 'pi pi-sync',
        command: () => {
          router.push('/stream/my-streams')
        },
      },
    ],
  },
  {
    label: '後台管理',
    icon: 'pi pi-home',
    items: [
      {
        label: '敏感字列表',
        icon: 'pi pi-info-circle',
        command: () => {
          router.push('/sensitive-word/list')
        },
      },
    ],
  },
])
</script>
