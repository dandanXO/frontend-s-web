<template>
  <div class="promo-4">
    <div class="tabs">
      <el-tabs v-model="activeKey">
        <el-tab-pane label="进行选号">
          <div class="tab1">
            <div class="left-container">
              <img src="../../../assets/images/promotion/hotpromo/lottery/lucky_number.png" />
            </div>
            <div class="right-container">
              <div class="desc">玩家达到存款500元后即可选号，可直接输入号码一天只能参加一次</div>
              <el-form>
                <el-input v-model="luckyNumber" placeholder="请输入选号" />
              </el-form>
              <el-button class="common-btn" :loading="luckyNumberBtnLoading" @click="chooseLuckyNumber()">
                提交选号
              </el-button>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="玩家选号记录">
          <div class="tab2">
            <el-form :model="query" :layout="'inline'">
              <el-row class="firstrow">
                <div class="date">
                  <div>查询时间</div>
                  <el-date-picker
                    key="1"
                    placeholder="选择日期"
                    v-model="query.recordTime"
                    value-format="YYYY-MM-DD"
                    format="YYYY-MM-DD"
                  />
                </div>

                <el-form-item label="只看自己">
                  <el-switch v-model="query.onlyMe" />
                </el-form-item>

                <el-form-item>
                  <div class="common-btn retrieve-btn" @click="retrieveList()">查询</div>
                </el-form-item>
              </el-row>
            </el-form>

            <div class="table">
              <el-table :data="dataSource">
                <template #empty>
                  <p>暂无资料</p>
                </template>
                <el-table-column prop="loginName" label="玩家账号" />
                <el-table-column prop="recordTime" label="选号时间" />
                <el-table-column prop="recordNumber" label="玩家选号" />
              </el-table>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="玩家中奖名单">
          <div class="tab3">
            <el-form :model="winnersQuery" :layout="'inline'">
              <el-row class="firstrow">
                <div class="date">
                  <div>查询时间</div>
                  <el-date-picker
                    key="1"
                    placeholder="选择日期"
                    v-model="winnersQuery.resultTime"
                    value-format="YYYY-MM-DD"
                    format="YYYY-MM-DD"
                  />
                </div>

                <el-form-item>
                  <div class="common-btn retrieve-btn" @click="retrieveWinnerList()">查询</div>
                </el-form-item>
              </el-row>
            </el-form>

            <div class="table">
              <el-table :data="winnerDataSource">
                <template #empty>
                  <p>暂无资料</p>
                </template>
                <el-table-column prop="resultTime" label="中奖时间" />
                <el-table-column prop="loginName" label="中奖名单" />
                <el-table-column prop="resultNumber" label="中奖号码" />
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { userStore } from "@/store";
import { submitLuckyNumber, luckyNumberList, winnerList } from "@/api/index/promo";
import { ElMessage } from "element-plus";

const store = userStore();

const activeKey = ref("1");

// tab 1
const luckyNumber = ref(null);
const luckyNumberBtnLoading = ref(false);
function chooseLuckyNumber() {
  luckyNumberBtnLoading.value = true;

  submitLuckyNumber(luckyNumber.value)
    .then((res) => {
      if (res.code === 0) {
        ElMessage.success("成功发送号码。");
        luckyNumber.value = null;
      } else {
        ElMessage.error(res.message);
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
    }

    :deep(.el-tabs__item) {
      width: 33.33%;
      height: 64px;
      line-height: 64px;
      text-align: center;
      font-size: 23px;
      color: white;
      background: linear-gradient(0deg, #0094ff 0, #19c6ff 100%), linear-gradient(#2e3039, #2e3039);
    }

    :deep(.el-tabs__item.is-active) {
      background: #6ad8ff;
    }

    :deep(.el-tabs__active-bar) {
      height: 0;
    }

    .tab1 {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 50px;
      color: #ffffff;
      background: white;
      padding: 30px 20px;

      .right-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 335px;

        .desc {
          color: #87898a;
          line-height: 1.75em;
          font-size: 14px;
          text-align: center;
        }

        form {
          margin: 20px 0;

          :deep(.el-input__wrapper) {
            font-size: 16px;
            height: 48px;
            text-align: center;
            background-color: #f4f7f8;
            border-radius: 6px;
            border: 1px solid #87898a;
            color: #87898a;
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
        justify-content: space-between;
        background: white;
        padding: 10px 75px;

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
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          width: 237px;
          background-image: linear-gradient(-41deg, #0094ff 0, #19c6ff 100%), linear-gradient(#10111a, #10111a);
          border-radius: 30px;
          font-weight: 600;
        }
      }

      .table {
        :deep(.el-table) {
          background: white;
        }
        :deep(.el-table th.el-table__cell) {
          background: linear-gradient(0deg, #0094ff 0, #19c6ff 100%), linear-gradient(#2e3039, #2e3039);
          color: white;
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
      height: 61px;
      font-size: 29px;
      width: 237px;
      background-image: linear-gradient(-41deg, #0094ff 0, #19c6ff 100%), linear-gradient(#10111a, #10111a);
      border-radius: 30px;
      font-weight: 600;
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
