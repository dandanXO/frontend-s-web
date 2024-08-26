<template>
  <div class="promo-title">精彩活动</div>
  <q-page class="promotion">
    <div class="promotion-item q-my-sm" v-for="(promo, promoIndex) in promoList" :key="`${promo}-${promoIndex}`">
      <div class="imgtext">
        <img :src="require(`../../assets/images/account/promo/${promo.icon}.png`)" />
        <div>
          <span class="title">{{ promo.label }}</span>
        </div>
      </div>
      <div class="promotion-right" @click="onPromoClick(promo, promoIndex)">
        <img class="promotion-btn" src="../../assets/images/download/active-tab-bg.png" />
        <span>立即领取</span>
      </div>
    </div>
  </q-page>

  <q-dialog class="modal-common-div" v-model="modalSuccess">
    <q-card style="width: 100%" class="modalcontent">
      <div class="headers">
        <div class="black-titles">优惠领取</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>

      <div class="contents">
        <img style="width: 2.5rem" src="../../assets/images/inbox/success-tick-icon.svg" />
        <p>优惠领取成功！</p>
      </div>

      <q-card-actions style="width: 100%" align="center" class="bg-white text-teal">
        <q-btn class="common-md-btn" flat label="确定" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog class="modal-common-div" v-model="modalFailed">
    <q-card style="width: 100%" class="modalcontent">
      <div class="headers">
        <div class="black-titles">优惠领取</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>

      <div class="contents">
        <img class="dialog-content-icon" src="../../assets/images/common/failed-icon.svg" />
        <p>
          优惠领取失败，请稍后再尝试。Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium dicta
          facilis quisquam sapiente tempore voluptatum? Commodi distinctio dolores labore laudantium magnam porro quae
          qui quisquam recusandae reprehenderit, repudiandae vel voluptate.
        </p>
      </div>

      <q-card-actions style="width: 100%" align="center" class="bg-white text-teal">
        <q-btn class="common-md-btn" flat label="确定" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";

const promoList = ref([
  {
    code: "1",
    label: "体育保险",
    icon: "sports"
  },
  {
    code: "2",
    label: "限时红包",
    icon: "red-packet"
  },
  {
    code: "3",
    label: "电竞保险",
    icon: "esports"
  },
  {
    code: "4",
    label: "签到活动",
    icon: "event"
  },
  {
    code: "5",
    label: "棋牌救援金",
    icon: "help-fund"
  },
  {
    code: "6",
    label: "集虎卡",
    icon: "tiger-card"
  },
  {
    code: "7",
    label: "福彩抽手机",
    icon: "phone"
  }
]);

const selectedPromo = ref();

const modalSuccess = ref(false);
const modalFailed = ref(false);

const onPromoClick = (promo, index) => {
  selectedPromo.value = promo;

  //FOR TESTING.
  if (index % 2 === 0) {
    modalSuccess.value = true;
  } else {
    modalFailed.value = true;
  }
};

onMounted(() => {});
</script>

<style scoped lang="scss">
.promo-title {
  background: $lightblue;
  color: #7a80a1;
  font-size: 1.4rem;
  font-weight: 400;
  text-align: center;
  padding: 0.5rem;
}

.promotion {
  width: $box-width;
  margin: 10px auto 30px;

  .promotion-item {
    background: $white;
    box-shadow: 0px -4px 6px 0px #c3d4e6 inset;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto 14px;
    padding: 1rem 0.8rem;

    .title {
      color: $primary;
      font-size: 1.3rem;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .content {
      font-size: 1rem;
      color: $font-1;
      margin-top: 5px;
    }

    .imgtext {
      display: flex;
      gap: 10px;
      justify-content: flex-start;
      align-items: center;

      img {
        width: 44px;
      }
    }

    .promotion-type {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: $font-1;
      font-size: 0.9rem;

      img {
        width: 20px;
      }
    }

    .promotion-right {
      display: flex;
      align-items: center;
      justify-content: center;

      .promotion-btn {
        width: 100px;
        height: 45px;
        margin-left: auto;
        display: block;
      }

      span {
        position: absolute;
        font-size: 1.2rem;
        font-weight: 500;
        color: white;
      }
    }
  }
}
</style>
