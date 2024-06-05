<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">Transaction Record</span>
    </div>
    <div class="account-content transit">
      <a-tabs v-model:activeKey="recordActive" class="form-wrapped" @change="searchRecord">
        <a-tab-pane key="deposit" tab="Deposit">
          <a-select v-model:value="selectedDateRange" style="width: 124px" :options="dateRangeOptions" />
          <div class="finance-record-wrapper deposit">
            <div v-for="(record, index) in dataState.deposit" :key="index" class="finance-record-item">
              <span class="finance-record-item__title">{{ record.serialNumber }}</span>
              <span class="finance-record-item__status" :class="record.status">
                <!-- TODO: check status code -->
                <template v-if="record.status === 'PENDING'">Pending</template>
                <template v-else-if="record.status === 'SUPPLEMENT_SUCCESS'">Supplement Success</template>
                <template v-else-if="record.status === 'REJECTED'">Rejected</template>
                <template v-else-if="record.status === 'CLOSED'">Closed</template>
                <template v-else-if="record.status === 'LOSS'">Loss</template>
                <template v-else>{{ record.status }}</template>
              </span>
              <span class="finance-record-item__date">{{ moment(record.depositDate).format("MM/DD/YYYY") }}</span>
              <span class="finance-record-item__amount">+{{ record.depositAmount.toFixed(2) }}</span>
            </div>
          </div>
          <!-- <div>
            <a-form layout="inline" :model="searchForm.deposit">
              <div class="left">
                <a-form-item label="Start">
                  <a-date-picker
                    v-model:value="searchForm.deposit.startDate"
                    value-format="yyyy-MM-DD"
                    format="MM/DD/yyyy"
                    placeholder=""
                  />
                </a-form-item>
                <a-form-item label="End">
                  <a-date-picker
                    v-model:value="searchForm.deposit.endDate"
                    value-format="yyyy-MM-DD"
                    format="MM/DD/yyyy"
                    placeholder=""
                  />
                </a-form-item>
              </div>
              <a-form-item class="search">
                <button class="common-btn search-btn" type="submit" @click="searchRecord">Search</button>
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
                  <a-button class="common-btn" style="margin: auto" @click="openReminder(record)">Reminder</a-button>
                </template>
              </template>
              <template #status="{ text }">
                <span>{{ getDepositStatus(text) }}</span>
              </template>
            </a-table>
          </div> -->
        </a-tab-pane>
        <!-- <a-tab-pane key="turnover" tab="Turnover">
          <div>
            <a-form layout="inline" :model="searchForm.turnover">
              <div class="left">
                <a-form-item label="Start">
                  <a-date-picker
                    v-model:value="searchForm.turnover.startDate"
                    value-format="yyyy-MM-DD"
                    format="MM/DD/yyyy"
                    placeholder=""
                  />
                </a-form-item>
                <a-form-item label="End">
                  <a-date-picker
                    v-model:value="searchForm.turnover.endDate"
                    value-format="yyyy-MM-DD"
                    format="MM/DD/yyyy"
                    placeholder=""
                  />
                </a-form-item>
              </div>
              <a-form-item>
                <button class="common-btn search-btn" type="submit" @click="searchRecord">Search</button>
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
              <template #type="{ text }">
                <span>{{ getTurnoverType(text) }}</span>
              </template>
            </a-table>
          </div>
        </a-tab-pane> -->
        <a-tab-pane key="withdraw" tab="Withdraw">
          <a-select v-model:value="selectedDateRange" style="width: 124px" :options="dateRangeOptions" />
          <div class="finance-record-wrapper withdraw">
            <div v-for="(record, index) in dataState.withdraw" :key="index" class="finance-record-item">
              <span class="finance-record-item__title">{{ record.serialNumber }}</span>
              <span class="finance-record-item__status" :class="record.status">
                <!-- TODO: check status code -->
                <template v-if="record.status === 'PENDING'">Pending</template>
                <template v-else-if="record.status === 'SUPPLEMENT_SUCCESS'">Supplement Success</template>
                <template v-else-if="record.status === 'REJECTED'">Rejected</template>
                <template v-else-if="record.status === 'CLOSED'">Closed</template>
                <template v-else-if="record.status === 'LOSS'">Loss</template>
                <template v-else>{{ record.status }}</template>
              </span>
              <span class="finance-record-item__date">{{ moment(record.withdrawDate).format("MM/DD/YYYY") }}</span>
              <span class="finance-record-item__amount">-{{ record.withdrawAmount.toFixed(2) }}</span>
            </div>
          </div>
          <!-- <div>
            <a-form layout="inline" :model="searchForm.withdraw">
              <div class="left">
                <a-form-item label="Start">
                  <a-date-picker
                    v-model:value="searchForm.withdraw.startDate"
                    value-format="yyyy-MM-DD"
                    format="MM/DD/yyyy"
                    placeholder=""
                  />
                </a-form-item>
                <a-form-item label="End">
                  <a-date-picker
                    v-model:value="searchForm.withdraw.endDate"
                    value-format="yyyy-MM-DD"
                    format="MM/DD/yyyy"
                    placeholder=""
                  />
                </a-form-item>
              </div>
              <a-form-item>
                <button class="common-btn search-btn" type="submit" @click="searchRecord">Search</button>
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
              <template #operation="{ record }">
                <template v-if="record.status === 'STEP_1'">
                  <a-button class="common-btn" style="margin: auto" @click="openReminder(record)">Reminder</a-button>
                </template>
              </template>

              <template #status="{ text }">
                <span>{{ getWithdrawStatus(text) }}</span>
              </template>
            </a-table>
          </div> -->
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
                  class="common-btn search-btn"
                  type="submit"
                  @click="searchRecord"
                >
                  Search
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
        <!-- <a-tab-pane key="rebates" tab="Rebates">
          <div>
            <a-form layout="inline" :model="searchForm.rebates">
              <div class="left">
                <a-form-item label="Start">
                  <a-date-picker
                    v-model:value="searchForm.rebates.startDate"
                    value-format="yyyy-MM-DD"
                    format="MM/DD/yyyy"
                    placeholder=""
                  />
                </a-form-item>
                <a-form-item label="End">
                  <a-date-picker
                    v-model:value="searchForm.rebates.endDate"
                    value-format="yyyy-MM-DD"
                    format="MM/DD/yyyy"
                    placeholder=""
                  />
                </a-form-item>
              </div>
              <a-form-item>
                <button class="common-btn search-btn" type="submit" @click="searchRecord">Search</button>
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
                    v-model:value="searchForm.gameBetRecord.platform"
                    allow-clear
                    style="width: 300px"
                    placeholder="Platform"
                    @change="searchRecord"
                  >
                    <a-select-option v-for="p in platformsList" :key="p.name" :value="p.name">
                      {{ p.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="Start">
                  <a-date-picker
                    v-model:value="searchForm.gameBetRecord.startDate"
                    value-format="yyyy-MM-DD"
                    format="MM/DD/yyyy"
                    placeholder=""
                  />
                </a-form-item>
                <a-form-item label="End">
                  <a-date-picker
                    v-model:value="searchForm.gameBetRecord.endDate"
                    value-format="yyyy-MM-DD"
                    format="MM/DD/yyyy"
                    placeholder=""
                  />
                </a-form-item>
              </div>
              <a-form-item>
                <button class="common-btn search-btn" type="submit" @click="searchRecord">Search</button>
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
                <a-button class="common-btn" @click="betDetails(record)">Bet record</a-button>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
        <a-tab-pane key="reminderRecord" tab="Reminder record">
          <div>
            <a-form layout="inline" :model="searchForm.reminderRecord">
              <div class="left">
                <a-form-item label="Start">
                  <a-date-picker
                    v-model:value="searchForm.reminderRecord.startDate"
                    valueFormat="yyyy-MM-DD"
                    format="MM/DD/yyyy"
                    placeholder=""
                  />
                </a-form-item>
                <a-form-item label="End">
                  <a-date-picker
                    v-model:value="searchForm.reminderRecord.endDate"
                    valueFormat="yyyy-MM-DD"
                    format="MM/DD/yyyy"
                    placeholder=""
                  />
                </a-form-item>
              </div>
              <a-form-item>
                <button class="common-btn search-btn" type="submit" @click="searchRecord">Search</button>
              </a-form-item>
            </a-form>
          </div>
          <div class="unbind-record-wrapper">
            <a-table
              :columns="tableColumns.reminderRecord"
              :data-source="dataState.reminderRecord"
              :row-key="(record) => record.orderNo"
              :loading="loading"
              :pagination="pagination"
              @change="recordPage"
            >
              <template #feedbackTime="{ text }">
                <span>{{ humanDatetime(text) }}</span>
              </template>
              <template #type="{ text }">
                <span>{{ checkType(text) }}</span>
              </template>
              <template #actions="{ record }">
                <a-button class="common-btn" @click="betDetails(record)">Bet record</a-button>
              </template>
            </a-table>
          </div>
        </a-tab-pane> -->
      </a-tabs>

      <a-modal v-model:visible="betRecordDialog" width="90%" :mask-closable="false" :closable="true" :footer="null">
        <div class="modal-head-title">Bet Record</div>
        <a-table
          :columns="tableColumns.betRecord"
          :data-source="dataState.betRecord"
          :row-key="(record) => record.betId"
          :loading="loading"
          :pagination="betPagination"
          @change="recordBetPage"
        />
      </a-modal>

      <el-dialog
        v-model="reminderDialog"
        title="Submit Reminder"
        width="50%"
        align-center
        style="max-width: 800px"
        :before-close="clearItems"
      >
        <span>
          <el-form
            ref="formRef"
            :model="reminderForm"
            :hide-required-mark="true"
            name="basic"
            autocomplete="off"
            label-width="120"
            label-suffix=":"
            style="width: 100%; max-width: 600px; margin: 0px auto 0px; padding-top: 50px; padding-bottom: 50px"
          >
            <el-form-item tabindex="1" label="Serial No." prop="serialNumber">
              <el-input v-model="reminderForm.orderNo" placeholder="Serial No." disabled />
            </el-form-item>

            <el-form-item label="Choose Image" prop="photos">
              <FileUpload @photo-response="getImageLink" ref="uploadFileRef" />
            </el-form-item>

            <el-form-item label="Remark" prop="remarks">
              <el-input
                type="textarea"
                v-model="reminderForm.memberRemark"
                placeholder="Remark"
                :rows="2"
                :autosize="{ minRows: 2, maxRows: 5 }"
              />
            </el-form-item>

            <a-button
              color="#3bafda"
              class="common-btn"
              style="margin-left: 120px; width: unset"
              :loading="loadingBtn"
              @click="submitReminder()"
            >
              Submit
            </a-button>
          </el-form>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import {
  loadRecords,
  gameBetRecordTotal,
  saveFinanceFeedback,
  financeFeedbackList,
  getVerifyingFeedbackCount
} from "@/api/personal/personal";
import moment from "moment";
import { getPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";
import FileUpload from "@/components/FileUpload.vue";
import { message } from "ant-design-vue";

const dateRangeOptions = ref([
  { value: "1d", label: "1 Days" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" }
]);
const selectedDateRange = ref("1d");
const loadingBtn = ref(false);
const store = userStore();
const uploadFileRef = ref();
const recordActive = ref("deposit");
const reminderForm = reactive({});
const totalBetRecord = reactive({
  totalBet: 0,
  totalPayout: 0
});
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
  },
  reminderRecord: {
    startDate: "",
    endDate: "",
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
  gameBetRecord: [],
  reminderRecord: []
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
      title: "Payment Type",
      dataIndex: "paymentType"
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
    },
    {
      title: "Operation ",
      dataIndex: "operation",
      slots: { customRender: "operation" }
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
    }
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
    }
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
  ],
  reminderRecord: [
    {
      title: "Order No.",
      dataIndex: "orderNo"
    },
    {
      title: "Finance Remark",
      dataIndex: "financeRemark"
    },
    {
      title: "Feedback Time",
      dataIndex: "feedbackTime",
      slots: { customRender: "feedbackTime" }
    },
    {
      title: "Type",
      dataIndex: "type",
      slots: { customRender: "type" }
    }
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

const reminderDialog = ref(false);
const openReminder = (record) => {
  getVerifyingFeedbackCount().then((res) => {
    if (res.code === 0) {
      if (res.data < 3) {
        reminderDialog.value = true;
        reminderForm.orderNo = record.serialNumber;
        reminderForm.photos = null;
        reminderForm.memberRemark = null;
        if (recordActive.value === "deposit") {
          reminderForm.type = 1;
          reminderForm.recordTime = moment(record.depositDate).format("YYYY-MM-DD HH:mm:ss");
        } else if (recordActive.value === "withdraw") {
          reminderForm.type = 2;
          reminderForm.recordTime = moment(record.withdrawDate).format("YYYY-MM-DD HH:mm:ss");
        }
      } else {
        message.error("There is an existing reminder");
      }
    }
  });
};
const submitReminder = () => {
  loadingBtn.value = true;
  if (!reminderForm.photos) {
    loadingBtn.value = false;
    message.error(`Please select Image`);
  } else {
    saveFinanceFeedback(reminderForm).then((res) => {
      loadingBtn.value = false;
      if (res.code === 0) {
        reminderDialog.value = false;
        reminderForm.value = {};
        uploadFileRef.value.clear();
        message.success("Success", 4);
      }
    });
  }
};
const searchRecord = () => {
  if (
    searchForm[recordActive.value].startDate === "" ||
    searchForm[recordActive.value].startDate === null ||
    searchForm[recordActive.value].endDate === "" ||
    searchForm[recordActive.value].endDate === null
  ) {
    message.error("Please fill in the date.");
    return;
  }
  loading.value = true;
  if (recordActive.value === "gameBetRecord") {
    getPlatList();
  }
  if (recordActive.value === "reminderRecord") {
    financeFeedbackList(searchForm[recordActive.value]).then((response) => {
      if (response.code === 0) {
        pagination.total = response.data.total;
        const dataSource = dataState[recordActive.value];
        //clear array and then push new record
        dataSource.splice(0);
        dataSource.push(...response.data.records);
        loading.value = false;
      }
      return;
    });
  } else {
    loadRecords(recordActive.value, searchForm[recordActive.value])
      .then((response) => {
        if (response.code === 0) {
          pagination.total = response.data.total;
          const dataSource = dataState[recordActive.value];
          //clear array and then push new record
          dataSource.splice(0);
          dataSource.push(...response.data.records);
        }
      })
      .catch((error) => {
        console.log("error", error);
      })
      .then(() => {
        loading.value = false;
      });
  }
};
const recordPage = (pagination) => {
  searchForm[recordActive.value].current = pagination.current;
  searchRecord();
};
const recordBetPage = (pagination) => {
  searchForm.betRecord.current = pagination.current;
  betDetails(selectedBetRecord);
};
const chgDate = (val) => {
  var gapDate = new Date().getTime() - val * 24 * 60 * 60 * 1000;
  var oldDate = new Date(gapDate);
  var newDate = {
    Y: oldDate.getFullYear() + "-",
    M: oldDate.getMonth() + 1 < 10 ? "0" + (oldDate.getMonth() + 1 + "-") : oldDate.getMonth() + 1 + "-",
    D: oldDate.getDate() < 10 ? "0" + (oldDate.getDate() + "") : oldDate.getDate() + ""
  };
  var useDate = newDate.Y + newDate.M + newDate.D;
  return useDate;
};
const getTime = () => {
  ["deposit", "rebates", "transfer", "turnover", "withdraw", "gameBetRecord", "reminderRecord"].forEach(function (v) {
    if (v in searchForm) {
      searchForm[v].startDate = chgDate(7);
      searchForm[v].endDate = chgDate(0);
      if (v === "gameBetRecord") {
        // 结束时间如果不跟开始时间一个月，则从当月1号开始
        if (moment(searchForm[v].startDate).format("YYYY-MM") !== moment(searchForm[v].endDate).format("YYYY-MM")) {
          searchForm[v].startDate = moment(searchForm[v].endDate).format("YYYY-MM") + "-01";
        }
      }
    }
  });
  searchRecord();
};
onMounted(() => {
  getTime();
});
const platformsList = ref([]);
const getPlatList = () => {
  getPlatformList().then((ret) => {
    platformsList.value = ret;
  });

  const obj = {
    memberId: searchForm.gameBetRecord.memberId,
    platform: searchForm.gameBetRecord.platform,
    startDate: searchForm.gameBetRecord.startDate,
    endDate: searchForm.gameBetRecord.endDate
  };
  gameBetRecordTotal(obj).then((ret) => {
    if (ret.code === 0) {
      totalBetRecord.totalBet = ret.data.totalBet;
      totalBetRecord.totalPayout = ret.data.totalPayout;
    }
  });
};
const clearItems = (done) => {
  uploadFileRef.value.clear();
  done();
};
const selectedBetRecord = ref({});
const getTurnoverType = (turnoverType) => {
  if (!turnoverType) {
    return "";
  }
  if (turnoverType === "WITHDRAW_FAIL") {
    return "Fail Withdrawal"; // Fail Withdrawal
  } else if (turnoverType === "WITHDRAW") {
    return "Withdraw"; // Withdraw
  } else {
    return turnoverType;
  }
};
const getWithdrawStatus = (withdrawStatus) => {
  if (withdrawStatus === "APPLY") {
    return "Applying"; //Applying
  } else if (withdrawStatus === "FAIL") {
    return "Failed"; // Failed
  } else if (withdrawStatus === "SUCCESS") {
    return "Success"; // Success
  } else if (withdrawStatus === "STEP_1") {
    return "Under review"; //Under review
  } else if (withdrawStatus === "STEP_2") {
    return "To be paid"; // To be paid
  } else if (withdrawStatus === "STEP_3") {
    return "Paying"; // Payment on going
  } else if (withdrawStatus === "STEP_4") {
    return "Automatic Payment"; // Automatic Payment
  } else if (withdrawStatus === "STEP_5") {
    return "Suspend"; //Suspend
  } else if (withdrawStatus === "WAITING_CALLBACK") {
    return "Paying"; //Paying
  } else {
    return withdrawStatus;
  }
};
const getDepositStatus = (depositStatus) => {
  if (!depositStatus) {
    return "";
  }
  if (depositStatus === "PENDING") {
    return "Pending"; // Pending
  } else if (depositStatus === "SUCCESS") {
    return "Success"; // Success
  } else if (depositStatus === "SUPPLEMENT_SUCCESS") {
    return "Supplement Success"; // Supplement Success
  } else if (depositStatus === "CLOSED") {
    return "Closed"; // Closed
  } else {
    return depositStatus;
  }
};

const betRecordDialog = ref(false);
const betDetails = (record) => {
  dataState.betRecord = [];
  selectedBetRecord.value = record;
  const obj = {
    gameName: record.gameName,
    platform: record.platform,
    betTime: moment(record.betTime).format("yyyy-MM-DD"),
    memberId: searchForm.betRecord.memberId,
    current: searchForm.betRecord.current,
    size: searchForm.betRecord.size
  };
  loadRecords("betRecord", obj).then((response) => {
    if (response.code === 0) {
      betPagination.total = response.data.total;
      betRecordDialog.value = true;
      // dataState.betRecord = response.data.records
      dataState.betRecord.push(...response.data.records);
    }
  });
};
const getImageLink = (linkId) => {
  reminderForm.photos = `${linkId}`;
};

const checkType = (ts) => {
  if (ts === 1) {
    return "Deposit";
  } else {
    return "Withdraw";
  }
};

const humanDatetime = (ts) => {
  return moment(ts).format("MM/DD/yyyy HH:mm:ss");
};
</script>
<style scoped lang="scss">
.account-content.transit {
  margin: 0;
  padding: 0;
  .form-wrapped {
    :deep(.ant-tabs-top-bar) {
      margin-bottom: 25px;
    }
  }
}

.finance-record-wrapper {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 24px;
  margin-top: 21px;

  .finance-record-item {
    display: grid;
    grid-template-columns: repeat(2, min-content);
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 24px;
    border-bottom: 3px solid #ffffff0d;
    font-size: 16px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: -0.0008em;
    color: #ffffff;

    .finance-record-item__title {
    }

    .finance-record-item__status {
      padding: 7px 17px;
      font-weight: 500;
      white-space: nowrap;
      &.PENDING {
        background-color: #ff7a0033;
        color: #ff7a00;
      }
      &.SUCCESS,
      &.SUPPLEMENT_SUCCESS {
        background-color: #00b90033;
        color: #00b900;
      }
      &.CLOSED,
      &.REJECTED,
      &.LOSS {
        background-color: #b8121233;
        color: #b81212;
      }
    }

    .finance-record-item__date {
      color: #9a9a9a;
    }

    .finance-record-item__amount {
      font-weight: 700;
      font-size: 20px;
      text-align: right;
      color: #00b900;
    }
  }

  &.deposit {
    > div {
      height: unset;
    }
    .finance-record-item__amount {
      color: #00b900;
    }
  }

  &.withdraw {
    .finance-record-item__amount {
      color: #b81212;
    }
  }
}
</style>
<!-- <style scoped lang="scss">
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
  margin-top: 0;
}
:deep(.ant-upload-list.ant-upload-list-text > div) {
  width: 100%;
}
:deep(.ant-upload-list-item-card-actions .anticon) {
}
:deep(.ant-upload-list-item:hover .ant-upload-list-item-info) {
}
:deep(.ant-form-item-label > label) {
}
.ant-input[disabled] {
  color: #aaaaaa;
  background-color: #181829;
}
.ant-input {
  border-width: 1px;
}
.payout-total {
  display: flex;
  justify-content: right;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}
:deep(.ant-select:hover .ant-select-clear) {
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
@media (max-width: 767px) {
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
</style> -->
