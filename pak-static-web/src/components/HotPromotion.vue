<template>
  <div>
    <div v-if="!isCommonPromo && list.promoCode === 'P4W-ROULETTE-TOTO'">
      <Roulette ref="rouletteRef" :is-modal="false" />
      <div class="spinwheelevent-rules">
        <div class="spinwheelterms">
          <div class="spinwheelrule-title">Event terms</div>
          <p>For members with deposit amount over 300 at play4win.</p>
          <p>
            The account name, contact number, the bank card and E-wallet binded to the active member cannot be
            duplicated.
          </p>
          <div class="spinwheelrule-title">Who can help you to get reward</div>
          <p>
            It must not be the same as the IP, contact number, binded bank card and E-wallet of any member in play4win.
            Meanwhile, if anyone registration information is the same as any other members, cant help you increace your
            progress.
          </p>
        </div>
      </div>
    </div>
    <div v-if="!isCommonPromo && list.promoCode === 'P4W-TOP-BET'">
      <JiliTop50 @claim-slot="handleSlot()" :pageContent="list.pageContent" />
    </div>
    <div v-if="!isCommonPromo && list.promoCode === 'P4W-CNY-VIP-RED-PACKET'">
      <P4WRedPacket @claim-slot="handleSlot()" />
    </div>
    <div v-if="!isCommonPromo && list.promoCode === 'P4W-DOWNLOAD-BONUS'">
      <P4WApp @claim-slot="handleSlot()" :pageContent="list.pageContent" />
    </div>
    <div v-if="!isCommonPromo && list.promoCode === 'P4W-VIP-DAILY-CHECKIN-BONUS'">
      <DailyLoginCashBonusPromo :pageContent="list.pageContent" />
    </div>

    <ClaimPromo
      v-if="isCommonPromo && store.token"
      :promo-id="list.id"
      :promo-code="list.promoCode"
      :loading-claim="loadingClaim"
      @daily-slot="handleSlot()"
    />
  </div>
  <a-modal v-model:visible="privilegeClaimedModalVisible" centered>
    <div class="modal-div">
      <span class="img-item">
        <div class="inner-contents">
          <div class="amount">{{ amount }}</div>
          <div class="bonus">Okay</div>
        </div>
      </span>
      <img src="../assets/images/index/bonus.svg" />
    </div>
  </a-modal>
</template>

<script>
import { defineComponent } from "vue";
import { submitLuckyNumber, claimBonusItem, luckyNumberList, winnerList } from "@/api/index/promo";
import { message } from "ant-design-vue";
import { userStore } from "@/store";
import moment from "moment";
import ClaimPromo from "../components/hotpromo/claimPromo.vue";
import P4WApp from "../components/hotpromo/p4wApp.vue";
import P4WRedPacket from "../components/hotpromo/p4wRedPacket.vue";
import DailyLoginCashBonusPromo from "../components/hotpromo/DAILY-LOGIN-CASH-BONUS/DailyLoginCashBonusPromo.vue";
import Roulette from "@/components/roulette.vue";
import JiliTop50 from "./hotpromo/JiliTop50/JiliTop50.vue";
import { ElMessage } from "element-plus";
// import DailyBonus from "../components/hotpromo/39/dailyBonus.vue"
// import SJBPromo from "../components/hotpromo/40/shiJieBei.vue";
// import InviteFriendPromo from "../components/hotpromo/35/inviteFriendPromo.vue";

export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    ClaimPromo,
    P4WApp,
    P4WRedPacket,
    // SJBPromo,
    // InviteFriendPromo,
    // DailyBonus
    Roulette,
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
      emptyText: "No information",
      privilegeClaimedModalVisible: false,
      dataSource: [],
      winnerDataSource: [],
      activeKey: "1",
      hotPromoList: [],
      selectedHotPromo: {
        id: "",
        bg: "",
        contents: ""
      },
      formState: {
        dateTime: "",
        onlyMe: false
      },
      luckyNumber: null,
      query: {
        winStatus: "",
        recordTime: null,
        onlyMe: false
      },
      winnersQuery: {
        resultTime: null
      },
      store: userStore(),
      btnLoading: false,
      loadingClaim: false,
      memberId: null,
      amount: "$0",
      columns: [
        {
          title: "Number",
          dataIndex: "number",
          key: "1"
        },
        {
          title: "Name",
          dataIndex: "loginName",
          key: "2"
        },
        {
          title: "Status",
          dataIndex: "winStatus",
          key: "3"
        },
        {
          title: "Date",
          dataIndex: "recordTime",
          key: "recordTime",
          slots: { customRender: "recordTime" }
        }
      ],
      winnerColumns: [
        {
          title: "Number",
          dataIndex: "number",
          key: "number"
        },
        {
          title: "Name",
          dataIndex: "loginName",
          key: "loginName"
        },
        {
          title: "Status",
          dataIndex: "winStatus",
          key: "winStatus"
        },
        {
          title: "Date",
          dataIndex: "resultTime",
          key: "4",
          slots: { customRender: "resultTime" }
        }
      ]
    };
  },
  mounted() {
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
    this.hotPromoList.forEach((element) => {
      if (this.list.promoCode === element.promoCode) {
        this.selectedHotPromo = element;
      }
    });
    if (this.list.promoCode === "P4W-ROULETTE-TOTO") {
      this.$refs?.rouletteRef?.getSpinRoulette();
    }
  },
  methods: {
    handleSlot() {
      if (!this.store.token) {
        ElMessage({
          message: "Please login to continue.",
          type: "warning"
        });
        return;
      }
      this.loadingClaim = true;
      const bonusItem = this.list.promoCode;

      claimBonusItem(bonusItem)
        .then((res) => {
          if (res.code === 0) {
            this.amount = "$" + res.data;
            this.privilegeClaimedModalVisible = true;
            this.loadingClaim = false;
            this.store.getBalance();
          } else if (res.code === 100000) {
            message.info(res.message);
            this.loadingClaim = false;
          } else {
            message.error(res.message);
            this.loadingClaim = false;
          }
        })
        .catch((err) => {
          console.log(err.message);
          this.loadingClaim = false;
        });
    },
    // dailySlot(bonusItem) {
    //   this.loadingClaim = true;
    //   claimBonusItem(bonusItem)
    //     .then((res) => {
    //       if (res.code === 0) {
    //         this.amount = "$" + res.data;
    //         this.privilegeClaimedModalVisible = true;
    //         this.loadingClaim = false;
    //         this.store.getBalance();
    //       } else {
    //         this.loadingClaim = false;
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err.message);
    //       this.loadingClaim = false;
    //     });
    // },
    chooseLuckyNumber() {
      this.btnLoading = true;
      submitLuckyNumber(this.luckyNumber)
        .then((res) => {
          if (res.code === 0) {
            message.success("Number submitted");
            this.luckyNumber = null;
            this.btnLoading = false;
          } else {
            message.error("res.message");
            this.btnLoading = false;
          }
        })
        .catch((err) => {
          console.log(err.message);
          this.btnLoading = false;
        });
    },
    retrieveList() {
      if (this.query.onlyMe) {
        this.memberId = this.store.id;
      } else {
        this.memberId = null;
      }
      luckyNumberList(this.query, this.memberId)
        .then((res) => {
          if (res.code === 0) {
            this.dataSource = res.data;
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    retrieveWinnerList() {
      this.winnerDataSource = [];
      winnerList(this.winnersQuery, this.memberId)
        .then((res) => {
          if (res.code === 0) {
            res.data.forEach((element) => {
              element.winners.forEach((winner) => {
                winner.resultTime = element.resultTime;
                this.winnerDataSource.push(winner);
              });
            });
            if (this.winnerDataSource.length === 0) {
              this.emptyText = "There are no prize winners today.";
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    humanDatetime(ts) {
      return moment(ts).format("YYYY-MM-DD");
    }
  }
});
</script>
<style lang="scss">
.spinwheelevent-rules {
  padding: 20px;
  .spinwheelterms {
    .spinwheelrule-title {
      font-size: 24px;
      color: #222222;
    }
    p {
      color: #83a3ca;
      position: relative;
      padding-left: 20px;
      &:before {
        content: "";
        width: 8px;
        height: 8px;
        background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
        position: absolute;
        transform: rotateZ(45deg);
        left: 0px;
        top: 5px;
      }
    }
  }
}
.dark-theme {
  .spinwheelevent-rules {
    .spinwheelterms {
      .spinwheelrule-title {
        color: #ffffff;
      }
    }
  }
}
.modal-div {
  width: 340px;
  position: relative;
  margin: 0 auto;
  .img-item {
    color: rgb(255, 255, 255);
    position: absolute;
    left: 0px;
    right: 0px;
    margin: auto;
    top: 61%;
    text-align: center;
    .inner-contents {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  }
  .amount {
    font-size: 60px;
    line-height: 65px;
  }
  .bonus {
    color: rgb(228, 0, 35);
    font-size: 35px;
    font-weight: bold;
    line-height: 38px;
  }
}
.ant-calendar-picker {
  width: 100%;
  svg {
    fill: white;
  }
  &:hover {
    .ant-calendar-picker-clear {
      svg {
        fill: white;
      }
    }
  }
}
.ant-btn.claim-btn {
  background-image: linear-gradient(to right, #de4545, #db7e42);
  border: 0;
  :hover {
    opacity: 0.8;
  }
}
.hot-promo {
  padding: 20px;
  overflow: hidden;
  position: relative;
  .promo-bg {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    &.isDesktop {
      display: block;
      min-height: 430px;
      height: 40vh;
    }
    &.isMobile {
      display: none;
      height: 220px;
    }
  }
  .common-promo {
    background-size: contain;
    gap: 10px;
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

      font-size: 16px;
      border-radius: 10px;
      border: 1px solid #db7e42;
      box-shadow: rgb(0 0 0 / 100%) 0px 6px 12px 0px;
      width: 400px;
      text-align: center;
      background: #ffffff;
      &-active {
        background-image: linear-gradient(to right, #de4545, #db7e42);
      }
    }
    .ant-tabs-nav-container {
    }

    .ant-tabs .ant-tabs-top-content > .ant-tabs-tabpane,
    .ant-tabs .ant-tabs-bottom-content > .ant-tabs-tabpane {
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

          text-align: center;
        }
      }
      .tab2,
      .tab3 {
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
        }
        .ant-switch-checked {
          background: #db7e42;
        }
      }
    }
  }
  .promo-sjb {
    padding: 10px;
  }
}
@media (max-width: 767px) {
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
