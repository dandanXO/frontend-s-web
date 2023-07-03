<template>
  <div class="hot-promo">
    <ClaimPromo
        v-if="isCommonPromo"
        :promo-id="list.id"
        :loading-claim="loadingClaim"
        @daily-slot="handleSlot()"
    />
    <TigerCardPromo v-if="!isCommonPromo && list.redirectUrl === 'dy1-tiger-card'"/>
    <GoldenEggPromo
        v-if="!isCommonPromo && list.redirectUrl === 'goldenegg' && store.token"
    />
    <HongBaoYuPromo
        v-if="!isCommonPromo && list.redirectUrl === 'hongbaoyu' && store.token"
    />
    <WelcomeTaskPromo
        v-if="
        !isCommonPromo && list.redirectUrl === 'welcomenewuser' && store.token
      "
    />
    <InviteFriendPromo
        v-if="list.redirectUrl === 'invitefriend' && !isCommonPromo"
    />
    <div v-if="list.redirectUrl === 'dy1-lottery' && !isCommonPromo && store.token" class="promo-4">
      <div class="tabs">
        <el-tabs v-model="activeKey" type="card">
          <el-tab-pane key="1" label="选择幸运号码">
            <div class="tab1">
              <!--              <img src="../assets/images/promotion/hotpromo/30/icon.png"/>-->
              <div class="contents">
                {{ selectedHotPromo.contents.tab1 }}
                <el-form>
                  <el-row gutter="10">
                    <el-col span="12">
                    <el-input
                        v-model="luckyNumber"
                        placeholder="幸运号码"
                    />
                    </el-col>
                    <el-col span="12">
                    <el-button
                        class="common-btn" 
                        :loading="btnLoading"
                        @click="chooseLuckyNumber()"
                    >提交
                    </el-button
                    >
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane key="2" label="记录">
            <div class="tab2">
              <el-form :model="query" :layout="'inline'">
                <el-row gutter="20" class="firstrow">
                  <el-col span="6">
                  <el-date-picker
                      key="1"
                      placeholder="选择日期"
                      v-model="query.recordTime"
                      value-format="YYYY-MM-DD"
                      format="YYYY-MM-DD"
                  />
                </el-col>
                <el-col span="6">
                  <el-form-item label="只显示自己"
                  >
                    <el-switch v-model="query.onlyMe"
                    />
                  </el-form-item>
                </el-col>
                <el-col span="6">
                  <el-form-item
                  >
                    <div class="common-btn" @click="retrieveList">
                      搜索
                    </div>
                  </el-form-item
                  ></el-col>
                  </el-row>
              </el-form>
              <div class="table">
                <!-- <el-table
                    :columns="columns"
                    row-key="loginName"
                    :datel-source="dataSource"
                    :locale="{ emptyText: '数据为空' }"
                >
                  <template #recordTime="{ text }">
                    <span>{{ humanDatetime(text) }}</span>
                  </template>
                </el-table> -->
                <el-table
                  :data="dataSource"
                >
                <template #empty>
                  <p>没有数据</p>
                </template>
                  <el-table-column prop="number" label="号码" />
                  <el-table-column prop="loginName" label="登录名" />
                  <el-table-column prop="winStatus" label="获奖状态" />
                  <el-table-column prop="recordTime" label="时间" />
                </el-table>
                <!-- <el-pagination
                  small
                  hide-on-single-page
                  layout="prev, pager, next"
                  @current-change="pageNumChange"
                  :total="rankingPage.records.length"
                  :current-page="rankingPage.current"
                  :page-size="rankingPage.pageSize"
                /> -->
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane key="3" label="获奖名单">
            <div class="tab3">
              <el-form :model="winnersQuery" :layout="'inline'">
                <el-row gutter="20" class="firstrow">
                  <el-col span="6">
                  <el-date-picker
                      placeholder="选择日期"
                      v-model="winnersQuery.resultTime"
                      value-format="YYYY-MM-DD"
                      format="YYYY-MM-DD"
                      @change="retrieveWinnerList"
                  /></el-col>
                  <el-col span="6">
                  <el-form-item
                  >
                    <div class="common-btn" @click="retrieveWinnerList">
                      搜索
                    </div>
                  </el-form-item
                  >
                  </el-col>
                  </el-row>
              </el-form>
              <div class="table">
                <!-- <el-table
                    :columns="winnerColumns"
                    row-key="loginName"
                    :datel-source="winnerDataSource"
                    :locale="{ emptyText: emptyText }"
                >
                  <template #resultTime="{ text }">
                    <span>{{ humanDatetime(text) }}</span>
                  </template>
                </el-table> -->
                <el-table
                  :data="winnerDataSource"
                >
                <template #empty>
                  <p>没有数据</p>
                </template>
                  <el-table-column prop="number" label="号码" />
                  <el-table-column prop="loginName" label="登录名" />
                  <el-table-column prop="winStatus" label="获奖状态" />
                  <el-table-column prop="resultTime" label="公告日期" />
                </el-table>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <el-dialog
        class="award-modal"
        :modal="false"
        v-model="privilegeClaimedModalVisible"
        align-center
    >
      <div class="modal-div">
        <span class="img-item">
          <div class="inner-contents">
            <div class="amount">{{ amount }}</div>
            <div class="bonus">奖金</div>
          </div>
        </span>
        <img src="../assets/images/index/bonus.svg"/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import {claimBonusItem,
  submitLuckyNumber,
  luckyNumberList,
  winnerList} from "@/api/index/promo";
import ClaimPromo from "../components/hotpromo/claimPromo.vue";
import TigerCardPromo from "../components/hotpromo/tigercard/tigerCardPromo.vue";
import GoldenEggPromo from "../components/hotpromo/goldenegg/goldenEggPromo.vue";
import HongBaoYuPromo from "../components/hotpromo/hongbaoyu/HongBaoYu.vue";
import InviteFriendPromo from "../components/hotpromo/invitefriend/inviteFriendPromo.vue";
import WelcomeTaskPromo from "../components/hotpromo/welcometask/welcomeTaskPromo.vue";
import {ElMessage} from "element-plus";
import {userStore} from "@/store";
import moment from "moment";


export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    ClaimPromo,
    TigerCardPromo,
    GoldenEggPromo,
    HongBaoYuPromo,
    InviteFriendPromo,
    WelcomeTaskPromo,
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
      emptyText: "今天没有获奖者。",
      privilegeClaimedModalVisible: false,
      dataSource: [],
      winnerDataSource: [],
      activeKey: "1",
      store: userStore(),
      btnLoading: false,
      loadingClaim: false,
      memberId: null,
      amount: "$0",
      hotPromoList: [
        // {
        //   id: 19,
        //   bg: require("../assets/images/promotion/hotpromo/19/bg.png"),
        //   contents:
        //     "*The rebate bonus needs 1 times rollover before withdrawing and will be returned if not used within 30 days.",
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
      columns: [
        {
          title: "号码",
          dataIndex: "number",
          key: "1",
        },
        {
          title: "登录名",
          dataIndex: "loginName",
          key: "2",
        },
        {
          title: "获奖状态",
          dataIndex: "winStatus",
          key: "3",
        },
        {
          title: "时间",
          dataIndex: "recordTime",
          key: "recordTime",
          slots: {customRender: "recordTime"},
        },
      ],
      winnerColumns: [
        {
          title: "号码",
          dataIndex: "number",
          key: "number",
        },
        {
          title: "登录名",
          dataIndex: "loginName",
          key: "loginName",
        },
        {
          title: "获奖状态",
          dataIndex: "winStatus",
          key: "winStatus",
        },
        {
          title: "公告日期",
          dataIndex: "resultTime",
          key: "4",
          slots: {customRender: "resultTime"},
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
              ElMessage.error(res.message);
              this.loadingClaim = false;
            }
          })
          .catch((err) => {
            console.log(err.message);
            // message.error(err.message, 4);
            this.loadingClaim = false;
          });
    },
    chooseLuckyNumber() {
      this.btnLoading = true;
      submitLuckyNumber(this.luckyNumber)
          .then((res) => {
            if (res.code === 0) {
              ElMessage.success({
                type: "success",
                message: "成功发送号码。"
              })
              this.luckyNumber = null;
              this.btnLoading = false;
            } else {
              ElMessage.error(res.message);
              this.btnLoading = false;
            }
          })
          .catch((err) => {
            console.log(err.message);
            // message.error(err.message, 4);
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
            // message.error(err.message, 4);
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
                this.emptyText = "今天没有获奖者。";
              }
            }
          })
          .catch((err) => {
            console.log(err.message);
            // message.error(err.message, 4);
          });
    },
    humanDatetime(ts) {
      return moment(ts).format("YYYY-MM-DD");
    },
  },
  mounted() {
    // console.log("Mount");
    // console.log(this.list);

    // List for non common promo
    if (
        this.list.redirectUrl === "dy1-tiger-card" ||
        this.list.redirectUrl === "goldenegg" ||
        this.list.redirectUrl === "hongbaoyu" ||
        this.list.redirectUrl === "invitefriend" ||
        this.list.redirectUrl === "welcomenewuser" ||
        this.list.redirectUrl === "dy1-lottery" ||
        this.list.id === 40
    ) {
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
.award-modal {
  background: none;
  box-shadow: none;

  .el-dialog__header .el-dialog__headerbtn {
    font-size: 40px;
    background: #3d8183;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .el-dialog__body {
    background: none;
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
      height: 500px;
    }

    &.isMobile {
      display: none;
      height: 220px;
    }
  }

  .common-promo {
    display: flex;
    justify-content: center;
    background-size: contain;
    gap: 30px;
    text-align: center;
    padding: 20px;

    .extrel-img {
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
        color: #ffd800;
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
      border-bottom: 0px solid #201f29;
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
      border: 1px solid #ffd800;
      box-shadow: rgb(0 0 0 / 100%) 0px 6px 12px 0px;
      width: 400px;
      text-align: center;

      &-active {
        background-image: linear-gradient(to right, #de4545, #ffd800);
      }
    }

    .ant-tabs-nav-container {
    }

    .ant-tabs .ant-tabs-top-content > .ant-tabs-tabpane,
    .ant-tabs .ant-tabs-bottom-content > .ant-tabs-tabpane {
      background: #201f29;
    }

    .ant-tabs-ink-bar {
      height: 0px;
      background-color: #201f29;
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
      background-color: #201f29;
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
          display: flex;
          justify-content: center;
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
          background: #ffd800;
        }
      }
    }
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

      .extrel-img {
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
