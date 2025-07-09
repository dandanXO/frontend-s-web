<template>
  <div class="promo-4">
    <div class="tabs">
      <q-tabs v-model="activeKey">
        <q-tab name="lucky-number" label="进行选号" />
        <q-tab name="record" label="玩家选号记录" />
        <q-tab name="winner" label="玩家中奖名单" />
      </q-tabs>

      <q-tab-panels v-model="activeKey">
        <q-tab-panel name="lucky-number">
          <div class="tab1">
            <div class="left-container">
              <img src="../../../assets/images/promotion/hotpromo/lottery/lucky-iphone.png" />
            </div>
            <div class="right-container">
              <div class="desc">玩家达到存款500元后即可选号，可直接输入号码一天只能参加一次</div>
              <q-form>
                <q-input v-model="luckyNumber" placeholder="请输入选号" type="number" borderless />
              </q-form>
              <q-button class="common-btn" :loading="luckyNumberBtnLoading" @click="chooseLuckyNumber()">
                提交选号
              </q-button>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <q-tab-panels v-model="activeKey">
        <q-tab-panel name="record">
          <div class="tab2">
            <q-form :model="query" :layout="'inline'">
              <q-row class="firstrow">
                <div class="date">
                  <div>查询时间</div>
                  <q-input filled v-model="query.recordTime" mask="date">
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
                              <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <q-toggle v-model="query.onlyMe" label="只看自己" left-label />

                <div class="common-btn retrieve-btn" @click="retrieveList()">查询</div>
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
        </q-tab-panel>
      </q-tab-panels>

      <q-tab-panels v-model="activeKey">
        <q-tab-panel name="winner">
          <div class="tab3">
            <q-form :model="winnersQuery" :layout="'inline'">
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
            </q-form>

            <q-table
              :columns="winnerColumns"
              :rows="winnerDataSource"
              no-data-label="暂无资料"
              :rows-per-page-options="[0]"
              :hide-pagination="true"
            ></q-table>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { userStore } from "stores/index";
import { useQuasar } from "quasar";
import { submitLuckyNumber, luckyNumberList, winnerList } from "../../../api/index/promo";
import moment from "moment";

const $q = useQuasar();
const store = userStore();

const activeKey = ref("lucky-number");

// tab 1
const luckyNumber = ref(null);
const luckyNumberBtnLoading = ref(false);
function chooseLuckyNumber() {
  luckyNumberBtnLoading.value = true;

  submitLuckyNumber(luckyNumber.value)
    .then((res) => {
      if (res.code === 0) {
        $q.notify({
          type: "positive",
          position: "top",
          message: "成功发送号码。",
          icon: "check_circle_outline"
        });
        luckyNumber.value = null;
      } else {
        $q.notify({
          color: "negative",
          position: "top",
          message: res.message,
          icon: "report_problem"
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
    $q.notify({
      color: "negative",
      position: "top",
      message: "请选择查询时间",
      icon: "report_problem"
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
    $q.notify({
      color: "negative",
      position: "top",
      message: "请选择查询时间",
      icon: "report_problem"
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
    .q-tabs {
      height: 64px;
      line-height: 64px;
      text-align: center;
      font-size: 23px;
      background: linear-gradient(0deg, #0094ff 0, #19c6ff 100%), linear-gradient(#2e3039, #2e3039);
      margin: 0;
      padding: 0;
      border-radius: 0;
    }

    .q-tab {
      flex: 1;
      color: white;
      border-radius: 0;

      &--active {
        background: #6ad8ff;
      }
    }

    .tab1 {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 10px;
      color: #ffffff;
      background: white;
      padding: 30px 20px;

      .left-container {
        img {
          max-width: 150px;
        }
      }

      .right-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
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
            border: 1px solid #87898a;
            color: #87898a;
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
        background: white;
        padding: 20px;
        flex-wrap: wrap;
        gap: 20px;

        .date {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          color: #87898a;

          :deep(.q-field__append) {
            padding: 0;
          }

          :deep(.q-field__native) {
            width: 100px;
            padding: 0;
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
          background-image: linear-gradient(-41deg, #0094ff 0, #19c6ff 100%), linear-gradient(#10111a, #10111a);
          border-radius: 30px;
          font-weight: 600;
          margin-left: auto;
        }
      }

      :deep(.q-table th) {
        background: linear-gradient(0deg, #0094ff 0, #19c6ff 100%), linear-gradient(#2e3039, #2e3039);
        color: white;
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
