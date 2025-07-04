<template>
  <PanelMenu :model="items" />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const items = ref([])
if(sessionStorage.getItem('memberType') === 'streamer'){
  items.value.push({
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
  {
    label: '拉黑管理',
    icon: 'pi pi-home',
    items: [
      {
        label: '拉黑名单',
        icon: 'pi pi-info-circle',
        command: () => {
          router.push('/chat-block/block-list')
        },
      },
    ],
  })
}

if (sessionStorage.getItem('memberType') === 'admin') {
  items.value.push({
    label: '体育直播',
    icon: 'pi pi-home',
    items: [
      {
        label: '体育直播监控',
        icon: 'pi pi-info-circle',
        command: () => {
          router.push('/live-sport/live-monitor')
        },
      },
      {
        label: '聊天室记录',
        icon: 'pi pi-info-circle',
        command: () => {
          router.push('/live-sport/live-history-block')
        },
      },
      {
        label: '聊天室会员禁言设定',
        icon: 'pi pi-info-circle',
        command: () => {
          router.push('/live-sport/live-block')
        },
      },
      {
        label: '聊天室VIP发言设定',
        icon: 'pi pi-info-circle',
        command: () => {
          router.push('/live-sport/chat-status')
        },
      },
      {
        label: '体育直播敏感词设定',
        icon: 'pi pi-info-circle',
        command: () => {
          router.push('/live-sport/sensitive-wrod')
        },
      },
      {
        label: '赛事管理',
        icon: 'pi pi-info-circle',
        command: () => {
          router.push('/live-sport/live-event')
        },
      },
      {
        label: '主播管理',
        icon: 'pi pi-info-circle',
        command: () => {
          router.push('/live-sport/live-streamer')
        },
      },
      {
        label: '队伍管理',
        icon: 'pi pi-info-circle',
        command: () => {
          router.push('/live-sport/live-team')
        },
      },
      {
        label: '电竞赛事',
        icon: 'pi pi-info-circle',
        command: () => {
          router.push('/live-sport/live-match')
        },
      },
      {
        label: '体育赛事',
        icon: 'pi pi-info-circle',
        command: () => {
          router.push('/live-sport/live-match-mars')
        },
      },
    ]
  })

}
</script>
