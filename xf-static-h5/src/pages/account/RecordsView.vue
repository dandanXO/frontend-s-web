<template>
  <div>
    <div class="transit-buttons">
      <router-link class="btn" v-for="(trans, i) in transitList" :key="i" :to="`records/${trans.code}`">
        <img :src="require(`../../assets/images/account/${trans.icon}_record.png`)">
        {{ trans.name }}
        <div class="right">
          <RiArrowRightSLine/>
        </div>
      </router-link>

    </div>
  </div>
</template>
<script setup>
import {ref} from "vue"
import {RiArrowRightSLine} from "vue-remix-icons"

components: {
  RiArrowRightSLine
}
const transitList = ref([
  {
    code: 'deposit',
    icon: 'deposit',
    name: '存款记录'
  },
  {
    code: 'withdraw',
    icon: 'withdraw',
    name: '提款记录'
  },
  {
    code: 'transfer',
    icon: 'transfer',
    name: '转账记录'
  },
  {
    code: 'moneyChange',
    icon: 'transfer',
    name: '账变记录'
  },
  {
    code: 'promo',
    icon: 'deposit',
    name: '优惠记录'
  },
  {
    code: 'bet',
    icon: 'change',
    name: '投注记录'
  },
  {
    code: 'financeFeedback',
    icon: 'help',
    name: '催单记录'
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
  gap: 10px;
  color: #bacef1;

  .btn {
    color: #bacef1;
    text-decoration: none;
    position: relative;
    background: #212534;
    padding: 15px 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 30px;

    img {
      width: 25px;
    }

    .right {
      position: absolute;
      right: 20px;

      svg {
        fill: #bacef1;
      }
    }
  }
}
</style>

