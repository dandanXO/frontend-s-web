<template>
  <div>
    <div class="transit-buttons">
      <router-link class="btn" v-for="(trans, i) in transitList" :key="i" :to="`/account/transit/${trans.code}`">
        <img :src="require(`../../assets/images/account/${trans.code}.svg`)" />
        {{ trans.name }}
        <div class="right">
          <RiArrowRightSLine />
        </div>
      </router-link>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { RiArrowRightSLine } from "vue-remix-icons";

components: {
  RiArrowRightSLine;
}
const transitList = ref([
  {
    code: "deposit",
    icon: "deposit",
    name: "Deposit"
  },
  {
    code: "withdraw",
    icon: "withdraw",
    name: "Withdraw"
  },
  {
    code: "turnover",
    icon: "turnover",
    name: "Turnover"
  },
  // {
  //   code: 'transfer',
  //   icon: 'transfer',
  //   name: 'Transfer'
  // },
  {
    code: "rebates",
    icon: "rebates",
    name: "Rebates"
  },
  {
    code: "gameBetRecord",
    icon: "gameBetRecord",
    name: "Game Bet Record"
  },
  {
    code: "reminderRecord",
    icon: "reminderRecord",
    name: "Reminder Record"
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
    color: #000;
    text-decoration: none;
    font-size: 16px;
    font-weight: 600;
    position: relative;
    background: #ffffff;
    padding: 15px 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 30px;
    border-radius: 12px;

    img {
      width: 25px;
    }

    .right {
      position: absolute;
      right: 20px;

      svg {
        fill: #83a3ca;
        width: 12px;
      }
    }

    &:active {
      transform: translate(0px, 1px);
      filter: brightness(0.9);
    }
  }
}
.body--dark {
  .transit-buttons {
    img {
      filter: brightness(0) invert(1);
    }
    .btn {
      background: linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02));
      color: #ffffff;
    }
  }
}
</style>
