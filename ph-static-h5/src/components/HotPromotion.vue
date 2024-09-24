<template>
  <div class="hot-promo">
    <ClaimPromo
      v-if="isCommonPromo && store.hasToken()"
      :promo-id="list.id"
      :promo-code="list.promoCode"
      :loading-claim="btnLoading"
      @daily-slot="handleSlot(list.promoCode)"
    />
    <!-- <SJBPromo v-if="list.id === 40 && !isCommonPromo && store.hasToken()" class="promo-sjb" /> -->
    <!-- <InviteFriendPromo v-if="list.id === 35 && !isCommonPromo" class="promo-invt" /> -->
    <DailyLoginCashBonusPromo
      v-if="list.promoCode === 'P4W-VIP-DAILY-CHECKIN-BONUS' && !isCommonPromo"
      :pageContent="list.pageContent"
    />
    <SpinWheelPromo v-if="list.promoCode === 'P4W-ROULETTE-TOTO' && !isCommonPromo" :isModal="false" />
    <JiliTop50
      v-if="list.promoCode === 'P4W-TOP-BET' && !isCommonPromo"
      @claim-slot="handleSlot(list.promoCode)"
      :pageContent="list.pageContent"
    />

    <div v-if="list.promoCode === 'P4W-CNY-VIP-RED-PACKET'">
      <P4WRedPacket @claim-slot="handleSlot(list.promoCode)" />
    </div>
    <div v-if="list.promoCode === 'P4W-DOWNLOAD-BONUS'">
      <P4WApp @claim-slot="handleSlot(list.promoCode)" :loading-claim="btnLoading" :pageContent="list.pageContent" />
    </div>
  </div>

  <q-dialog v-model="isClaimModal" persistent>
    <q-card class="win-rebate-model">
      <q-card-section class="row items-center">
        <div class="bonus-svg-div">
          <span class="claim-amt">{{ claimMsg }}</span>
          <span class="bonus-text">Bonus</span>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="ตกลง" color="primary" v-close-popup />
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
// import SJBPromo from "../components/hotpromo/40/shiJieBei.vue";
// import InviteFriendPromo from "../components/hotpromo/35/inviteFriendPromo.vue";
import SpinWheelPromo from "../components/hotpromo/p4w-roulette-toto/SpinWheel.vue";
import P4WApp from "../components/hotpromo/p4wApp.vue";
import P4WRedPacket from "../components/hotpromo/p4wRedPacket.vue";
import DailyLoginCashBonusPromo from "../components/hotpromo/DAILY-LOGIN-CASH-BONUS/DailyLoginCashBonusPromo.vue";
import JiliTop50 from "../components/hotpromo/JiliTop50/JiliTop50Page.vue";

export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    ClaimPromo,
    // SJBPromo,
    // InviteFriendPromo,
    SpinWheelPromo,
    P4WApp,
    P4WRedPacket,
    DailyLoginCashBonusPromo,
    JiliTop50
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
  mounted() {
    this.hotPromoList.forEach((element) => {
      if (this.list.promoCode === element.promoCode) {
        this.selectedHotPromo = element;
      }
    });
    if (
      this.list.promoCode === "P4W-ROULETTE-TOTO" ||
      this.list.promoCode === "P4W-TOP-BET" ||
      this.list.promoCode === "P4W-CNY-VIP-RED-PACKET" ||
      this.list.promoCode === "P4W-DOWNLOAD-BONUS" ||
      this.list.promoCode === "P4W-VIP-DAILY-CHECKIN-BONUS"
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
      { name: "number", label: "Number", field: "number", align: "left", sortable: true },
      { name: "name", label: "Name", field: "loginName", align: "left", sortable: true },
      { name: "status", label: "Status", field: "winStatus", align: "left", sortable: true },
      { name: "date", label: "Date", field: "date", align: "left", sortable: true }
    ]);
    const dataSource = ref([]);
    const winnerDataSource = ref([]);

    const winnerColumn = [
      { name: "number", label: "Number", field: "number", align: "left", sortable: true },
      { name: "name", label: "Name", field: "loginName", align: "left", sortable: true },
      { name: "status", label: "Status", field: "winStatus", align: "left", sortable: true },
      { name: "date", label: "Date", field: "date", align: "left", sortable: true }
    ];

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

    const handleSlot = (promoCode) => {
      if (!store.token) {
        $q.notify({
          type: "negative",
          position: "top",
          message: `Login to continue.`,
          icon: "report_problem"
        });
        return;
      }

      const bonusItem = promoCode;
      const eventUrl = "/bonus/claim/" + bonusItem;
      btnLoading.value = true;
      eventapi
        .put(eventUrl)
        .then((res) => {
          btnLoading.value = false;
          var responseCode = res.data;
          if (responseCode.code === 0) {
            var rebatePoint = responseCode.data;
            claimMsg.value = "$" + rebatePoint;
            isClaimModal.value = true;
          } else {
            btnLoading.value = false;
          }
        })
        .catch((error) => {
          btnLoading.value = false;
        });
    };

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
          var data = res.data.data;
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

    const submitLuckyNumber = () => {
      console.log(lucky_number.value);
      var submit_number = lucky_number.value.toString();

      if (submit_number.length !== 3) {
        // $q.notify({
        //   color: "negative",
        //   position: "top",
        //   message: "Maximum 3 numbers",
        //   icon: "report_problem"
        // });
      } else {
        var user_id = store.id;

        var postData = {};
        postData.number = submit_number;
        postData.promoCode = "jolly88-iphone";

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
                message: "Number sent successfully",
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
      winnerColumn,
      filterColumn,
      loading,
      btnLoading,
      isClaimModal,
      claimMsg,
      handleSlot
    };
  }
});
</script>
<style lang="scss">
.hot-promo {
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

    .extra-img {
      position: absolute;
      right: 100px;
    }

    .contents {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
      padding: 10px;

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

    .ant-tabs-nav-container {
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
      background-color: #23263c;
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

          flex: 1;
          color: #ffffff;
          text-align: center;
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

  .bonus-svg-div {
    background-image: url("../assets/promo/BONUS.svg");
    background-repeat: no-repeat;
    width: 270px;
    height: 214px;
    margin: 12px auto 12px;
    background-position: center center;
    position: relative;

    .claim-amt {
      position: absolute;
      font-size: 33px;
      color: #fff;
      bottom: 28px;
      left: 50%;
      transform: translate(-50%, 0);
      font-family: "Wave";
    }

    .bonus-text {
      position: absolute;
      font-size: 24px;
      color: #ff3131;
      bottom: 0px;
      left: 50%;
      transform: translate(-50%, 0);
      font-weight: 700;
      font-family: "Jura";
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
