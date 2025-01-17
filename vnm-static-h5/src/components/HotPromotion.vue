<template>
  <div class="hot-promo">
    <LotteryPromo v-if="list.redirectUrl === 'vnm-iphone' && store.token" />

    <DailyLoginPromo v-if="list.redirectUrl === 'vi-daily-checkin'" />

    <ViPokerCashbackPromo v-if="list.redirectUrl === 'vi-poker-cashback'" />

    <ViSlotNetLossPromo v-if="list.redirectUrl === 'vi-slot-netloss'" />

    <tf88Baohiemvon v-if="list.redirectUrl === 'tf88-baohiemvon'" :promo-code="list.promoCode" />
    <olympicClaim v-if="list.redirectUrl === 'CHINHPHUC-OLYMPIC'" :promo-code="list.promoCode" />
    <ViPennyBankPromo v-if="list.redirectUrl === 'vi-penny-bank'" />

    <EuroCup2024 v-if="list.redirectUrl === 'vnm-eurocup24'" />
    <upgradeHongBaoPromo v-if="listParam.type === 'redpacket'" :promo-id="list.id" :promo-code="list.promoCode" />

    <EurocupLuckyDraw v-if="list.redirectUrl === 'vnm-eurocup-luckydraw'" />
    <EuroCup2024BetReward v-if="list.redirectUrl === 'vnm-euro-2024-bet-reward'" />
    <NewPlayerPromo v-if="list.redirectUrl === 'vnm-newplayer-welcome'" />
    <CnyLuckyDraw
      v-if="list.redirectUrl === 'vnm-2025-cny-lucky-draw'"
      :promo-id="list.id"
      :promo-code="list.promoCode"
    />
    <AseanM2024
      v-if="
        list.redirectUrl === 'dudoan-asean2024' ||
        list.redirectUrl === 'trotaidudoan-asean2024' ||
        list.redirectUrl === 'baohiemvon-20%asean'
      "
    />
    <ChristmasNewYear
      v-if="list.redirectUrl === 'vnm-xmas-new-year-lucky-draw'"
      :promo-code="list.promoCode"
      :promo-rules="list.pageContent"
    />
  </div>

  <q-dialog v-model="isClaimModal" persistent>
    <q-card class="win-rebate-model">
      <q-card-section class="row items-center">
        <div class="bonus-svg-div">
          <span class="bonus-text">恭喜获得奖金</span>
          <span class="claim-amt">{{ claimMsg }}</span>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="确定" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { userStore } from "stores/index";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";
import * as _ from "lodash";
import moment from "moment";
import LotteryPromo from "../components/hotpromo/lottery/LotteryPromo.vue";
import DailyLoginPromo from "../components/hotpromo/dailylogin/dailyLoginPromo.vue";
import ViPokerCashbackPromo from "../components/hotpromo/vipokercashback/viPokerCashbackPromo.vue";
import tf88Baohiemvon from "../components/hotpromo/tf88Baohiemvon/tf88Baohiemvon.vue";
import ViSlotNetLossPromo from "../components/hotpromo/vislotnetloss/viSlotNetLossPromo.vue";
import ViPennyBankPromo from "../components/hotpromo/vipennybank/viPennyBankPromo.vue";
import upgradeHongBaoPromo from "../components/hotpromo/upgradehongbao/upgradeHongBaoPromo.vue";
import EuroCup2024 from "./hotpromo/EuroCup2024/EuroCup2024.vue";
import EuroCup2024BetReward from "./hotpromo/euro2024BetReward/Euro2024BetReward.vue";
import EurocupLuckyDraw from "./hotpromo/EurocupLuckyDraw/EurocupLuckyDraw.vue";
import olympicClaim from "../components/hotpromo/olympic-claim/olympicClaim.vue";
import NewPlayerPromo from "@/components/hotpromo/newPlayer/NewPlayerPromo.vue";
import CnyLuckyDraw from "@/components/hotpromo/2025-cny-lucky-draw/2025CnyLuckyDraw.vue";
import AseanM2024 from "@/components/hotpromo/aseanM2024/AseanM2024.vue";
import ChristmasNewYear from "@/components/hotpromo/christmas-new-year/ChristmasNewYear.vue";

export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    tf88Baohiemvon,
    LotteryPromo,
    DailyLoginPromo,
    ViPokerCashbackPromo,
    ViSlotNetLossPromo,
    ViPennyBankPromo,
    upgradeHongBaoPromo,
    EuroCup2024,
    EuroCup2024BetReward,
    EurocupLuckyDraw,
    olympicClaim,
    NewPlayerPromo,
    CnyLuckyDraw,
    AseanM2024,
    ChristmasNewYear
    // CnyStepGame2024Promo
  },
  props: {
    list: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {
      activeKey: "1",
      hotPromoList: [],
      selectedHotPromo: {
        id: "",
        bg: "",
        contents: ""
      }
    };
  },
  computed: {
    listParam() {
      try {
        return JSON.parse(this.list.param);
      } catch (e) {
        console.log(e);
        return {};
      }
    }
  },
  methods: {
    handleSlot() {
      const bonusItem = this.list.promoCode;
      const eventUrl = "/bonus/claim/" + bonusItem;
      this.btnLoading = true;
      eventapi
        .put(eventUrl)
        .then((res) => {
          this.btnLoading = false;
          if (res.code === 0) {
            var rebatePoint = res.data;
            this.claimMsg = "￥" + rebatePoint;
            this.isClaimModal = true;
          } else {
            this.btnLoading = false;
          }
        })
        .catch((error) => {
          this.btnLoading = false;
        });
    }
  },
  mounted() {
    this.hotPromoList.forEach((element) => {
      if (this.list.id === element.id) {
        this.selectedHotPromo = element;
      }
    });
    const store = userStore();

    if (this.list.id == 30) {
      // console.log("Iphone promo");
      // this.loadLNWinnerList();
      if (store.hasToken()) {
        this.filterWinnerLists();
      }
    }
  },
  setup() {
    const $q = useQuasar();
    const store = userStore();
    var qs = require("qs");

    const loading = ref(false);
    const btnLoading = ref(false);
    const isClaimModal = ref(false);
    const claimMsg = ref("");
    const formState = ref({
      dateTime: "",
      onlyMe: false,
      resultTime: ""
    });

    const winnerDataSource = ref([]);
    const filterWinnerLists = () => {
      var resultTime = formState.value.resultTime;
      var winnerUrl = "/privi/winners";
      if (resultTime) {
        winnerUrl += "?resultTime=" + resultTime;
      }

      // console.log(winnerUrl);

      winnerDataSource.value = [];
      loading.value = true;
      eventapi.get(winnerUrl).then((res) => {
        loading.value = false;
        var data = res.data.data;

        for (let i in data) {
          _.each(data[i].winners, function (winner, index) {
            winner.date = moment(data[i].resultTime).format("DD/MM/YYYY");

            winnerDataSource.value.push(winner);
          });
        }
      });
    };

    // const loadLNWinnerList = () => {
    //   const winnerUrl = "/privi/winners";
    //   winnerDataSource.value = [];
    //   loading.value = true;
    //   eventapi
    //     .get(winnerUrl)
    //     .then((res) => {
    //       loading.value = false;
    //       var data = res.data.data;

    //       for (let i in data) {
    //         _.each(data[i].winners, function (winner, index) {

    //           winner.date = moment(data[i].resultTime).format("DD/MM/YYYY");
    //           console.log(winner);

    //           winnerDataSource.value.push(winner);
    //         })
    //       }
    //     });
    // }

    // const ClaimDailyRebate = (id) => {
    //   if (!store.hasToken()) {
    //   } else {
    //     // var user_id = store.id;
    //     var claim_id = '';
    //     if (id == 27) {
    //       claim_id = 'jolly88-daily-rebate';
    //     } else if (id == 32) {
    //       claim_id = 'jolly88-daily-slot';
    //     } else if (id == 31) {
    //       claim_id = 'jolly88-refund';
    //     }

    //     // console.log(eventapi);

    // }
    // }

    return {
      store,
      filterWinnerLists,
      formState,
      winnerDataSource,
      loading,
      btnLoading,
      isClaimModal,
      claimMsg
    };
  }
});
</script>
<style lang="scss">
.hot-promo {
  border-radius: 10px;
  overflow: hidden;
  position: relative;

  .promo-bg {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .common-promo {
    background-size: contain;
    gap: 30px;
    text-align: center;
    padding: 20px;

    .extra-img {
      position: absolute;
      right: 100px;
    }

    .contents {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 20px;
      padding: 20px;
      // color: #ffffff;

      .orange {
        color: #db7e42;
      }

      .common-btn {
        display: inline-block;
      }
    }

    &.p19 {
      gap: 120px;
      text-align: center;
    }

    &.p-2 {
      gap: 120px;
      text-align: center;
    }

    &.p-5 {
      gap: 60px;
      text-align: left;

      .ant-form-item-label > label {
        color: #eeeeee;
      }
    }

    &.p-6 {
      .contents {
        gap: 50px;
      }
    }
  }
}

.promo-sjb,
.promo-invt {
  background: #2b2b4b;
  padding: 10px;
}

.win-rebate-model {
  width: 80%;
  max-width: 450px;
  min-width: 300px;
  padding: 10px;
  background: transparent;
  position: relative;
  box-shadow: none;

  .close-btn {
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 5;

    .q-btn,
    .q-btn__content {
      margin-top: 0px;
      width: 40px;
      height: 40px;
    }

    .q-btn__content {
      color: #000;
      width: 8px;
      background-image: none !important;
    }
  }

  .bonus-svg-div {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: auto;

    .claim-amt {
      font-size: 30px;
      color: var(--q-primary);
      text-align: center;
    }

    .bonus-text {
      font-size: 22px;
      // color: #ff3131;
      color: var(--q-primary);
      text-align: center;
      font-weight: 700;
      white-space: nowrap;
    }
  }

  .q-btn-item {
    margin-top: 10px;
  }

  .q-btn__content {
    color: #fff;
    background-image: linear-gradient(90deg, #2d74f6 0, #7abdfc 100%) !important;
    width: 80px;
    border-radius: 5px;
    -moz-border-radius: 5px;
  }
}

@media (max-width: 768px) {
  .hot-promo {
    .promo-bg {
      img {
        max-width: 140px;
      }
    }

    .common-promo {
      flex-direction: column;
      background-position: top center;

      .extra-img {
        display: none;
      }

      &.p19,
      &.p-2,
      &.p-5,
      &.p-6 {
        gap: 20px;

        .contents {
          gap: 20px;
        }
      }
    }
  }
}
</style>
