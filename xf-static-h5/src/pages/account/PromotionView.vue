<template>
  <div class="promotionbonus">
    <!-- <span class="menu-title">Mailbox</span> -->
    <div class="promo-items">
      <router-link :to="`/promo?name=${item.redirectUrl}&fromAccount=true`" v-for="(item, i) in promoList" :key="i" class="promo-item">
        <img :src="require(`../../assets/images/promotion/${item.icon}.png`)">
        {{ item.label }}
      </router-link>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue"
const promoList = ref([
  {
    code: '1',
    label: '邀请好友',
    icon: 'invite-friend',
    redirectUrl: 'invitefriend'
  },
  {
    code: '2',
    label: '救援金',
    icon: 'help'
  },
  {
    code: '3',
    label: '砸金蛋',
    icon: 'gold_egg',
    redirectUrl: 'goldenegg'
  },
  {
    code: '4',
    label: '福彩 3D',
    icon: 'fucai3d'
  },
  {
    code: '3',
    label: '兴发虎卡',
    icon: 'huka'
  },
  {
    code: '3',
    label: '棋牌复活金',
    icon: 'qipaifuhuo'
  },
  {
    code: '3',
    label: '真人复活金',
    icon: 'zhenrenfuhuo'
  },
  {
    code: '3',
    label: '红包雨',
    icon: 'hongbaoyu',
    redirectUrl: 'hongbaoyu'
  },
  {
    code: '3',
    label: '签到奖金',
    icon: 'qiandaojiangjin'
  },
  {
    code: '3',
    label: '新手任务',
    icon: 'newbie',
    redirectUrl: 'welcomenewuser'
  },
])
</script>
<style scoped lang="scss"> 
.promotionbonus {
  background: #212534;
  margin: 10px;
  padding: 5px;
  .promo-items {
    width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
      font-size: 11px;
      color: #bacef1;
      padding: 20px 0;
    .promo-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #323a4d;
      gap: 10px;
      padding: 10px;
      color: #ffffff;
      text-decoration: none;
    }
    img {
      width: 40px;
    }
  }
}
</style>
