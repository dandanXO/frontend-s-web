<template>
  <div>
    <div className="menu-title-container">
      <span className="menu-title">交易记录</span>
    </div>
    <div class="account-content transit">
      <el-tabs
        v-model="recordActive"
        @tab-click="searchRecord"
        type="card"
      >
        <el-tab-pane name="deposit" label="存款记录">
          <div>
            <el-form layout="inline" :model="searchForm.deposit">
              <div class="left">
                <el-form-item label="开始">
                  <el-date-picker
                    v-model="searchForm.deposit.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item label="结束">
                  <el-date-picker
                    v-model="searchForm.deposit.endDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item class="search">
                  <el-button type="success"
                    class="common-btn"
                    @click="searchRecord"
                  >搜索
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="unbind-record-wrapper">
            <el-table
              :data="dataState.deposit"
              :loading="loading"
            >
            <template #empty>
              <EmptyData />
            </template>

              <el-table-column v-for="tbl in tableColumns.deposit" :key="tbl.key" :prop="tbl.dataIndex" :label="tbl.title">
                <template v-if="tbl.dataIndex === 'depositDate'" #default="scope">
                  <div style="display: flex; align-items: center">
                    <span style="margin-left: 10px">{{ humanDatetime(scope.row.depositDate) }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-divider />
            <el-pagination
              @current-change="recordPage"
              :total="pagination.total"
              :current-page="searchForm[recordActive].current"
              :page-size="searchForm[recordActive].size"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane name="turnover" label="转账记录">
          <div>
            <el-form layout="inline" :model="searchForm.turnover">
              <div class="left">
                <el-form-item label="开始">
                  <el-date-picker
                    v-model="searchForm.turnover.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item label="结束">
                  <el-date-picker
                    v-model="searchForm.turnover.endDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="success"
                    class="common-btn"
                    @click="searchRecord"
                  >搜索
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="unbind-record-wrapper">
            <!-- <el-table
              :columns="tableColumns.turnover"
              :datel-source="dataState.turnover"
              :row-name="(record) => record.serialNumber"
              :loading="loading"
              :pagination="pagination"
              @change="recordPage"
            >
              <template #recordTime="{ text }">
                <span>{{ humanDatetime(text) }}</span>
              </template>
              <template #subType="{ record }">
                <span v-if="record.type === 'TRANSFER'">
                  {{
                    record.subType === "DEPOSIT" ? "TRANSFER IN" : "TRANSFER IN"
                  }}
                </span>
                <span v-else>
                  {{ record.subType }}
                </span>
              </template>
            </el-table> -->

            <el-table
              :data="dataState.turnover"
              :loading="loading"
            >
            <template #empty>
              <EmptyData />
            </template>

              <el-table-column v-for="tbl in tableColumns.turnover" :key="tbl.key" :prop="tbl.dataIndex" :label="tbl.title">
                <template v-if="tbl.dataIndex === 'recordTime'" #default="scope">
                  <div style="display: flex; align-items: center">
                    <span style="margin-left: 10px">{{ humanDatetime(scope.row.recordTime) }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-divider />
            <el-pagination
              @current-change="recordPage"
              :total="pagination.total"
              :current-page="searchForm[recordActive].current"
              :page-size="searchForm[recordActive].size"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane name="withdraw" label="提款记录">
          <div>
            <el-form layout="inline" :model="searchForm.withdraw">
              <div class="left">
                <el-form-item label="开始">
                  <el-date-picker
                    v-model="searchForm.withdraw.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item label="结束">
                  <el-date-picker
                    v-model="searchForm.withdraw.endDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="success"
                    class="common-btn"
                    @click="searchRecord"
                  >搜索
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="unbind-record-wrapper">
            <!-- <el-table
              :columns="tableColumns.withdraw"
              :datel-source="dataState.withdraw"
              :row-name="(record) => record.serialNumber"
              :loading="loading"
              :pagination="pagination"
              @change="recordPage"
            >
              <template #withdrawDate="{ text }">
                <span>{{ humanDatetime(text) }}</span>
              </template>
            </el-table> -->


            <el-table
              :data="dataState.withdraw"
              :loading="loading"
            >
            <template #empty>
              <EmptyData />
            </template>

              <el-table-column v-for="tbl in tableColumns.withdraw" :key="tbl.key" :prop="tbl.dataIndex" :label="tbl.title">
                <template v-if="tbl.dataIndex === 'recordTime'" #default="scope">
                  <div style="display: flex; align-items: center">
                    <span style="margin-left: 10px">{{ humanDatetime(scope.row.recordTime) }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>

            <el-divider />
            <el-pagination
              @current-change="recordPage"
              :total="pagination.total"
              :current-page="searchForm[recordActive].current"
              :page-size="searchForm[recordActive].size"
            />
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane name="transfer" label="Transfer">
          <div>
            <el-form layout="inline" :model="searchForm.transfer">
              <div class="left">
                <el-form-item label="开始">
                  <el-date-picker
                    v-model="searchForm.transfer.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item label="结束">
                  <el-date-picker
                    v-model="searchForm.transfer.endDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
              </div>
              <el-form-item>
                <el-button type="success"
                  class="common-btn"
                  @click="searchRecord"
                >搜索
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="unbind-record-wrapper">
            <el-table
              :columns="tableColumns.transfer"
              :datel-source="dataState.transfer"
              :row-name="(record) => record.serialNumber"
              :loading="loading"
              :pagination="pagination"
              @change="recordPage"
            >
              <template #type="{ record }">
                <span> {{ record.type }} - {{ record.platform }} </span>
              </template>
              <template #status="{ text, record }">
                <span>
                  <el-tag
                    :color="
                      record.status === 'SUCCESS'
                        ? '#87d068'
                        : record.status === 'SENDING'
                        ? '#55acee'
                        : '#cd201f'
                    "
                  >
                    {{ text }}
                  </el-tag>
                </span>
              </template>
              <template #transferDate="{ text }">
                <span>{{ "humanDatetime(text }}</span>
              </template>
            </el-table>
          </div>
        </el-tab-pane> -->
        <el-tab-pane name="rebates" label="优惠记录">
          <div>
            <el-form layout="inline" :model="searchForm.rebates">
              <div class="left">
                <el-form-item label="开始">
                  <el-date-picker
                    v-model="searchForm.rebates.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item label="结束">
                  <el-date-picker
                    v-model="searchForm.rebates.endDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="success"
                    class="common-btn"
                    @click="searchRecord"
                  >搜索
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="unbind-record-wrapper">

            <el-table
              :data="dataState.rebates"
              :loading="loading"
            >
            <template #empty>
              <EmptyData />
            </template>

              <el-table-column v-for="tbl in tableColumns.rebates" :key="tbl.key" :prop="tbl.dataIndex" :label="tbl.title">
                <template v-if="tbl.dataIndex === 'recordTime'" #default="scope">
                  <div style="display: flex; align-items: center">
                    <span style="margin-left: 10px">{{ humanDatetime(scope.row.recordTime) }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!-- <el-table
              :columns="tableColumns.rebates"
              :datel-source="dataState.rebates"
              :row-name="(record) => record.serialNumber"
              :loading="loading"
              :pagination="pagination"
              @change="recordPage"
            >
              <template #recordTime="{ text }">
                <span>{{ humanDatetime(text) }}</span>
              </template>
            </el-table>-->
            <el-divider />
            <el-pagination
              @current-change="recordPage"
              :total="pagination.total"
              :current-page="searchForm[recordActive].current"
              :page-size="searchForm[recordActive].size"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane
          name="gameBetRecord"
          label="投注记录"
        >
          <div class="payout-total">
            <div>总投注: {{ totalBetRecord.totalBet }}</div>
            <div>总派彩: {{ totalBetRecord.totalPayout }}</div>
          </div>
          <div>
            <el-form layout="inline" :model="searchForm.gameBetRecord">
              <div class="left">
                <el-form-item label="平台">
                  <el-select
                    allowClear
                    style="width: 300px"
                    v-model="searchForm.gameBetRecord.platform"
                    placeholder="平台"
                    @change="searchRecord"
                  >
                    <el-option
                      v-for="p in platformsList"
                      :key="p.name"
                      :value="p.name"
                    >
                      {{ p.name }}
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="开始">
                  <el-date-picker
                    v-model="searchForm.gameBetRecord.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item label="结束">
                  <el-date-picker
                    v-model="searchForm.gameBetRecord.endDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="success"
                    class="common-btn"
                    @click="searchRecord"
                  >搜索
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="unbind-record-wrapper">
            <!-- <el-table
              :columns="tableColumns.gameBetRecord"
              :datel-source="dataState.gameBetRecord"
              :row-key="(record) => record.gameType"
              :loading="loading"
              :pagination="pagination"
              @change="recordPage"
            >
            </el-table> -->

            <el-table
              :data="dataState.gameBetRecord"
              :loading="loading"
            >
            <template #empty>
              <EmptyData />
            </template>

              <el-table-column v-for="tbl in tableColumns.gameBetRecord" :key="tbl.key" :prop="tbl.dataIndex" :label="tbl.title">
                <template v-if="tbl.dataIndex === 'recordTime'" #default="scope">
                  <div style="display: flex; align-items: center">
                    <span style="margin-left: 10px">{{ humanDatetime(scope.row.recordTime) }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-divider />
            <el-pagination
              @current-change="recordPage"
              :total="pagination.total"
              :current-page="searchForm[recordActive].current"
              :page-size="searchForm[recordActive].size"
            />
          </div>
        </el-tab-pane>
      </el-tabs>

      <!-- <el-modal
        width="90%"
        v-model:visible="betRecordDialog"
        :maskClosable="false"
        :closable="true"
        :footer="null"
      >
        <div class="modal-head-title">บันทึกการเดิมพัน</div>
        <el-table
          :columns="tableColumns.betRecord"
          :datel-source="dataState.betRecord"
          :row-key="(record) => record.betId"
          :loading="loading"
          :pagination="betPagination"
          @change="recordBetPage"
        >
        </el-table>
      </el-modal> -->
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { loadRecords, gameBetRecordTotal } from "@/api/personal/personal";
import moment from "moment";
// import { message } from "ant-design-vue";
import { getPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";
import EmptyData from "@/components/emptyData.vue"
const store = userStore()
const recordActive = ref("deposit");
const totalBetRecord = reactive({
  totalBet: 0,
  totalPayout: 0
})
const searchForm = reactive({
  turnover: {
    startDate: "",
    endDate: "",
    current: 1,
    size: 10
  },
  rebates: {
    startDate: "",
    endDate: "",
    current: 1,
    size: 10
  },
  transfer: {
    startDate: "",
    endDate: "",
    current: 1,
    size: 10
  },
  withdraw: {
    startDate: "",
    endDate: "",
    current: 1,
    size: 10
  },
  deposit: {
    startDate: "",
    endDate: "",
    current: 1,
    size: 10
  },
  gameBetRecord: {
    startDate: "",
    endDate: "",
    platform: "",
    memberId: store.id,
    current: 1,
    size: 10
  },
  betRecord: {
    platform: "",
    gameType: "",
    memberId: store.id,
    current: 1,
    size: 10
  }
});
const dataState = reactive({
  deposit: [],
  rebates: [],
  transfer: [],
  withdraw: [],
  turnover: [],
  betRecord: [],
  gameBetRecord: []
});
const commonColumns = [
  {
    title: "Serial Number",
    dataIndex: "serialNumber",
    key: "serialNumber"
  }
];
const tableColumns = {
  deposit: [
    ...commonColumns,
    {
      title: "Amount",
      dataIndex: "depositAmount"
    },
    {
      title: "Status",
      dataIndex: "status"
    },
    {
      title: "Deposit Date",
      dataIndex: "depositDate",
      slots: { customRender: "depositDate" }
    }
  ],
  withdraw: [
    ...commonColumns,
    {
      title: "Amount",
      dataIndex: "withdrawAmount"
    },
    {
      title: "Status",
      dataIndex: "status"
    },
    {
      title: "Withdraw Date",
      dataIndex: "withdrawDate",
      slots: { customRender: "withdrawDate" }
    }
  ],
  transfer: [
    ...commonColumns,
    {
      title: "Trans Description",
      dataIndex: "type",
      key: "type",
      slots: { customRender: "type" }
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "withdrawAmount"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      slots: { customRender: "status" }
    },
    {
      title: "Transfer Date",
      dataIndex: "transferDate",
      key: "transferDate",
      slots: { customRender: "transferDate" }
    }
  ],
  rebates: [
    ...commonColumns,
    {
      title: "Privilege Name",
      dataIndex: "privilegeName"
    },
    {
      title: "Amount",
      dataIndex: "amount"
    },
    {
      title: "Record Time",
      dataIndex: "recordTime",
      slots: { customRender: "recordTime" }
    }
  ],
  turnover: [
    ...commonColumns,
    {
      title: "Type",
      dataIndex: "type"
    },
    {
      title: "Amount",
      dataIndex: "amount"
    },
    {
      title: "Sub Type",
      dataIndex: "subType",
      slots: { customRender: "subType" }
    },
    {
      title: "Record Time",
      dataIndex: "recordTime",
      slots: { customRender: "recordTime" }
    }
  ],
  gameBetRecord: [
    // {
    //   title: "รหัสเดิมพัน",
    //   dataIndex: "betId"
    // },
    {
      title: "Game Name",
      dataIndex: "gameName"
    },
    {
      title: "Platform",
      dataIndex: "platform"
    },
    {
      title: "Bet",
      dataIndex: "bet"
    },
    {
      title: "Payout",
      dataIndex: "payout"
    },
    // {
    //   title: "วงเงินก่อนหน้า",
    //   dataIndex: "beforeBalance"
    // },
    // {
    //   title: "วงเงินหลังจาก",
    //   dataIndex: "afterBalance"
    // },
    // {
    //   title: "สถานะการเดิมพัน",
    //   dataIndex: "betStatus"
    // },
    {
      title: "Type of game",
      dataIndex: "gameType"
    },
    // {
    //   title: "เวลาเดิมพัน",
    //   dataIndex: "betTime",
    //   slots: { customRender: "betTime" }
    // },
    // {
    //   title: "เวลาชำระเงิน",
    //   dataIndex: "settleTime",
    //   slots: { customRender: "settleTime" }
    // },
    // {
    //   title: "ผลลัพท์",
    //   dataIndex: "result"
    // },
    // {
    //   title: "",
    //   dataIndex: "actions",
    //   slots: { customRender: "actions" }
    // },
  ],
  betRecord: [
    {
      title: "รหัสเดิมพัน",
      dataIndex: "betId"
    },
    {
      title: "รหัสธุรกรรม",
      dataIndex: "transactionId"
    },
    {
      title: "แพลตฟอร์ม",
      dataIndex: "platform"
    },
    {
      title: "เดิมพัน",
      dataIndex: "bet"
    },
    {
      title: "การจ่ายเงิน",
      dataIndex: "payout"
    },
    {
      title: "วงเงินก่อนหน้า",
      dataIndex: "beforeBalance"
    },
    {
      title: "วงเงินหลังจาก",
      dataIndex: "afterBalance"
    },
    {
      title: "สถานะการเดิมพัน",
      dataIndex: "betStatus"
    },
    {
      title: "ประเภทของเกม",
      dataIndex: "gameType"
    },
    {
      title: "เวลาเดิมพัน",
      dataIndex: "betTime",
      slots: { customRender: "betTime" }
    },
    {
      title: "เวลาชำระเงิน",
      dataIndex: "settleTime",
      slots: { customRender: "settleTime" }
    },
    {
      title: "ผลลัพท์",
      dataIndex: "result"
    },
    // {
    //   title: "Bet ID",
    //   dataIndex: "betId"
    // },
    // {
    //   title: "Transaction ID",
    //   dataIndex: "transactionId"
    // },
    // {
    //   title: "Platform",
    //   dataIndex: "platform"
    // },
    // {
    //   title: "Bet",
    //   dataIndex: "bet"
    // },
    // {
    //   title: "Payout",
    //   dataIndex: "payout"
    // },
    // {
    //   title: "Before Balance",
    //   dataIndex: "beforeBalance"
    // },
    // {
    //   title: "After Balance",
    //   dataIndex: "afterBalance"
    // },
    // {
    //   title: "Bet Status",
    //   dataIndex: "betStatus"
    // },
    // {
    //   title: "Game Type",
    //   dataIndex: "gameType"
    // },
    // {
    //   title: "Bet Time",
    //   dataIndex: "betTime",
    //   slots: { customRender: "betTime" }
    // },
    // {
    //   title: "Settle Time",
    //   dataIndex: "settleTime",
    //   slots: { customRender: "settleTime" }
    // },
    // {
    //   title: "Result",
    //   dataIndex: "result"
    // },
    // {
    //   title: "Sport Bet Result",
    //   dataIndex: "sportBetResult"
    // },
  ]
};
const loading = ref(false);
const pagination = reactive({
  pageSize: 20,
  total: 0
});
const betPagination = reactive({
  pageSize: 20,
  total: 0
});

export default defineComponent({
  components: {
    EmptyData
  },
  name: "TransitRecordView",
  setup() {
    const searchRecord = (tab) => {
      if (tab) {
        recordActive.value = tab.props.name
      }
      // recordActive.value = key.props.name
      loading.value = true;
      if (recordActive.value === 'gameBetRecord') {
        getPlatList();
      }
      loadRecords(recordActive.value, searchForm[recordActive.value]).then((response) => {
        if (response.code === 0) {
          pagination.total = response.data.total;
          const dataSource = dataState[recordActive.value];
          //clear array and then push new record
          dataSource.splice(0);
          dataSource.push(...response.data.records);
        }
      }).catch((error) => {
        console.log("error", error);
        // message.error( error.message, 4 );
      }).then(() => {
        loading.value = false;
      });
    };

    const recordPage = (pagination) => {
      searchForm[recordActive.value].current = pagination;
      searchRecord();
    };
    const recordBetPage = (pagination) => {
      searchForm.betRecord.current = pagination.current
      betDetails(selectedBetRecord);
    }

    const chgDate = (val) => {
      var gapDate = new Date().getTime() - val * 24 * 60 * 60 * 1000;
      var oldDate = new Date(gapDate);
      var newDate = {
        Y: oldDate.getFullYear() + "-",
        M: (oldDate.getMonth() + 1) < 10 ? "0" + (oldDate.getMonth() + 1 + "-") : (oldDate.getMonth() + 1 + "-"),
        D: (oldDate.getDate()) < 10 ? "0" + (oldDate.getDate() + "") : (oldDate.getDate() + "")
      };
      var useDate = newDate.Y + newDate.M + newDate.D;
      return useDate;
    };

    const getTime = () => {
      ["deposit", "rebates", "transfer", "turnover", "withdraw", "gameBetRecord"].forEach(function(v) {
        if (v in searchForm) {
          searchForm[v].startDate = chgDate(7);
          searchForm[v].endDate = chgDate(0);
        }
      });
      searchRecord();
    };

    onMounted(() => {
      getTime();
    });
    const platformsList = ref([])
    const getPlatList = () => {
      getPlatformList().then((ret) => {
        platformsList.value = ret
      })

      const obj = {
        memberId: searchForm.gameBetRecord.memberId,
        platform: searchForm.gameBetRecord.platform,
        startDate: searchForm.gameBetRecord.startDate,
        endDate: searchForm.gameBetRecord.endDate,
      }
      gameBetRecordTotal(obj).then((ret) => {
        if (ret.code === 0) {
          totalBetRecord.totalBet = ret.data.totalBet
          totalBetRecord.totalPayout = ret.data.totalPayout
        }
      })

    };
    const selectedBetRecord = ref({})
    const betRecordDialog = ref(false)
    const betDetails = (record) => {
      dataState.betRecord = []
      selectedBetRecord.value = record
      const obj = {
        gameName: record.gameName,
        platform: record.platform,
        betTime: moment(record.betTime).format('YYYY-MM-DD'),
        memberId: searchForm.betRecord.memberId,
        current: searchForm.betRecord.current,
        size: searchForm.betRecord.size,
      }
      loadRecords("betRecord", obj).then((response) => {
        if (response.code === 0) {
          betPagination.total = response.data.total;
          betRecordDialog.value = true
          // dataState.betRecord = response.data.records
          dataState.betRecord.push(...response.data.records)
        }
      })
    }

    return {
      recordActive,
      searchForm,
      dataState,
      tableColumns,
      searchRecord,
      recordPage,
      loading,
      pagination,
      getTime,
      chgDate,
      humanDatetime(ts) {
        return moment(ts).format("DD-MM-YYYY HH:mm:ss");
      },
      getPlatList,
      platformsList,
      betDetails,
      betRecordDialog,
      recordBetPage,
      betPagination,
      totalBetRecord
    };
  }
});
</script>

<style scoped lang="scss">
.payout-total {
  display: flex;
  justify-content: right;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}
:deep(.ant-select:hover .ant-select-clear) {
  background: #2b2b4b;
}
.account-content.transit {
  min-height: 740px;
  margin: 0;
  padding: 0;
  .ant-tabs .ant-tabs-top-content > .ant-tabs-tabpane,
  .ant-tabs .ant-tabs-bottom-content > .ant-tabs-tabpane {
    padding: 20px;
  }
}
.account-container {
  .account-content-wrapper {
    .unbind-record-wrapper {
      margin-top: 20px;
    }
    .common-btn {
      cursor: pointer;

      &.search-btn {
        margin-top: 0;
        padding: 3px 5px;
        font-size: 14px;
      }
    }
    .transit .ant-form {
      display: flex;
      justify-content: space-between;
    }
    .ant-form-inline .ant-form-item {
      align-items: center;
    }
    .ant-form-inline .ant-form-item.search {
      margin-right: 0;
    }
    .left {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 20px;
    }
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
  .account-container {
    .account-content-wrapper {
      .left {
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 15px;
      }
      .account-btn {
        &.search-btn {
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
