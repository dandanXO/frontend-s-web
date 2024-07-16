<template>
  <div class="promo-4">
    <div class="tabs">
      <q-tabs class="tabs" no-caps v-model="activeKey" indicator-color="transparent">
        <q-tab :class="{ tab: 'tab', active: activeKey === 'lucky-number' }" name="lucky-number">
          <h3>{{ $t("lang.choose_lucky_number") }}</h3>
        </q-tab>
        <q-tab :class="{ tab: 'tab', active: activeKey === 'record' }" name="record">
          <h3>{{ $t("lang.lucky_number_record") }}</h3>
        </q-tab>
        <!-- <q-tab :class="{ tab: 'tab', active: activeKey === 'winner' }" name="winner">
          <h3>{{ $t("lang.winner_list") }}</h3>
        </q-tab> -->
      </q-tabs>

      <q-tab-panels v-model="activeKey">
        <q-tab-panel name="lucky-number">
          <div class="tab1">
            <div class="desc">
              {{ $t("lang.tab_01_desc") }}
            </div>

            <div class="tab1-content">
              <div class="left-container">
                <img src="../../../assets/images/promo/hotpromo/lottery/lucky_prize.png" />
              </div>
              <div class="right-container">
                <q-form @submit="chooseLuckyNumber">
                  <div class="insert-lucky-num">
                    <!-- <q-label>请输入选号</q-label> -->
                    <q-input v-model="luckyNumber" placeholder="0" type="number" borderless />
                  </div>
                </q-form>
                <q-btn
                  color="brightbtn"
                  style="width: 100%"
                  :loading="luckyNumberBtnLoading"
                  @click="chooseLuckyNumber()"
                  :label="$t('lang.vi_win_iphone_submit')"
                />
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <q-tab-panels v-model="activeKey">
        <q-tab-panel name="record">
          <div class="tab2">
            <q-form :model="query" :layout="'inline'">
              <q-row class="firstrow">
                <div>
                  <div class="date">
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
                                <q-btn v-close-popup :label="$t('lang.close_btn')" color="primary" flat></q-btn>
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <q-select
                    outlined
                    class="q-mt-md"
                    dense
                    v-model="winStatusSelect"
                    :options="winStatusOptions"
                    :label="$t('lang.record_win_status')"
                  />
                </div>
                <q-btn color="brightbtn" @click="retrieveList()">
                  {{ $t("lang.inquiry") }}
                </q-btn>
              </q-row>
              <q-row class="secondrow">
                <q-toggle v-model="query.onlyMe" :label="$t('lang.view_myself_record')" left-label />
              </q-row>
            </q-form>

            <q-table
              :columns="recordColumns"
              :rows="dataSource"
              :no-data-label="$t('lang.record_no_data')"
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

                <q-btn color="brightbtn" @click="retrieveWinnerList()">
                  {{ $t("lang.inquiry") }}
                </q-btn>
              </q-row>
            </q-form>

            <q-table
              :columns="winnerColumns"
              :rows="winnerDataSource"
              :no-data-label="$t('lang.record_no_data')"
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
import { ref, reactive, computed } from "vue";
import { userStore } from "stores/index";
import { useQuasar, date } from "quasar";
import { submitLuckyNumber, luckyNumberList, winnerList } from "../../../api/index/promo";
import moment from "moment";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
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
        $q.notify({
          type: "positive",
          position: "top",
          message: t("lang.number_sent_successful"),
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
    label: t("lang.record_username"),
    field: "loginName",
    align: "center",
    sortable: true
  },
  {
    name: "recordTime",
    label: t("lang.record_fill_up_record_time"),
    field: "recordTime",
    align: "center",
    sortable: true
  },
  {
    name: "number",
    label: t("lang.record_choose_lucky_number"),
    field: "number",
    align: "center",
    sortable: true
  },
  {
    name: "winStatus",
    label: t("lang.record_win_status"),
    field: "winStatus",
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
    query.winStatus = winStatusSelect.value.value;

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
                status = t("lang.not_drawn_yet");
                break;
              case "WIN":
                status = t("lang.won");
                break;
              case "LOSS":
                status = t("lang.didnt_win");
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
      message: t("lang.please_select_query_time"),
      icon: "report_problem"
    });
  }
}

const winStatusSelect = ref();
const winStatusOptions = [
  { value: "BET", label: t("lang.not_drawn_yet") },
  { value: "WIN", label: t("lang.won") },
  { value: "LOSS", label: t("lang.didnt_win") }
];

// switch (obj.winStatus) {
//   case "BET":
//     status = t("lang.not_drawn_yet");
//     break;
//   case "WIN":
//     status = t("lang.won");
//     break;
//   case "LOSS":
//     status = t("lang.didnt_win");
//     break;
//   default:
//     console.log("LotteryPromo :: retrieveList :: no such winStatus exist!");
//     break;
// }

// tab 3
const winnerColumns = [
  {
    name: "resultTime",
    label: t("lang.record_date_of_win"),
    field: "resultTime",
    align: "center"
  },
  {
    name: "loginName",
    label: t("lang.record_winner_list"),
    field: "loginName",
    align: "center"
  },
  {
    name: "number",
    label: t("lang.record_lucky_number_of_win"),
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
      message: t("lang.please_select_query_time"),
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
      background-size: 100% 100%;
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0.5;
      height: 50px;

      &.active {
        background: url(../../../assets/images/promo/hotpromo/privilegeinvite/btn-blue.png);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 100% 100%;
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
      flex-direction: column;
      gap: 10px;
      // background: salmon;
      background-image: url("../../../assets/images/promo/hotpromo/lottery/prize-bg.png");
      box-shadow: 0px -8px 8px 0px #c3d4e6 inset;
      border-radius: 8px;
      padding: 10px 20px;
      margin-top: 20px;

      .tab1-content {
        display: flex;
        gap: 10px;
      }

      .insert-lucky-num {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #7a80a1;
        font-size: 16px;
        white-space: nowrap;

        :deep(.q-input) {
          display: flex;
          // width: 88px;
        }
      }

      .left-container {
        img {
          // max-width: 150px;
          width: 100%;
        }
      }

      .desc {
        // width: 90%;
        color: #0f0f0f;
        line-height: 1.5;
        font-size: 14px;
        text-align: center;
      }

      .right-container {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        width: 240px;

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
        justify-content: center;
        // background: white;
        margin-bottom: 12px;
        flex-wrap: nowrap;
        gap: 20px;
        margin-top: 16px;

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

      .secondrow {
        justify-content: center;
        display: flex;
      }

      :deep(.q-table th) {
        white-space: wrap;
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
