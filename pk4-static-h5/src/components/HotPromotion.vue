<template>
  <div class="hot-promo" :style="list.redirectUrl === 'pak-deposit-spinner-rewards' ? 'border-radius: 0;' : ''">
    <ClaimPromo
      v-if="isCommonPromo && store.hasToken()"
      :promo-id="list.id"
      :loading-claim="btnLoading"
      @daily-slot="handleSlot()"
    />
    <HongBaoYuPromo v-if="!isCommonPromo && list.redirectUrl === 'hongbaoyu'" />

    <BonusSpinWheelPromo v-if="list.redirectUrl === 'pak-spin-wheel' && !isCommonPromo && store.token" />
    <SignIn7DaysPromo v-if="list.redirectUrl === 'pak-signin-bonus' && !isCommonPromo && store.token" />
    <NewPlayerSpinWheelPromo
      v-if="list.redirectUrl === 'pak-newplayer-welcome-spin' && !isCommonPromo && store.token"
    />
    <NewPlayerWelcome
      v-if="list.redirectUrl === 'pak-welcome-new-players' && !isCommonPromo && store.token"
    />
    <RedPacketRainPromo v-if="list.redirectUrl === 'pak-redpacketrain' && !isCommonPromo && store.token" />
    <InterestProfitPromo v-if="list.redirectUrl === 'interest-profit' && !isCommonPromo && store.token" />
    <NewPlayersPromo v-if="list.redirectUrl === 'pak-new-players' && !isCommonPromo && store.token" :list="list" />
    <GoldenEggPromo v-if="!isCommonPromo && list.redirectUrl === 'pak-aviator-golden-egg' && store.token" />
    <SlotFtdPromo v-if="!isCommonPromo && list.redirectUrl === 'pak-slot-ftd' && store.token" :params="list.param" />
    <VideoAmbassador v-if="list.redirectUrl === 'pak-video-ambassador' && store.token" :params="list.param" />
    <JackpotAviator
      v-if="list.redirectUrl === 'pak-jackpot-aviator' && !isCommonPromo && store.token"
      :promocode="list.promoCode"
    />
    <DepositSpinnerRewards
      v-if="list.redirectUrl === 'pak-deposit-spinner-rewards' && store.token"
      :params="list.param"
    />
    <SpinLuckyWheelPromo v-if="list.redirectUrl === 'spin-lucky-wheel'" :params="list.param" />
    <NewPlayerAccDepositPromo v-if="list.redirectUrl === 'new-player-acc-deposit'" :params="list.param" />
    <PiggyBankPromo v-if="list.redirectUrl === 'pk4-piggy-bank' && store.token" :promocode="list.promoCode" />
    <MonthBeginningDepositRebate
      v-if="list.redirectUrl === 'pk4-month-beginning-deposit-rebate'"
      :params="list.param"
    />
  </div>

  <q-dialog v-model="isClaimModal" persistent>
    <q-card class="win-rebate-model">
      <q-card-section class="row items-center">
        <div class="bonus-svg-div">
          <span class="bonus-text">Congratulation!</span>
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
import ClaimPromo from "../components/hotpromo/claimPromo.vue";
import HongBaoYuPromo from "../components/hotpromo/hongbaoyu/HongBaoYu.vue";
import BonusSpinWheelPromo from "../components/hotpromo/bonusSpinWheel/BonusSpinWheelPromo.vue";
import SignIn7DaysPromo from "../components/hotpromo/signIn7Days/SignIn7DaysPromo";
import NewPlayerSpinWheelPromo from "../components/hotpromo/newPlayerWheel/NewPlayerWheelPromo.vue";
import RedPacketRainPromo from "../components/hotpromo/redPacketRain/RedPacketRainPromo.vue";
import InterestProfitPromo from "../components/hotpromo/interestProfit/InterestProfitPromo.vue";
import NewPlayersPromo from "../components/hotpromo/newPlayers/NewPlayersPromo.vue";
import SlotFtdPromo from "../components/hotpromo/slotFtdPromo/SlotFtdPromo.vue";
import GoldenEggPromo from "./hotpromo/goldenEgg/GoldenEggPromo.vue";

import VideoAmbassador from "./hotpromo/video-ambassador/VideoAmbassador.vue";
import DepositSpinnerRewards from "./hotpromo/deposit-spinner-rewards/DepositSpinnerRewards.vue";
import JackpotAviator from "./hotpromo/jackpotAviator/JackpotAviator.vue";
import SpinLuckyWheelPromo from "./hotpromo/spin-lucky-wheel/SpinLuckyWheelPromo.vue";
import NewPlayerAccDepositPromo from "./hotpromo/new-player-acc-deposit/NewPlayerAccDepositPromo.vue"
import NewPlayerWelcome from "../components/hotpromo/newPlayerSpinWheel/NewPlayerWheelPromo.vue"

export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    ClaimPromo,
    HongBaoYuPromo,
    BonusSpinWheelPromo,
    SignIn7DaysPromo,
    NewPlayerSpinWheelPromo,
    RedPacketRainPromo,
    InterestProfitPromo,
    NewPlayersPromo,
    SlotFtdPromo,
    VideoAmbassador,
    GoldenEggPromo,
    JackpotAviator,
    DepositSpinnerRewards,
    SpinLuckyWheelPromo,
    NewPlayerAccDepositPromo,
    NewPlayerWelcome
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
      isCommonPromo: null,
      activeKey: "1",
      hotPromoList: [],
      selectedHotPromo: {
        id: "",
        bg: "",
        contents: ""
      }
    };
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
            this.claimMsg = "₹" + rebatePoint;
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
    if (
      this.list.redirectUrl === "hongbaoyu" ||
      this.list.redirectUrl === "pak-spin-wheel" ||
      this.list.redirectUrl === "pak-signin-bonus" ||
      this.list.redirectUrl === "pak-newplayer-welcome-spin" ||
      this.list.redirectUrl === "pak-redpacketrain" ||
      this.list.redirectUrl === "interest-profit" ||
      this.list.redirectUrl === "pak-new-players" ||
      this.list.redirectUrl === "pak-slot-ftd" ||
      this.list.redirectUrl === "pak-aviator-golden-egg" ||
      this.list.redirectUrl === "pak-video-ambassador" ||
      this.list.redirectUrl === "pak-jackpot-aviator" ||
      this.list.redirectUrl === "pak-deposit-spinner-rewards" ||
      this.list.redirectUrl === "spin-lucky-wheel" ||
      this.list.redirectUrl === "new-player-acc-deposit" ||
      this.list.redirectUrl === "pak-welcome-new-players" ||
      this.list.id === 40
    ) {
      this.isCommonPromo = false;
    } else {
      this.isCommonPromo = true;
    }
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

    const lucky_number = ref("");
    const loading = ref(false);
    const btnLoading = ref(false);
    const isClaimModal = ref(false);
    const claimMsg = ref("");
    const formState = ref({
      dateTime: "",
      onlyMe: false,
      resultTime: ""
    });
    const filterColumn = ref([
      {
        name: "number",
        label: "号码",
        field: "number",
        align: "left",
        sortable: true
      },
      {
        name: "name",
        label: "名字",
        field: "loginName",
        align: "left",
        sortable: true
      },
      {
        name: "status",
        label: "状态",
        field: "winStatus",
        align: "left",
        sortable: true
      },
      {
        name: "date",
        label: "日期",
        field: "date",
        align: "left",
        sortable: true
      }
    ]);
    const dataSource = ref([]);
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

    const filterLuckyNumber = () => {
      loading.value = true;
      dataSource.value = [];

      var filterDate = formState.value.dateTime;
      var onlyMe = formState.value.onlyMe;
      var onlyMeParam = "";
      if (onlyMe) {
        var user_id = store.id;
        onlyMeParam = "&memberId=" + user_id;
      }

      var filterUrl = "/privi/selectedNumbers?recordTime=" + filterDate + onlyMeParam;

      // console.log(filterDate);
      eventapi
        .get(filterUrl)
        .then((res) => {
          loading.value = false;
          var data = res.data;
          _.each(data, function (item, index) {
            item.date = moment(item.recordTime).format("DD/MM/YYYY");
            dataSource.value.push(item);
          });

          console.log(dataSource.value);
        })
        .catch((error) => {
          loading.value = false;
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: error.message,
          //   icon: "report_problem"
          // });
        });
    };
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

    const submitLuckyNumber = () => {
      console.log(lucky_number.value);
      var submit_number = lucky_number.value.toString();

      if (submit_number.length !== 3) {
        // $q.notify({
        //   color: "negative",
        //   position: "top",
        //   message: "ขีดสุด 3 ตัวเลข",
        //   icon: "report_problem"
        // });
      } else {
        var user_id = store.id;

        var postData = {};
        postData.number = submit_number;
        postData.promoCode = "xf-iphone";

        var luckyNumberUrl = "/privi/lotteryNumber";
        btnLoading.value = true;
        eventapi
          .post(luckyNumberUrl, qs.stringify(postData))
          .then((res) => {
            btnLoading.value = false;
            var responseCode = res.data;
            console.log(responseCode);
            if (responseCode.code === 0) {
              $q.notify({
                color: "positive",
                position: "top",
                message: "发送成功",
                icon: "check_circle_outline"
              });
            } else {
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: responseCode.message,
              //   icon: "report_problem"
              // });
            }
          })
          .catch((error) => {
            btnLoading.value = false;
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: error.message,
            //   icon: "report_problem"
            // });
          });
      }
    };

    return {
      store,
      lucky_number,
      submitLuckyNumber,
      // loadLNWinnerList,
      filterLuckyNumber,
      filterWinnerLists,
      formState,
      dataSource,
      winnerDataSource,
      filterColumn,
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
    padding: 10px;

    img {
      max-width: 100px;
      margin: 0 auto;
    }

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

  .promo-4 {
    .ant-tabs-bar {
      border-bottom: 0px solid #2b2b4b;
      margin-bottom: 0;
      display: flex;
      justify-content: center;
      background: #212137;
    }

    .ant-tabs-nav .ant-tabs-tab {
      padding: 10px 48px;
      margin: 10px 5px 20px;
      color: #ffffff;
      font-size: 16px;
      border-radius: 10px;
      border: 1px solid #db7e42;
      box-shadow: rgb(0 0 0 / 100%) 0px 6px 12px 0px;
      width: 400px;
      text-align: center;

      &-active {
        background-image: linear-gradient(to right, #de4545, #db7e42);
      }
    }

    .ant-tabs .ant-tabs-top-content > .ant-tabs-tabpane,
    .ant-tabs .ant-tabs-bottom-content > .ant-tabs-tabpane {
      background: #2b2b4b;
    }

    .ant-tabs-ink-bar {
      height: 0px;
      background-color: #2b2b4b;
    }

    .table {
      padding: 20px;
    }

    .ant-table {
      background-color: transparent;
    }

    .ant-table-thead > tr > th,
    .ant-table-placeholder {
      color: #ffffff;
      background-color: #212534;
      border: 0;
    }

    .ant-table-placeholder {
      border: 0;
    }

    .tabs {
      .tab1 {
        display: flex;
        max-width: 900px;
        margin: 0 auto;
        gap: 20px;
        justify-content: space-evenly;
        align-items: center;
        padding: 20px;

        .contents {
          flex: 1;
          color: #ffffff;
          text-align: center;

          form {
            margin-top: 20px;

            input {
              max-width: 250px;
              width: 90%;
            }

            .common-btn {
              display: inline-block;
            }
          }
        }
      }

      .tab2 {
        .ant-form {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 20px;
          align-items: center;

          .firstrow {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
          }
        }

        .ant-form-item {
          margin: 0;
        }

        .ant-form-item-label > label {
          color: #ffffff;
        }

        .ant-switch-checked {
          background: #db7e42;
        }
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

  .bonus-svg-div {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: auto;

    .claim-amt {
      font-size: 33px;
      color: #fff;
      font-family: "Wave";
      text-align: center;
    }

    .bonus-text {
      font-size: 24px;
      // color: #ff3131;
      color: #ceab26;
      text-align: center;
      font-weight: 700;
      font-family: "Jura";
      white-space: nowrap;
    }
  }

  .q-btn-item {
    margin-top: 10px;
  }

  .q-btn__content {
    color: #fff;
    background-image: linear-gradient(to right, #de4545, #db7e42) !important;
    width: 80px;
    border-radius: 5px;
    -moz-border-radius: 5px;
  }
}

@media (max-width: 768px) {
  .hot-promo {
    .promo-bg {
      img {
        max-width: 100px;
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

    .promo-4 {
      .ant-tabs-nav .ant-tabs-tab {
        width: unset;
        padding: 10px;
      }

      .tabs {
        .tab1 {
          flex-direction: column;
        }

        .tab2 {
          .ant-form {
            align-items: flex-start;

            .firstrow {
              flex-direction: column;
            }
          }
        }
      }
    }
  }
}
</style>
