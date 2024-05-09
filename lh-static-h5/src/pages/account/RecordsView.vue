<template>
  <q-page>
    <div class="transit-buttons">
      <router-link class="btn btn-pointer" v-for="(trans, i) in transitList" :key="i" :to="`records/${trans.code}`">
        <!--        <img :src="require(`../../assets/images/account/${trans.icon}_record.png`)">-->
        {{ trans.name }}
        <div class="right">
          <img
            :src="
              $q.dark.isActive
                ? require('../../assets/images/account/account-right-small-dark.png')
                : require('../../assets/images/account/account-right-small.png')
            "
          />
        </div>
      </router-link>
    </div>
  </q-page>
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
    icon: "transfer",
    name: "账变记录"
  },
  {
    code: "promo",
    icon: "deposit",
    name: "优惠记录"
  },
  {
    code: "bet",
    icon: "change",
    name: "投注记录"
  },
  {
    code: "financeFeedback",
    icon: "help",
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
  gap: 0.9rem;

  .btn {
    color: $font-1;
    text-decoration: none;
    position: relative;
    background: $white;
    box-shadow: $shadow-bg;
    padding: 15px 16px 20px;
    display: flex;
    border-radius: 10px;
    justify-content: flex-start;
    align-items: center;
    gap: 30px;
    font-size: 1rem;

    img {
      width: 25px;
    }

    .right {
      position: absolute;
      right: 20px;

      img {
        width: 10px;
        height: auto;
      }
    }
  }
}

.body--dark {
  .transit-buttons {
    .btn {
      @include content-block-dark-with-border;
    }
  }
}
</style>
