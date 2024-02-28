<template>
  <q-page>
    <div class="account-content transit">
      <q-tabs v-model="recordActive" class="form-wrapped">
        <q-tab name="deposit" label="Deposit" />
        <q-tab name="turnover" label="Profit" />
        <q-tab name="withdraw" label="Withdraw" />
        <!-- <q-tab name="transfer" label="โอน" /> -->
        <q-tab name="rebates" label="Rebates" />
        <q-tab name="gameBetRecord" label="Game bet record" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="recordActive" animated>
        <q-tab-panel name="deposit">
          <div>
            <q-form layout="inline" :model="searchForm.deposit">
              <div class="left">
                <q-input filled v-model="searchForm.deposit.startDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.deposit.startDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="white" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input filled v-model="searchForm.deposit.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.deposit.endDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="white" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-btn class="q-mb-md" label="Search For" color="brand" @click="searchRecord" />
            </q-form>
          </div>
          <q-table
            :loading="loading"
            :columns="tableColumns.deposit"
            :rows="dataState.deposit"
            :no-data-label="noDataLabel"
            :rows-per-page-label="rowPerPageLabel"
            row-key="serialNumber"
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <div>
                  {{ getDepositStatus(props.value) }}
                </div>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
        <q-tab-panel name="turnover">
          <div>
            <q-form layout="inline" :model="searchForm.turnover">
              <div class="left">
                <q-input filled v-model="searchForm.turnover.startDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.turnover.startDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="white" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input filled v-model="searchForm.turnover.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.turnover.endDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="white" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-btn class="q-mb-md" label="Search For" color="brand" @click="searchRecord" />
            </q-form>
          </div>
          <q-table
            :loading="loading"
            :columns="tableColumns.turnover"
            :rows="dataState.turnover"
            :no-data-label="noDataLabel"
            :rows-per-page-label="rowPerPageLabel"
            row-key="serialNumber"
          >
            <template v-slot:body-cell-type="props">
              <q-td :props="props">
                <div>
                  {{ getTurnoverType(props.value) }}
                </div>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
        <q-tab-panel name="withdraw">
          <div>
            <q-form layout="inline" :model="searchForm.withdraw">
              <div class="left">
                <q-input filled v-model="searchForm.withdraw.startDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.withdraw.startDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="white" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input filled v-model="searchForm.withdraw.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.withdraw.endDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="white" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-btn class="q-mb-md" label="Search For" color="brand" @click="searchRecord" />
            </q-form>
          </div>
          <q-table
            :loading="loading"
            :columns="tableColumns.withdraw"
            :rows="dataState.withdraw"
            :no-data-label="noDataLabel"
            :rows-per-page-label="rowPerPageLabel"
            row-key="serialNumber"
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <div>
                  {{ getWithdrawStatus(props.value) }}
                </div>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
        <q-tab-panel name="transfer">
          <div>
            <q-form layout="inline" :model="searchForm.transfer">
              <div class="left">
                <q-input filled v-model="searchForm.transfer.startDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.transfer.startDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="white" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input filled v-model="searchForm.transfer.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.transfer.endDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="white" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-btn class="q-mb-md" label="Search For" color="brand" @click="searchRecord" />
            </q-form>
          </div>
          <q-table
            :loading="loading"
            :columns="tableColumns.transfer"
            :rows="dataState.transfer"
            :no-data-label="noDataLabel"
            :rows-per-page-label="rowPerPageLabel"
            row-key="serialNumber"
          >
            <template v-slot:body-cell-serialNumber="props">
              <q-td :props="props">
                <div>
                  <q-badge color="purple" :label="props.value" />
                </div>
                <div class="my-table-details">
                  {{ props.row.details }}
                </div>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
        <q-tab-panel name="rebates">
          <div>
            <q-form layout="inline" :model="searchForm.rebates">
              <div class="left">
                <q-input filled v-model="searchForm.rebates.startDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.rebates.startDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="white" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input filled v-model="searchForm.rebates.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.rebates.endDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="white" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-btn class="q-mb-md" label="Search For" color="brand" @click="searchRecord" />
            </q-form>
          </div>
          <q-table
            :loading="loading"
            :columns="tableColumns.rebates"
            :rows="dataState.rebates"
            :no-data-label="noDataLabel"
            :rows-per-page-label="rowPerPageLabel"
            row-key="serialNumber"
          />
        </q-tab-panel>
        <q-tab-panel name="gameBetRecord">
          <div class="payout-total">
            <div>Total bet: {{ totalBetRecord.totalBet }}</div>
            <div>Total Payout: {{ totalBetRecord.totalPayout }}</div>
          </div>
          <div>
            <q-form layout="inline" :model="searchForm.gameBetRecord">
              <div class="left">
                <q-input filled v-model="searchForm.gameBetRecord.startDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.gameBetRecord.startDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="white" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input filled v-model="searchForm.gameBetRecord.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchForm.gameBetRecord.endDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="white" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="left">
                <q-select
                  style="width: 100%"
                  v-model="searchForm.gameBetRecord.platform"
                  filled
                  clearable
                  :options="platformsList"
                  label="Platforms"
                  color="white"
                  label-color="grey"
                  option-label="name"
                  option-value="name"
                  emit-value
                  map-options
                />
                <!-- <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="searchForm.gameBetRecord.startDate"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="white"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input> -->
                <!-- <q-input filled v-model="searchForm.gameBetRecord.endDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="searchForm.gameBetRecord.endDate"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="white"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input> -->
              </div>
              <q-btn class="q-mb-md" label="Search For" color="brand" @click="searchRecord" />
            </q-form>
          </div>
          <q-table
            :loading="loading"
            :columns="tableColumns.gameBetRecord"
            :rows="dataState.gameBetRecord"
            :no-data-label="noDataLabel"
            :rows-per-page-label="rowPerPageLabel"
            row-key="serialNumber"
          >
            <!-- <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn color="deep-orange" @click="betDetails(props.row)" label="บันทึกการเดิมพัน"></q-btn>
              </q-td>
            </template> -->
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
      <q-dialog style="margin: 20px" v-model="betRecordDialog">
        <q-table
          :loading="loading"
          :columns="tableColumns.betRecord"
          :rows="dataState.betRecord"
          :no-data-label="noDataLabel"
          :rows-per-page-label="rowPerPageLabel"
          row-key="serialNumber"
        ></q-table>
      </q-dialog>
    </div>
  </q-page>
</template>

<script lang="js">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { api } from "boot/axios"
import { useQuasar } from "quasar"
import { userStore } from "stores/index"
import moment from "moment"
const store = userStore();
const recordActive = ref("deposit");
const totalBetRecord = reactive({
  totalBet: 0,
  totalPayout: 0
})
const searchForm = reactive({
  turnover: {
    startDate: "",
    endDate: ""
  },
  rebates: {
    startDate: "",
    endDate: ""
  },
  transfer: {
    startDate: "",
    endDate: ""
  },
  withdraw: {
    startDate: "",
    endDate: ""
  },
  deposit: {
    startDate: "",
    endDate: ""
  },
  gameBetRecord: {
    startDate: "",
    endDate: "",
    platform: "",
    memberId: store.id
  },
  betRecord: {
    platform: "",
    gameType: "",
    memberId: store.id
  },
});
const dataState = reactive({
  deposit: [],
  rebates: [],
  transfer: [],
  withdraw: [],
  turnover: [],
  betRecord: [],
  gameBetRecord: [],
});
const commonColumns = [
  {
    label: "Serial Number",
    field: "serialNumber"
  }
];
const tableColumns = {
  deposit: [
    ...commonColumns,
    {
      label: "Deposit amount",
      field: "depositAmount"
    },
    {
      label: "Status",
      field: "status",
      name: "status"
    },
    {
      label: "Deposit Date",
      field: "depositDate",
      // slots: { customRender: "depositDate" }
    }
  ],
  withdraw: [
    ...commonColumns,
    {
      label: "Withdraw Amount",
      field: "withdrawAmount"
    },
    {
      label: "Status",
      field: "status",
      name: "status"
    },
    {
      label: "Withdrawal Date",
      field: "withdrawDate",
      // slots: { customRender: "withdrawDate" }
    }
  ],
  transfer: [
    ...commonColumns,
    {
      label: "Type",
      field: "type",
      key: "type",
      // slots: { customRender: "type" }
    },
    {
      label: "Amount",
      field: "amount",
      key: "withdrawAmount"
    },
    {
      label: "Status",
      field: "status",
      key: "status",
      // slots: { customRender: "status" }
    },
    {
      label: "Transfer Date",
      field: "transferDate",
      key: "transferDate",
      // slots: { customRender: "transferDate" }
    }
  ],
  rebates: [
    ...commonColumns,
    {
      label: "Privilege Name",
      field: "privilegeName"
    },
    {
      label: "Amount",
      field: "amount"
    },
    {
      label: "Record Time",
      field: "recordTime",
      // slots: { customRender: "recordTime" }
    }
  ],
  turnover: [
    ...commonColumns,
    {
      label: "Type",
      field: "type",
      name: "type"
    },
    {
      label: "Amount",
      field: "amount"
    },
    {
      label: "Sub Type",
      field: "subType"
    },
    {
      label: "Record Time",
      field: "recordTime",
      // slots: { customRender: "recordTime" }
    }
  ],
  betRecord: [
    {
      label: "Bet ID",
      field: "betId"
    },
    {
      label: "Transaction ID",
      field: "transactionId"
    },
    {
      label: "Platform",
      field: "platform"
    },
    {
      label: "Bet",
      field: "bet"
    },
    {
      label: "Payout",
      field: "payout"
    },
    {
      label: "Before Balance",
      field: "beforeBalance"
    },
    {
      label: "After Balance",
      field: "afterBalance"
    },
    {
      label: "Bet Status",
      field: "betStatus"
    },
    {
      label: "Game Type",
      field: "gameType"
    },
    {
      label: "Bet Time",
      field: "betTime",
      // slots: { customRender: "betTime" }
    },
    {
      label: "Settle Time",
      field: "settleTime",
      // slots: { customRender: "settleTime" }
    },
    {
      label: "Result",
      field: "result"
    },
  ],
  gameBetRecord: [
    // {
    //   label: "รหัสเดิมพัน",
    //   field: "betId"
    // },
    // {
    //   label: "รหัสธุรกรรม",
    //   field: "transactionId"
    // },
    {
      label: "Game Name",
      field: "gameName"
    },
    {
      label: "Platform",
      field: "platform"
    },
    {
      label: "Bet",
      field: "bet"
    },
    {
      label: "Payout",
      field: "payout"
    },
    // {
    //   label: "วงเงินก่อนหน้า",
    //   field: "beforeBalance"
    // },
    // {
    //   label: "วงเงินหลังจาก",
    //   field: "afterBalance"
    // },
    // {
    //   label: "สถานะการเดิมพัน",
    //   field: "betStatus"
    // },
    {
      label: "Game Type",
      field: "gameType"
    },
    {
      name: 'actions',
      label: '',
      field: '',
    }
    // {
    //   label: "เวลาเดิมพัน",
    //   field: "betTime",
    //   // slots: { customRender: "betTime" }
    // },
    // {
    //   label: "เวลาชำระเงิน",
    //   field: "settleTime",
    //   // slots: { customRender: "settleTime" }
    // },
    // {
    //   label: "ผลลัพท์",
    //   field: "result"
    // },
  ]
}
const loading = ref(false);
const pagination = reactive({
  pageSize: 10,
  total: 0
});

export default defineComponent({
  name: "TransitRecordView",
  setup() {
    watch(recordActive, (currentValue, oldValue) => {
      searchRecord()
    });
    const $q = useQuasar()

    const recordUrl = {
      deposit: "/session/member/deposit",
      turnover: "/session/member/moneyChange",
      withdraw: "/session/member/withdraw",
      rebates: "/session/member/privilege",
      gameBetRecord: "/session/member/gameBetRecord",
    };

    const searchRecord = () => {
      loading.value = true;
      if (recordActive.value === 'gameBetRecord') {
        getPlatList()
      }
      api.get(recordUrl[recordActive.value], {
        params: searchForm[recordActive.value]
      }).then((response) => {
          const dataSource = dataState[recordActive.value];
          dataSource.value = [];
        if (response.code === 0) {
          pagination.total = response.data.length;
          totalBetRecord.totalBet = response.data.sums.totalBet
          totalBetRecord.totalPayout = response.data.sums.totalPayout
          //clear array and then push new record
          dataSource.splice(0);
          dataSource.push(...response.data.records);
        } else {
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: response.message,
          //   icon: "report_problem"
          // });
        }
      }).catch((error) => {
        // $q.notify({
        //   color: "negative",
        //   position: "top",
        //   message: error.message,
        //   icon: "report_problem"
        // });
        // console.log("error", error);
      }).then(() => {
        loading.value = false;
      });
    };

    const recordPage = (pagination) => {
      searchForm[recordActive.value].current = pagination.current;
      searchRecord();
    };

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
      api.get("/platform").then((ret) => {
        if (ret.code === 0) {
          platformsList.value = ret.data
        }
      })
      const obj = {
        memberId: searchForm.gameBetRecord.memberId,
        platform: searchForm.gameBetRecord.platform,
        startDate: searchForm.gameBetRecord.startDate,
        endDate: searchForm.gameBetRecord.endDate,
      }
      // api.get("/session/member/gameBetRecordTotal", {params: obj}).then((ret) => {
      //   if (ret.code === 0) {
      //     totalBetRecord.totalBet = ret.data.totalBet
      //     totalBetRecord.totalPayout = ret.data.totalPayout
      //   }
      // })

    };
    const betRecordDialog = ref(false)
    const getTurnoverType = (turnoverType) => {
      if (turnoverType === 'WITHDRAW_FAIL') {
        return 'Fail Withdrawal' // Fail Withdrawal
      } else if (turnoverType === 'WITHDRAW') {
        return 'Withdraw' // Withdraw
      } else {
        return turnoverType
      }
    }
    const getWithdrawStatus = (withdrawStatus) => {
      if (withdrawStatus === 'APPLY') {
        return 'Applying' //Applying
      } else if (withdrawStatus === 'FAIL') {
        return 'Failed' // Failed
      } else if (withdrawStatus === 'SUCCESS') {
        return 'Success' // Success
      } else if (withdrawStatus === 'STEP_1') {
        return 'Under review' //Under review
      } else if (withdrawStatus === 'STEP_2') {
        return 'To be paid' // To be paid
      }  else if (withdrawStatus === 'STEP_3') {
        return 'Payment on going' // Payment on going
      }  else if (withdrawStatus === 'STEP_4') {
        return 'Automatic Payment' // Automatic Payment
      }  else if (withdrawStatus === 'STEP_5') {
        return 'Suspend' //Suspend
      } else {
        return withdrawStatus
      }
    }
    const getDepositStatus = (depositStatus) => {
      if (depositStatus === 'PENDING') {
        return 'Pending' // Pending
      } else if (depositStatus === 'SUCCESS') {
        return 'Success' // Success
      } else if (depositStatus === 'SUPPLEMENT_SUCCESS') {
        return 'Supplement Success' // Supplement Success
      } else if (depositStatus === 'CLOSED') {
        return 'Closed' // Closed
      } else {
        return depositStatus
      }
    }
    const betDetails = (row) => {
      const obj = {
        gameName: row.gameName,
        platform: row.platform,
        betTime: moment(row.betTime).format('yyyy-MM-DD'),
        memberId: searchForm.betRecord.memberId,
        current: searchForm.betRecord.current,
      }
      api.get("/session/member/betRecord", {params: obj}).then((ret) => {
        if (ret.code === 0) {
          betRecordDialog.value = true
          dataState.betRecord = ret.data.records
        }
      })
    }

    return {
      recordActive,
      searchForm,
      dataState,
      tableColumns,
      commonColumns,
      searchRecord,
      recordPage,
      loading,
      pagination,
      getTime,
      chgDate,
      noDataLabel: "No information",
      rowPerPageLabel: "Record per page",
      humanDatetime(ts) {
        return moment(ts).format("DD-MM-YYYY HH:mm:ss");
      },
      getPlatList,
      platformsList,
      betDetails,
      betRecordDialog,
      totalBetRecord,
      getTurnoverType,
      getWithdrawStatus,
      getDepositStatus,
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
.account-content.transit {
  min-height: 740px;
  margin: 10px;
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
  }
}
.left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  margin-top: 25px;
}
.block {
  color: #fff !important;
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
