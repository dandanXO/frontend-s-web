<template>
  <div class="hot-promo">
    <div v-if="list.id === 22 && !isCommonPromo && store.token" class="promo-4">
      <div class="tabs">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="Choose lucky number">
            <div class="tab1">
              <img src="../assets/images/promotion/hotpromo/22/icon.png" />
              <div class="contents">
                {{ selectedHotPromo.contents.tab1 }}
                <a-form>
                  <a-form-item>
                    <a-input
                      v-model:value="luckyNumber"
                      placeholder="Lucky number"
                    />
                  </a-form-item>
                  <a-form-item>
                    <a-button
                      class="claim-btn"
                      :loading="btnLoading"
                      @click="chooseLuckyNumber()"
                      >Submit</a-button
                    >
                  </a-form-item>
                </a-form>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="Lucky number record">
            <div class="tab2">
              <a-form :model="query" :layout="'inline'">
                <div class="firstrow">
                  <a-date-picker
                    key="1"
                    placeholder="Select Date"
                    v-model:value="query.recordTime"
                    value-format="YYYY-MM-DD"
                    format="YYYY-MM-DD"
                  />
                  <a-form-item label="Only me"
                    ><a-switch v-model:checked="query.onlyMe"
                  /></a-form-item>
                </div>
                <div class="secondrow">
                  <a-form-item
                    ><div class="common-btn" @click="retrieveList">
                      Filter
                    </div></a-form-item
                  >
                </div>
              </a-form>
              <div class="table">
                <a-table
                  :columns="columns"
                  row-key="loginName"
                  :data-source="dataSource"
                  :locale="{ emptyText: 'No information' }"
                >
                  <template #recordTime="{ text }">
                    <span>{{ humanDatetime(text) }}</span>
                  </template>
                </a-table>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="3" tab="Winner List">
            <div class="tab3">
              <a-form :model="winnersQuery" :layout="'inline'">
                <div class="firstrow">
                  <a-date-picker
                    placeholder="Select date"
                    v-model:value="winnersQuery.resultTime"
                    value-format="YYYY-MM-DD"
                    format="YYYY-MM-DD"
                    @change="retrieveWinnerList"
                  />
                </div>
                <div class="secondrow">
                  <a-form-item
                    ><div class="common-btn" @click="retrieveWinnerList">
                      Retrieve
                    </div></a-form-item
                  >
                </div>
              </a-form>
              <div class="table">
                <a-table
                  :columns="winnerColumns"
                  row-key="loginName"
                  :data-source="winnerDataSource"
                  :locale="{ emptyText: emptyText }"
                >
                  <template #resultTime="{ text }">
                    <span>{{ humanDatetime(text) }}</span>
                  </template>
                </a-table>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <ClaimPromo
      v-if="isCommonPromo && store.token"
      :promo-id="list.id"
      :loading-claim="loadingClaim"
      @daily-slot="handleSlot()"
    />
    <!-- <SJBPromo
      v-if="list.id === 40 && !isCommonPromo && store.token"
      class="promo-sjb"
    />
    <InviteFriendPromo
      v-if="list.id === 35 && !isCommonPromo"
      class="promo-sjb"
    /> -->
  </div>
  <a-modal v-model:visible="privilegeClaimedModalVisible" centered>
    <div class="modal-div">
      <span class="img-item">
        <div class="inner-contents">
          <div class="amount">{{ amount }}</div>
          <div class="bonus">Submit</div>
        </div>
      </span>
      <img src="../assets/images/index/bonus.svg" />
    </div>
  </a-modal>
</template>

<script>
import { defineComponent } from "vue";
import {
  submitLuckyNumber,
  claimBonusItem,
  luckyNumberList,
  winnerList,
} from "@/api/index/promo";
import { message } from "ant-design-vue";
import { userStore } from "@/store";
import moment from "moment";
import ClaimPromo from "../components/hotpromo/claimPromo.vue";
// import DailyBonus from "../components/hotpromo/39/dailyBonus.vue"
// import SJBPromo from "../components/hotpromo/40/shiJieBei.vue";
// import InviteFriendPromo from "../components/hotpromo/35/inviteFriendPromo.vue";

export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    ClaimPromo,
    // SJBPromo,
    // InviteFriendPromo,
    // DailyBonus
  },
  props: {
    list: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      isCommonPromo: null,
      emptyText: "No information",
      privilegeClaimedModalVisible: false,
      dataSource: [],
      winnerDataSource: [],
      activeKey: "1",
      hotPromoList: [
        // {
        //   id: 19,
        //   bg: require("../assets/images/promotion/hotpromo/19/bg.png"),
        //   contents:
        //     "*โบนัสเงินคืนต้องใช้โรลโอเวอร์ 1 เท่าก่อนที่จะถอนออก และจะได้รับคืนหากไม่ได้ใช้ภายใน 30 วัน",
        // },
        // {
        //   id: 20,
        //   bg: require("../assets/images/promotion/hotpromo/20/bg.png"),
        //   contents: "Hello hello",
        // },
        // {
        //   id: 21,
        //   bg: "",
        //   contents: "Hello hello",
        // },
        // {
        //   id: 22,
        //   bg: require("../assets/images/promotion/hotpromo/22/bg.png"),
        //   contents: {
        //     tab1: "Fill up the lucky number after the Member need meet deposit minimum amount of 1700VDNP or above. Once per day.",
        //   },
        // },
        // {
        //   id: 23,
        //   bg: require("../assets/images/promotion/hotpromo/23/bg.png"),
        //   contents: {
        //     tab1: "Fill up the lucky number after the Member need meet deposit minimum amount of 1700VDNP or above. Once per day.",
        //   },
        // },
        // {
        //   id: 24,
        //   bg: require("../assets/images/promotion/hotpromo/24/bg.png"),
        //   contents: {
        //     tab1: "Fill up the lucky number after the Member need meet deposit minimum amount of 1700VDNP or above. Once per day.",
        //   },
        // },
      ],
      selectedHotPromo: {
        id: "",
        bg: "",
        contents: "",
      },
      formState: {
        dateTime: "",
        onlyMe: false,
      },
      luckyNumber: null,
      query: {
        winStatus: "",
        recordTime: null,
        onlyMe: false,
      },
      winnersQuery: {
        resultTime: null,
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
          key: "1",
        },
        {
          title: "Name",
          dataIndex: "loginName",
          key: "2",
        },
        {
          title: "Status",
          dataIndex: "winStatus",
          key: "3",
        },
        {
          title: "Date",
          dataIndex: "recordTime",
          key: "recordTime",
          slots: { customRender: "recordTime" },
        },
      ],
      winnerColumns: [
        {
          title: "Number",
          dataIndex: "number",
          key: "number",
        },
        {
          title: "Name",
          dataIndex: "loginName",
          key: "loginName",
        },
        {
          title: "Status",
          dataIndex: "winStatus",
          key: "winStatus",
        },
        {
          title: "Date",
          dataIndex: "resultTime",
          key: "4",
          slots: { customRender: "resultTime" },
        },
      ],
    };
  },
  methods: {
    handleSlot() {
      this.loadingClaim = true;
      const bonusItem = this.list.promoCode;

      claimBonusItem(bonusItem)
        .then((res) => {
          if (res.code === 0) {
            this.amount = "$" + res.data;
            this.privilegeClaimedModalVisible = true;
            this.loadingClaim = false;
            this.store.getBalance();
          } else {
            message.error("res.message");
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
    },
  },
  mounted() {
    if (this.list.id === 22 || this.list.id === 35 || this.list.id === 40) {
      this.isCommonPromo = false;
    } else {
      this.isCommonPromo = true;
    }
    this.hotPromoList.forEach((element) => {
      if (this.list.id === element.id) {
        this.selectedHotPromo = element;
      }
    });
  },
});
</script>
<style lang="scss">
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
      background: #23263c;
      svg {
        fill: white;
      }
    }
  }
}
.ant-btn.claim-btn {
  color: #ffffff;
  background-image: linear-gradient(to right, #de4545, #db7e42);
  border: 0;
  :hover {
    opacity: 0.8;
  }
}
.hot-promo {
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  .promo-bg {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    &.isDesktop {
      display: block;
      height: 430px;
    }
    &.isMobile {
      display: none;
      height: 220px;
    }
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
          color: #ffffff;
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
