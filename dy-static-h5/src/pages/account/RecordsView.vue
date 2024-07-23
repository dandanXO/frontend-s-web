<template>
  <div>
    <div class="transit-buttons">
      <router-link class="btn" v-for="(trans, i) in transitList" :key="i" :to="`records/${trans.code}`">
        <img :src="require(`../../assets/records/${trans.icon}-icon.png`)" />
        {{ trans.name }}
        <div class="right">
          <img class="svg" src="~assets/records/arrow-right-s-line.svg" />
        </div>
      </router-link>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";

const transitList = ref([
  {
    code: "deposit",
    icon: "deposit",
    name: "存款记录"
  },
  {
    code: "withdraw",
    icon: "withdraw",
    name: "提款记录"
  },
  {
    code: "transfer",
    icon: "transfer",
    name: "转账记录"
  },
  {
    code: "moneyChange",
    icon: "moneychange",
    name: "账变记录"
  },
  {
    code: "promo",
    icon: "recommend",
    name: "优惠记录"
  },
  {
    code: "bet",
    icon: "cashhelp",
    name: "投注记录"
  },
  {
    code: "financeFeedback",
    icon: "feedback",
    name: "催单记录"
  }
  // {
  //   code: 'recommend',
  //   icon: 'recommend',
  //   name: '推荐好友记录'
  // },
  // {
  //   code: 'betRecord',
  //   icon: 'help',
  //   name: '投注记录'
  // },
]);
</script>
<style scoped lang="scss">
.transit-buttons {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 0px;
  color: #bacef1;

  .btn {
    border-top: 0.5px solid #0089ed50;
    color: #333;
    height: 46px;
    text-decoration: none;
    position: relative;
    background: #ffffff;
    padding: 10px 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 24px;

    img:not(.svg) {
      width: 22px;
    }

    .right {
      position: absolute;
      right: 18px;

      svg {
        fill: #757575;
      }
    }

    &:last-child {
      border-bottom: 0.5px solid #0089ed50;
    }
  }
}
</style>
