<template>
  <div>
    <div className="menu-title-container">
      <span className="menu-title">Transit Record</span>
    </div>
    <div class="account-content transit">
      <a-tabs
        v-model:activeKey="recordActive"
        class="form-wrapped"
        @change="searchRecord"
      >
        <a-tab-pane key="deposit" tab="Deposit">
          <div>
            <a-form layout="inline" :model="searchForm.deposit">
              <div class="left">
                <a-form-item label="Start">
                  <a-date-picker
                    v-model:value="searchForm.deposit.startDate"
                    valueFormat="yyyy-MM-DD"
                    placeholder=""
                  />
                </a-form-item>
                <a-form-item label="End">
                  <a-date-picker
                    v-model:value="searchForm.deposit.endDate"
                    valueFormat="yyyy-MM-DD"
                    placeholder=""
                  />
                </a-form-item>
              </div>
              <a-form-item class="search">
                <button
                  class="common-btn outline search-btn"
                  type="submit"
                  @click="searchRecord"
                >
                  Search For
                </button>
              </a-form-item>
            </a-form>
          </div>
          <div class="unbind-record-wrapper">
            <a-table
              :columns="tableColumns.deposit"
              :data-source="dataState.deposit"
              :row-key="(record) => record.serialNumber"
              :loading="loading"
              :pagination="pagination"
              @change="recordPage"
            >
              <template #depositDate="{ text }">
                <span>{{ humanDatetime(text) }}</span>
              </template>
              <template #operation="{ record }">
                <template v-if="record.status === 'PENDING'">
                  <a-button
                    class="common-btn"
                    style="margin: auto"
                    @click="openReminder(record)"
                    >Reminder</a-button
                  >
                </template>
                <!-- <template #operation="{ text }">
                  <span>{{ (text) }}</span>
                </template> -->
              </template>
              <!-- <template #status="{ text }">
                <span>{{ getDepositStatus(text) }}</span>
              </template> -->
            </a-table>
          </div>
        </a-tab-pane>
        <a-tab-pane key="turnover" tab="Turnover">
          <div>
            <a-form layout="inline" :model="searchForm.turnover">
              <div class="left">
                <a-form-item label="Start">
                  <a-date-picker
                    v-model:value="searchForm.turnover.startDate"
                    valueFormat="yyyy-MM-DD"
                    placeholder=""
                  />
                </a-form-item>
                <a-form-item label="End">
                  <a-date-picker
                    v-model:value="searchForm.turnover.endDate"
                    valueFormat="yyyy-MM-DD"
                    placeholder=""
                  />
                </a-form-item>
              </div>
              <a-form-item>
                <button
                  class="common-btn outline search-btn"
                  type="submit"
                  @click="searchRecord"
                >
                  Search For
                </button>
              </a-form-item>
            </a-form>
          </div>
          <div class="unbind-record-wrapper">
            <a-table
              :columns="tableColumns.turnover"
              :data-source="dataState.turnover"
              :row-key="(record) => record.serialNumber"
              :loading="loading"
              :pagination="pagination"
              @change="recordPage"
            >
              <template #recordTime="{ text }">
                <span>{{ humanDatetime(text) }}</span>
              </template>
              <!-- <template #type="{ text }">
                <span>{{ getTurnoverType(text) }}</span>
              </template> -->
            </a-table>
          </div>
        </a-tab-pane>
        <a-tab-pane key="withdraw" tab="Withdraw">
          <div>
            <a-form layout="inline" :model="searchForm.withdraw">
              <div class="left">
                <a-form-item label="Start">
                  <a-date-picker
                    v-model:value="searchForm.withdraw.startDate"
                    valueFormat="yyyy-MM-DD"
                    placeholder=""
                  />
                </a-form-item>
                <a-form-item label="End">
                  <a-date-picker
                    v-model:value="searchForm.withdraw.endDate"
                    valueFormat="yyyy-MM-DD"
                    placeholder=""
                  />
                </a-form-item>
              </div>
              <a-form-item>
                <button
                  class="common-btn outline search-btn"
                  type="submit"
                  @click="searchRecord"
                >
                  Search For
                </button>
              </a-form-item>
            </a-form>
          </div>
          <div class="unbind-record-wrapper">
            <a-table
              :columns="tableColumns.withdraw"
              :data-source="dataState.withdraw"
              :row-key="(record) => record.serialNumber"
              :loading="loading"
              :pagination="pagination"
              @change="recordPage"
            >
              <template #withdrawDate="{ text }">
                <span>{{ humanDatetime(text) }}</span>
              </template>
              <!-- 
              <template #status="{ text }">
                <span>{{ getWithdrawStatus(text) }}</span>
              </template> -->
            </a-table>
          </div>
        </a-tab-pane>
        <!-- <a-tab-pane key="transfer" tab="โอน">
          <div>
            <a-form layout="inline" :model="searchForm.transfer">
              <div class="left">
                <a-form-item label="Start">
                  <a-date-picker
                    v-model:value="searchForm.transfer.startDate"
                    valueFormat="yyyy-MM-DD"
                    placeholder=""
                  />
                </a-form-item>
                <a-form-item label="End">
                  <a-date-picker
                    v-model:value="searchForm.transfer.endDate"
                    valueFormat="yyyy-MM-DD"
                    placeholder=""
                  />
                </a-form-item>
              </div>
              <a-form-item>
                <button
                  class="common-btn outline search-btn"
                  type="submit"
                  @click="searchRecord"
                >
                  Search For
                </button>
              </a-form-item>
            </a-form>
          </div>
          <div class="unbind-record-wrapper">
            <a-table
              :columns="tableColumns.transfer"
              :data-source="dataState.transfer"
              :row-key="(record) => record.serialNumber"
              :loading="loading"
              :pagination="pagination"
              @change="recordPage"
            >
              <template #type="{ record }">
                <span> {{ record.type }} - {{ record.platform }} </span>
              </template>
              <template #status="{ text, record }">
                <span>
                  <a-tag
                    :color="
                      record.status === 'SUCCESS'
                        ? '#87d068'
                        : record.status === 'SENDING'
                        ? '#55acee'
                        : '#cd201f'
                    "
                  >
                    {{ text }}
                  </a-tag>
                </span>
              </template>
              <template #transferDate="{ text }">
                <span>{{ humanDatetime(text) }}</span>
              </template>
            </a-table>
          </div>
        </a-tab-pane> -->
        <a-tab-pane key="rebates" tab="Rebates">
          <div>
            <a-form layout="inline" :model="searchForm.rebates">
              <div class="left">
                <a-form-item label="Start">
                  <a-date-picker
                    v-model:value="searchForm.rebates.startDate"
                    valueFormat="yyyy-MM-DD"
                    placeholder=""
                  />
                </a-form-item>
                <a-form-item label="End">
                  <a-date-picker
                    v-model:value="searchForm.rebates.endDate"
                    valueFormat="yyyy-MM-DD"
                    placeholder=""
                  />
                </a-form-item>
              </div>
              <a-form-item>
                <button
                  class="common-btn outline search-btn"
                  type="submit"
                  @click="searchRecord"
                >
                  Search For
                </button>
              </a-form-item>
            </a-form>
          </div>
          <div class="unbind-record-wrapper">
            <a-table
              :columns="tableColumns.rebates"
              :data-source="dataState.rebates"
              :row-key="(record) => record.serialNumber"
              :loading="loading"
              :pagination="pagination"
              @change="recordPage"
            >
              <template #recordTime="{ text }">
                <span>{{ humanDatetime(text) }}</span>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
        <a-tab-pane key="gameBetRecord" tab="Bet record">
          <div class="payout-total">
            <div>Bet amount: {{ totalBetRecord.totalBet }}</div>
            <div>Total payout: {{ totalBetRecord.totalPayout }}</div>
          </div>
          <div>
            <a-form layout="inline" :model="searchForm.gameBetRecord">
              <div class="left">
                <a-form-item label="Platform">
                  <a-select
                    allowClear
                    style="width: 300px"
                    v-model:value="searchForm.gameBetRecord.platform"
                    placeholder="Platform"
                    @change="searchRecord"
                  >
                    <a-select-option
                      v-for="p in platformsList"
                      :key="p.name"
                      :value="p.name"
                    >
                      {{ p.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="Start">
                  <a-date-picker
                    v-model:value="searchForm.gameBetRecord.startDate"
                    valueFormat="yyyy-MM-DD"
                    placeholder=""
                  />
                </a-form-item>
                <a-form-item label="End">
                  <a-date-picker
                    v-model:value="searchForm.gameBetRecord.endDate"
                    valueFormat="yyyy-MM-DD"
                    placeholder=""
                  />
                </a-form-item>
              </div>
              <a-form-item>
                <button
                  class="common-btn outline search-btn"
                  type="submit"
                  @click="searchRecord"
                >
                  Search For
                </button>
              </a-form-item>
            </a-form>
          </div>
          <div class="unbind-record-wrapper">
            <a-table
              :columns="tableColumns.gameBetRecord"
              :data-source="dataState.gameBetRecord"
              :row-key="(record) => record.gameType"
              :loading="loading"
              :pagination="pagination"
              @change="recordPage"
            >
              <template #actions="{ record }">
                <a-button class="common-btn" @click="betDetails(record)"
                  >Bet record</a-button
                >
              </template>
            </a-table>
          </div>
        </a-tab-pane>
      </a-tabs>

      <a-modal
        width="90%"
        v-model:visible="betRecordDialog"
        :maskClosable="false"
        :closable="true"
        :footer="null"
      >
        <div class="modal-head-title">Bet Record</div>
        <a-table
          :columns="tableColumns.betRecord"
          :data-source="dataState.betRecord"
          :row-key="(record) => record.betId"
          :loading="loading"
          :pagination="betPagination"
          @change="recordBetPage"
        >
        </a-table>
      </a-modal>

      <a-modal
        width="90%"
        v-model:visible="reminderDialog"
        :maskClosable="false"
        :closable="true"
        :footer="null"
      >
        <div class="modal-head-title">Reminder Dialog</div>
        <a-form
          ref="formRef"
          :model="reminderForm"
          :hideRequiredMark="true"
          name="basic"
          :colon="false"
          autocomplete="off"
          labelAlign="left"
          :label-col="{ span: 5 }"
        >
          <a-form-item label="Serial number" name="serialNumber">
            <a-input
              v-model:value="reminderForm.orderNo"
              placeholder="Serial number"
              disabled
            />
          </a-form-item>
          <a-form-item label="Image Upload" name="photos">
            <FileUpload @photo-response="getImageLink" />
          </a-form-item>
          <a-form-item label="Remarks" name="remarks">
            <a-textarea
              v-model:value="reminderForm.memberRemark"
              placeholder="Remarks"
              :auto-size="{ minRows: 2, maxRows: 5 }"
            />
          </a-form-item>
          <a-button class="common-btn" @click="submitReminder"> Submit </a-button>
        </a-form>
      </a-modal>
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
import FileUpload from "@/components/FileUpload.vue"

const store = userStore()
const recordActive = ref("deposit");
const reminderForm = reactive({});
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
      dataIndex: "status",
      slots: { customRender: "status" }
    },
    {
      title: "Deposit Date",
      dataIndex: "depositDate",
      slots: { customRender: "depositDate" }
    },
    {
      title: "Operation ",
      dataIndex: "operation",
      slots: { customRender: "operation" }
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
      dataIndex: "status",
      slots: { customRender: "status" }
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
      dataIndex: "type",
      slots: { customRender: "type" }
    },
    {
      title: "Amount",
      dataIndex: "amount"
    },
    {
      title: "Sub Type",
      dataIndex: "subType"
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
      title: "Game type",
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
      title: "Bet ID",
      dataIndex: "betId"
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId"
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
    {
      title: "Before balance",
      dataIndex: "beforeBalance"
    },
    {
      title: "After balance",
      dataIndex: "afterBalance"
    },
    {
      title: "Bet Status",
      dataIndex: "betStatus"
    },
    {
      title: "Game type",
      dataIndex: "gameType"
    },
    {
      title: "Bet time",
      dataIndex: "betTime",
      slots: { customRender: "betTime" }
    },
    {
      title: "Settle time",
      dataIndex: "settleTime",
      slots: { customRender: "settleTime" }
    },
    {
      title: "Result",
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
  pageSize: 10,
  total: 0
});
const betPagination = reactive({
  pageSize: 10,
  total: 0
});

export default defineComponent({
  name: "TransitRecordView",
  components: {
    FileUpload,
  },
  setup() {
    const reminderDialog = ref(false);
    const openReminder = (record) => {
      reminderDialog.value = true
      reminderForm.orderNo = record.serialNumber
      if (recordActive.value === 'deposit') {
        reminderForm.type = 1
      } else if (recordActive.value === 'withdraw') {
        reminderForm.type = 2
      }
    }
    const submitReminder = () => {
      console.log(reminderForm);
    }
    const searchRecord = () => {
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
      }).then(() => {
        loading.value = false;
      });
    };
    const recordPage = (pagination) => {
      searchForm[recordActive.value].current = pagination.current;
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
    // const getTurnoverType = (turnoverType) => {
    //   if (!turnoverType) {
    //     return ''
    //   }
    //   if (turnoverType === 'WITHDRAW_FAIL') {
    //     return 'การถอนเงินล้มเหลว' // Fail Withdrawal
    //   } else if (turnoverType === 'WITHDRAW') {
    //     return 'ถอนเงิน' // Withdraw
    //   } else {
    //     return turnoverType
    //   }
    // }
    // const getWithdrawStatus = (withdrawStatus) => {
    //   if (withdrawStatus === 'APPLY') {
    //     return 'ส่งดำเนินการ' //Applying
    //   } else if (withdrawStatus === 'FAIL') {
    //     return 'ล้มเหลว' // Failed
    //   } else if (withdrawStatus === 'SUCCESS') {
    //     return 'สำเร็จ' // Success
    //   } else if (withdrawStatus === 'STEP_1') {
    //     return 'กำลังตรวจสอบ' //Under review
    //   } else if (withdrawStatus === 'STEP_2') {
    //     return 'กำลังดำเนินการจ่าย' // To be paid
    //   }  else if (withdrawStatus === 'STEP_3') {
    //     return 'กำลังดำเนินการโอน' // Payment on going
    //   }  else if (withdrawStatus === 'STEP_4') {
    //     return 'ชำระอัตโนมัติ' // Automatic Payment
    //   }  else if (withdrawStatus === 'STEP_5') {
    //     return 'ระงับ' //Suspend
    //   } else {
    //     return withdrawStatus
    //   }
    // };
    // const getDepositStatus = (depositStatus) => {
    //   if (!depositStatus) {
    //     return ''
    //   }
    //   if (depositStatus === 'PENDING') {
    //     return 'รอดำเนินการ' // Pending
    //   } else if (depositStatus === 'SUCCESS') {
    //     return 'สำเร็จ' // Success
    //   } else if (depositStatus === 'SUPPLEMENT_SUCCESS') {
    //     return 'เสริมความสำเร็จ' // Supplement Success
    //   } else if (depositStatus === 'CLOSED') {
    //     return 'ปิด' // Closed
    //   } else {
    //     return depositStatus
    //   }
    // }

    const betRecordDialog = ref(false)
    const betDetails = (record) => {
      dataState.betRecord = []
      selectedBetRecord.value = record
      const obj = {
        gameName: record.gameName,
        platform: record.platform,
        betTime: moment(record.betTime).format('yyyy-MM-DD'),
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
    const getImageLink = (linkId) => {
      reminderForm.photos = `https://fxlmnp.wallykrooger.com/photo/${linkId}`
      alert(linkId)
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
      totalBetRecord,
      openReminder,
      reminderDialog,
      reminderForm,
      submitReminder,
      getImageLink
      // getTurnoverType,
      // getWithdrawStatus,
      // getDepositStatus
    };
  }
});
</script>

<style scoped lang="scss">
:deep(.ant-upload-list) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.ant-form-item-control-input-content span {
  display: flex;
  width: 100%;
}
:deep(.ant-upload-list-item) {
  color: #ffffff;
  margin-top: 0;
}
:deep(.ant-upload-list.ant-upload-list-text > div) {
  width: 100%;
}
:deep(.ant-upload-list-item-card-actions .anticon) {
  color: #ffffff;
}
:deep(.ant-upload-list-item:hover .ant-upload-list-item-info) {
  background: #23263c;
  color: #ffffff;
}
:deep(.ant-form-item-label > label) {
  color: #ffffff;
}
.ant-input[disabled] {
  color: #aaaaaa;
  background-color: #181829;
}
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
  .form-wrapped {
    :deep(.ant-tabs-top-bar) {
      margin-bottom: 50px;
    }
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
        font-size: 14px;
      }
    }
    .transit .ant-form {
      display: flex;
      justify-content: space-between;
    }
    .ant-form-inline .ant-form-item.search {
      margin-right: 0;
    }
    .left {
      display: flex;
      justify-content: center;
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
      .transit .ant-form {
        justify-content: stretch;
        align-items: stretch;
        gap: 30px;
        width: 100%;
      }
      .left {
        flex-direction: column;
        margin-top: 25px;
        text-align: center;
        width: 100%;
        .ant-form-inline .ant-form-item {
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          width: 100%;
        }
        .ant-calendar-picker {
          width: 100%;
        }
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
