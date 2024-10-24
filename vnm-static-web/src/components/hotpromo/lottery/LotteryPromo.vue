<template>
  <div class="promo-4">
    <div class="tabs">
      <el-tabs v-model="activeKey">
        <el-tab-pane :label="t('promo.choose_lucky_number')">
          <div class="tab1">
            <div class="left-container">
              <img src="../../../assets/images/promotion/hotpromo/lottery/lucky_number.png" />
            </div>
            <div class="right-container">
              <div class="desc">{{ t("promo.please_fill_lucky_number_label", { amount: "1700VDNP" }) }}</div>
              <el-form>
                <el-input v-model="luckyNumber" :placeholder="t('promo.please_fill_lucky_number')" />
              </el-form>
              <el-button class="common-btn" :loading="luckyNumberBtnLoading" @click="chooseLuckyNumber()">
                {{ t("promo.submit") }}
              </el-button>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="t('promo.lucky_number_record')">
          <div class="tab2">
            <el-form :model="query" :layout="'inline'">
              <el-row class="firstrow">
                <div class="date">
                  <div>{{ $t("promo.fill_up_record_time") }}</div>
                  <el-date-picker
                    key="1"
                    :placeholder="$t('promo.selectDate')"
                    v-model="query.recordTime"
                    value-format="YYYY-MM-DD"
                    format="YYYY-MM-DD"
                  />
                </div>

                <div class="date">
                  <div>{{ $t("common.record_win_status") }}</div>
                  <el-select class="q-mt-md" style="width: 150px" v-model="winStatusSelect">
                    <el-option v-for="p in winStatusOptions" :key="p.value" :value="p.value" :label="p.label">
                      {{ p.label }}
                    </el-option>
                  </el-select>
                </div>

                <!--                <el-form-item :label="t('promo.view_myself_record')">-->
                <!--                  <el-switch v-model="query.onlyMe" />-->
                <!--                </el-form-item>-->
                <div class="date">
                  <el-form-item>
                    <div class="common-btn retrieve-btn" @click="retrieveList()">{{ t("promo.check") }}</div>
                  </el-form-item>
                </div>
              </el-row>
            </el-form>

            <div class="table">
              <el-table :data="dataSource">
                <template #empty>
                  <p>{{ t("promo.no_data") }}</p>
                </template>
                <el-table-column prop="loginName" :label="t('promo.username')" />
                <el-table-column prop="recordTime" :label="t('promo.fill_up_record_time')" />
                <el-table-column prop="number" :label="t('promo.choose_lucky_number')" />
              </el-table>
            </div>
          </div>
        </el-tab-pane>

        <!-- <el-tab-pane :label="t('promo.list_of_winning_members')">
          <div class="tab3">
            <el-form :model="winnersQuery" :layout="'inline'">
              <el-row class="firstrow">
                <div class="date">
                  <div>{{ $t('promo.selectDate') }}</div>
                  <el-date-picker
                    key="1"
                    :placeholder="$t('promo.selectDate')"
                    v-model="winnersQuery.resultTime"
                    value-format="YYYY-MM-DD"
                    format="YYYY-MM-DD"
                  />
                </div>

                <el-form-item>
                  <div class="common-btn retrieve-btn" @click="retrieveWinnerList()">{{ t('promo.check') }}</div>
                </el-form-item>
              </el-row>
            </el-form>

            <div class="table">
              <el-table :data="winnerDataSource">
                <template #empty>
                  <emptyData />
                </template>
                <el-table-column prop="resultTime" :label="t('promo.date_of_win')" />
                <el-table-column prop="loginName" :label="t('promo.list_of_winners')" />
                <el-table-column prop="number" :label="t('promo.lucky_number_of_win')" />
              </el-table>
            </div>
          </div>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { userStore } from "@/store";
import { submitLuckyNumber, luckyNumberList, winnerList } from "@/api/index/promo";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = userStore();

const activeKey = ref("0");
const props = defineProps(["promoCode"]);

const winStatusSelect = ref();
const winStatusOptions = [
  { value: "BET", label: t("common.not_drawn_yet") },
  { value: "WIN", label: t("common.won") },
  { value: "LOSS", label: t("common.didnt_win") }
];

// tab 1
const luckyNumber = ref(null);
const luckyNumberBtnLoading = ref(false);
function chooseLuckyNumber() {
  luckyNumberBtnLoading.value = true;

  submitLuckyNumber(luckyNumber.value, props.promoCode)
    .then((res) => {
      if (res.code === 0) {
        ElMessage.success(t("common.successful_sent"));
        luckyNumber.value = null;
      } else {
        ElMessage.error({
          type: "error",
          message: res.message
        });
      }
    })
    .catch(() => {})
    .then(() => {
      luckyNumberBtnLoading.value = false;
    });
}

// tab 2
let memberId = null;
const query = reactive({
  winStatus: "",
  recordTime: null,
  onlyMe: false
});

const dataSource = ref([]);
function retrieveList() {
  if (query.onlyMe) memberId = store.id;
  else memberId = null;

  if (winStatusSelect.value) {
    query.winStatus = winStatusSelect.value;
  }

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
}

// tab 3
const winnersQuery = reactive({
  resultTime: null
});
const winnerDataSource = ref([]);
function retrieveWinnerList() {
  winnerDataSource.value = [];

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
}
</script>

<style scoped lang="scss">
.promo-4 {
  width: 100%;
  max-width: 1400px;
  margin: 50px auto;
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
    :deep(.el-tabs__nav) {
      width: 100%;
      display: flex;
      justify-content: center;
    }

    :deep(.el-tabs__item) {
      width: 33.33%;
      height: 100px;

      line-height: 64px;
      text-align: center;
      font-size: 23px;
      color: white;
      background: url(../../../assets/images/promotion/hotpromo/lottery/button.png) no-repeat center center;
      opacity: 0.6;
      background-size: 100% 100%;
      padding: 0;
    }

    :deep(.el-tabs__item.is-active) {
      opacity: 1;
      background: url(../../../assets/images/promotion/hotpromo/lottery/button.png) no-repeat center center;
      background-size: 100% 100%;
      padding: 0;
    }

    :deep(.el-tabs__active-bar) {
      height: 0;
    }
    :deep(.el-tabs__nav-wrap::after) {
      display: none;
    }

    .tab1 {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 50px;
      color: #ffffff;
      padding: 30px 20px;

      .right-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 335px;

        .desc {
          color: #7a8eb9;
          line-height: 1.75em;
          font-size: 14px;
          text-align: center;
        }

        form {
          margin: 20px 0;
          width: 100%;
          border: 1px solid #ebebeb;
          border-radius: 5px;

          :deep(.el-input__wrapper) {
            font-size: 16px;
            height: 48px;
            text-align: center;
            background-color: #ffffff;
            border-radius: 6px;
            color: #7a8eb9;
            box-shadow: none;
            width: 100%;
          }

          :deep(.el-input__inner) {
            text-align: center;
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
        gap: 50px;
        padding: 10px 45px;
        flex-wrap: nowrap;

        :deep(.el-form-item) {
          margin-bottom: unset;
        }

        .date {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }

        .retrieve-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px 50px;
        }
      }

      .table {
        :deep(.el-table) {
          background: white;
        }
        :deep(.el-table th.el-table__cell) {
          background: #e7f3ff;
          color: #000000;
          text-align: center;
        }
        :deep(.el-table td.el-table__cell) {
          text-align: center;
        }
      }

      .ant-form {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        padding: 20px;
        align-items: center;
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

    .common-btn {
      font-size: 20px;
      width: 80%;
      background-image: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      border-radius: 30px;
      opacity: 0.8;

      &:hover {
        opacity: 1;
      }
    }
  }
}

@media (max-width: 768px) {
  .promo-4 {
    .ant-tabs-nav .ant-tabs-tab {
      width: unset;
      padding: 10px;
    }

    .tabs {
      .tab1 {
        background: white;
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
</style>
