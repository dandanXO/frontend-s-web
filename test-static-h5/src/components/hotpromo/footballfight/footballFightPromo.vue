<template>
  <div class="promo-4">
    <div class="tabs">
      <q-tabs class="tabs" v-model="activeKey" indicator-color="transparent">
        <q-tab :class="{ tab: 'tab', active: activeKey === 'lucky-number' }" name="lucky-number">
          <h3>进行选号</h3>
        </q-tab>
        <q-tab :class="{ tab: 'tab', active: activeKey === 'record' }" name="record">
          <h3>玩家选号记录</h3>
        </q-tab>
        <q-tab :class="{ tab: 'tab', active: activeKey === 'winner' }" name="winner">
          <h3>玩家中奖名单</h3>
        </q-tab>
      </q-tabs>

      <q-tab-panels v-model="activeKey">
        <q-tab-panel name="lucky-number">
          <div class="desc q-mb-md">玩家达到存款500元后即可选号，可直接输入号码一天只能参加一次</div>
          <div class="tab1">
            <div class="left-container">
              <img src="../../../assets/images/promo/hotpromo/lottery/lucky_prize.png" />
            </div>
            <div class="right-container">
              <q-form>
                <div class="insert-lucky-num">
                  <q-label>请输入选号</q-label>
                  <q-input v-model="luckyNumber" placeholder="0" type="number" borderless />
                </div>
              </q-form>
              <q-btn color="brightbtn" :loading="luckyNumberBtnLoading" @click="chooseLuckyNumber()" label="立即领取" />
            </div>
          </div>

          <div class="q-mt-lg q-mb-md">
            <img src="../../../assets/images/promo/hotpromo/lottery/title-content.png" />
          </div>

          <div>
            <p>
              雷火用户打开:个人中心--点击“呼朋唤友"复制推广链接，通过QQ、微信、论坛、贴吧、微博等方式分享，成功邀请好友即
              可获得现金奖励!
            </p>
          </div>

          <div class="q-mt-lg">
            <img src="../../../assets/images/promo/hotpromo/lottery/title-rules.png" />
          </div>

          <div>
            <ol>
              <li>
                每个通过您推广链接进行注册，并完成相应首存的用户，您将获得对应的邀请奖金;每个受邀请人完成对应存款金额，在单周内
                邀请人能最高可获得4208元
              </li>
              <li>
                您每邀请一位新会员，从注册的日期开始算起，可享受4次推荐奖金，每个自然周一 00:00
                刷新1次，期间每个对应的档位奖金都 可以领取一次;逾期将会视为自动放弃。
              </li>
              <li>
                例如:会员A邀请一位好友首存100元，则可获取28元奖金;若想获取下一档位128元，则需好友再次存1000元;奖金将会自动派
                发至主钱包。
              </li>
              <li>邀请人等级不得低于青铜 I (vip2)</li>
              <li>普通会员账号变更成代理账号时，该活动将无法参加;已经参加活动的账号变成代理账号，会即刻终止发放奖金</li>
              <li>
                任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投
                注额内。
              </li>
              <li>
                邀请人与受邀请人必须为不同身份的真实玩家，每每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一
                个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。
              </li>
              <li>为避免文字理解差异，雷火电竞保留此活动最终解释权。</li>
            </ol>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <q-tab-panels v-model="activeKey">
        <q-tab-panel name="record">
          <div class="tab2">
            <q-form :model="query" :layout="'inline'">
              <q-row class="firstrow">
                <div class="date">
                  <q-input filled v-model="query.recordTime" mask="date" :placeholder="todayDate">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date
                            v-model="query.recordTime"
                            v-close-popup="dateClosePopup"
                            @navigation="dateClosePopup = false"
                            @update:model-value="dateClosePopup = true"
                          >
                            <!-- <q-date v-model="query.recordTime" @update:model-value="v-close-popup" > -->
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="关闭" color="primary" flat></q-btn>
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <q-btn color="brightbtn" @click="retrieveList()">查询</q-btn>

                <q-toggle v-model="query.onlyMe" label="只看自己" left-label />
              </q-row>
            </q-form>

            <q-table
              :columns="recordColumns"
              :rows="dataSource"
              no-data-label="暂无资料"
              :rows-per-page-options="[0]"
              :hide-pagination="true"
            ></q-table>
          </div>

          <div class="q-mt-lg q-mb-md">
            <img src="../../../assets/images/promo/hotpromo/lottery/title-content.png" />
          </div>

          <div>
            <p>
              3D福彩每天猜，iPhone 15 6.1英寸 128G雷火天天送!
              <br />
              活动时间:2021年6月12日起
              <br />
              活动对象:雷火全体会员
            </p>
          </div>

          <div class="q-mt-lg">
            <img src="../../../assets/images/promo/hotpromo/lottery/title-rules.png" />
          </div>

          <div>
            <ol>
              <li>
                每个通过您推广链接进行注册，并完成相应首存的用户，您将获得对应的邀请奖金;每个受邀请人完成对应存款金额，在单周内
                邀请人能最高可获得4208元
              </li>
              <li>
                您每邀请一位新会员，从注册的日期开始算起，可享受4次推荐奖金，每个自然周一 00:00
                刷新1次，期间每个对应的档位奖金都 可以领取一次;逾期将会视为自动放弃。
              </li>
              <li>
                例如:会员A邀请一位好友首存100元，则可获取28元奖金;若想获取下一档位128元，则需好友再次存1000元;奖金将会自动派
                发至主钱包。
              </li>
              <li>邀请人等级不得低于青铜 I (vip2)</li>
              <li>普通会员账号变更成代理账号时，该活动将无法参加;已经参加活动的账号变成代理账号，会即刻终止发放奖金</li>
              <li>
                任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投
                注额内。
              </li>
              <li>
                邀请人与受邀请人必须为不同身份的真实玩家，每每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一
                个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。
              </li>
              <li>为避免文字理解差异，雷火电竞保留此活动最终解释权。</li>
            </ol>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <q-tab-panels v-model="activeKey">
        <q-tab-panel name="winner">
          <div class="tab3">
            <!-- <q-form :model="winnersQuery" :layout="'inline'">
              <q-row class="firstrow">
                <div class="date">
                  <div>查询时间</div>
                  <q-input filled v-model="winnersQuery.resultTime" mask="date">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date
                            v-model="winnersQuery.resultTime"
                            v-close-popup="dateClosePopup"
                            @navigation="dateClosePopup = false"
                            @update:model-value="dateClosePopup = true"
                          >
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <div class="common-btn retrieve-btn" @click="retrieveWinnerList()">查询</div>
              </q-row>
            </q-form> -->

            <q-table
              :columns="winnerColumns"
              :rows="winnerDataSource"
              no-data-label="暂无资料"
              :rows-per-page-options="[0]"
              :hide-pagination="true"
            ></q-table>
          </div>

          <div class="q-mt-lg q-mb-md">
            <img src="../../../assets/images/promo/hotpromo/lottery/title-content.png" />
          </div>

          <div>
            <p>
              3D福彩每天猜，iPhone 15 6.1英寸 128G雷火天天送!
              <br />
              活动时间:2021年6月12日起
              <br />
              活动对象:雷火全体会员
            </p>
          </div>

          <div class="q-mt-lg">
            <img src="../../../assets/images/promo/hotpromo/lottery/title-rules.png" />
          </div>

          <div>
            <ol>
              <li>
                每个通过您推广链接进行注册，并完成相应首存的用户，您将获得对应的邀请奖金;每个受邀请人完成对应存款金额，在单周内
                邀请人能最高可获得4208元
              </li>
              <li>
                您每邀请一位新会员，从注册的日期开始算起，可享受4次推荐奖金，每个自然周一 00:00
                刷新1次，期间每个对应的档位奖金都 可以领取一次;逾期将会视为自动放弃。
              </li>
              <li>
                例如:会员A邀请一位好友首存100元，则可获取28元奖金;若想获取下一档位128元，则需好友再次存1000元;奖金将会自动派
                发至主钱包。
              </li>
              <li>邀请人等级不得低于青铜 I (vip2)</li>
              <li>普通会员账号变更成代理账号时，该活动将无法参加;已经参加活动的账号变成代理账号，会即刻终止发放奖金</li>
              <li>
                任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投
                注额内。
              </li>
              <li>
                邀请人与受邀请人必须为不同身份的真实玩家，每每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一
                个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。
              </li>
              <li>为避免文字理解差异，雷火电竞保留此活动最终解释权。</li>
            </ol>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { userStore } from "stores/index";
import { useQuasar, date } from "quasar";
import { submitLuckyNumber, luckyNumberList, winnerList } from "../../../api/index/promo";
import moment from "moment";
import { useNotify } from "src/hooks/notify";

const notify = useNotify();
const $q = useQuasar();
const store = userStore();

const activeKey = ref("lucky-number");

const todayDate = computed(() => {
  const format = "YYYY/MM/DD"; // define your desired format
  return date.formatDate(Date.now(), format);
});

// tab 1
const luckyNumber = ref(null);
const luckyNumberBtnLoading = ref(false);
function chooseLuckyNumber() {
  luckyNumberBtnLoading.value = true;

  submitLuckyNumber(luckyNumber.value)
    .then((res) => {
      if (res.code === 0) {
        notify({
          type: "success",
          message: "成功发送号码。",
        });
        luckyNumber.value = null;
      } else {
        notify({
          type: "error",
          message: res.message,
        });
      }
    })
    .catch(() => {})
    .then(() => {
      luckyNumberBtnLoading.value = false;
    });
}

// tab 2
const recordColumns = [
  {
    name: "loginName",
    label: "玩家账号",
    field: "loginName",
    align: "center",
    sortable: true
  },
  {
    name: "recordTime",
    label: "选号时间",
    field: "recordTime",
    align: "center",
    sortable: true
  },
  {
    name: "number",
    label: "玩家选号",
    field: "number",
    align: "center",
    sortable: true
  }
];

let memberId = null;
const query = reactive({
  winStatus: "",
  recordTime: null,
  onlyMe: false
});

const dataSource = ref([]);
function retrieveList() {
  if (query.recordTime) {
    if (query.onlyMe) memberId = store.id;
    else memberId = null;

    query.recordTime = moment(query.recordTime).format("YYYY-MM-DD");

    luckyNumberList(query, memberId)
      .then((res) => {
        const { code, data } = res;
        if (code === 0) {
          const newArray = [];
          for (let i = 0; i < data.length; i++) {
            const obj = data[i];
            let status = "";
            switch (obj.winStatus) {
              case "BET":
                status = "未开奖";
                break;
              case "WIN":
                status = "已中奖";
                break;
              case "LOSS":
                status = "未中奖";
                break;
              default:
                console.log("LotteryPromo :: retrieveList :: no such winStatus exist!");
                break;
            }
            obj.winStatus = status;
            newArray.push(obj);
          }
          dataSource.value = newArray;
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  } else {
    notify({
      type: "error",
      message: "请选择查询时间",
    });
  }
}

// tab 3
const winnerColumns = [
  {
    name: "resultTime",
    label: "中奖时间",
    field: "resultTime",
    align: "center"
  },
  {
    name: "loginName",
    label: "中奖名单",
    field: "loginName",
    align: "center"
  },
  {
    name: "number",
    label: "中奖号码",
    field: "number",
    align: "center"
  }
];

const winnersQuery = reactive({
  resultTime: null
});

const winnerDataSource = ref([]);
function retrieveWinnerList() {
  if (winnersQuery.resultTime) {
    winnerDataSource.value = [];

    winnersQuery.resultTime = moment(winnersQuery.resultTime).format("YYYY-MM-DD");

    winnerList(winnersQuery, memberId)
      .then((res) => {
        const { code, data } = res;
        if (code === 0) {
          data.forEach((element) => {
            element.winners.forEach((winner) => {
              winner.resultTime = element.resultTime;
              winnerDataSource.value.push(winner);
            });
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  } else {
    notify({
      type: "error",
      message: "请选择查询时间",
    });
  }
}

const closePopup = ref(true);
const dateClosePopup = ref(true);
</script>

<style scoped lang="scss">
.promo-4 {
  padding: 5px;

  .tabs {
    // .q-tabs {
    //   height: 64px;
    //   line-height: 64px;
    //   text-align: center;
    //   font-size: 23px;
    //   background: linear-gradient(0deg, #0094ff 0, #19c6ff 100%), linear-gradient(#2e3039, #2e3039);
    //   margin: 0;
    //   padding: 0;
    //   border-radius: 0;
    // }

    // .q-tab {
    //   flex: 1;
    //   color: white;
    //   border-radius: 0;

    //   &--active {
    //     background: #6ad8ff;
    //   }
    // }

    .tab {
      background: url(../../../assets/images/promo/hotpromo/privilegeinvite/btn-blue.png);
      width: 100%;

      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0.5;
      &.active {
        background: url(../../../assets/images/promo/hotpromo/privilegeinvite/btn-blue.png);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
        opacity: 1;
      }

      h3 {
        font-size: 13px;
        color: #ffffff;
        font-family: "Microsoft YaHei";
        font-weight: 800;
      }
    }

    .tab1 {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: row;
      gap: 10px;
      color: #ffffff;
      // background: salmon;
      background-image: url("../../../assets/images/promo/hotpromo/lottery/prize-bg.png");
      box-shadow: 0px -8px 8px 0px #c3d4e6 inset;
      border-radius: 8px;
      padding: 30px 20px;

      .insert-lucky-num {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #7a80a1;
        font-size: 16px;
        white-space: nowrap;

        :deep(.q-input) {
          display: flex;
          width: 88px;
        }
      }

      .left-container {
        img {
          // max-width: 150px;
          width: 100%;
        }
      }

      .right-container {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: flex-end;
        width: 320px;

        .desc {
          width: 90%;
          color: #87898a;
          line-height: 1.75em;
          font-size: 14px;
          text-align: center;
        }

        form {
          margin: 6px 0;

          :deep(.q-field__native) {
            font-size: 16px;
            height: 48px;
            text-align: center;
            background-color: #f4f7f8;
            border-radius: 6px;
            box-shadow: 0px 0px 8px 0px #a9c9ea inset;
            color: #424f72;
          }
        }
      }
    }

    .tab2,
    .tab3 {
      .firstrow {
        display: flex;
        align-items: center;
        justify-content: space-between;
        // background: white;
        margin-bottom: 12px;
        flex-wrap: nowrap;
        gap: 20px;

        .date {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          color: #87898a;
          box-shadow: 0px -4px 4px 0px #c3d4e6 inset;
          background: #ffffff;
          border-radius: 6px;

          :deep(.q-field__append) {
            padding: 0;
          }

          :deep(.q-field__native) {
            width: 120px;
          }

          :deep(.q-field__control),
          :deep(.q-field__marginal) {
            height: 30px;
          }
        }

        :deep(.q-toggle__label) {
          color: #87898a;
        }

        .retrieve-btn {
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          width: 75px;
          // background-image: linear-gradient(-41deg, #0094ff 0, #19c6ff 100%), linear-gradient(#10111a, #10111a);
          border-radius: 30px;
          font-weight: 600;
          margin-left: auto;
        }
      }

      :deep(.q-table th) {
        // background: linear-gradient(0deg, #0094ff 0, #19c6ff 100%), linear-gradient(#2e3039, #2e3039);
        // color: white;
      }

      :deep(.q-table td) {
        text-wrap: wrap;
      }

      :deep(.q-table__bottom--nodata) {
        margin: 0 auto;
      }
    }

    .common-btn {
      color: white;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 22px;
      width: 175px;
      background-image: linear-gradient(-41deg, #0094ff 0, #19c6ff 100%), linear-gradient(#10111a, #10111a);
      border-radius: 30px;
      font-weight: 600;
      opacity: 0.8;
    }
  }
}
</style>
