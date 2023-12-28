<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.withdrawDate"
          format="DD/MM/YYYY HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="margin-right: 10px; width: 300px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />
        <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 120px; margin-right: 10px"
        >
          <el-option
            v-for="item in statusList.list"
            :key="item.key"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-button
          icon="el-icon-search"
          type="primary"
          @click="loadWithdrwalInfo"
          size="small"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="small"
          type="warning"
          @click="resetQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <el-table
        height="600"
        size="small"
        :resizable="true"
        :data="page.records"
        @sort-change="sort"
        v-loading="page.loading"
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          :label="t('fields.serialNo')"
          prop="serialNumber"
          align="center"
          min-width="180"
        />
        <el-table-column
          :label="t('fields.bank')"
          prop="bankName"
          align="center"
          min-width="180"
        />
        <el-table-column
          :label="t('fields.bankCardNumber')"
          prop="bankCard"
          align="center"
          min-width="180"
        />
        <el-table-column
          :label="t('fields.withdrawAmount')"
          align="center"
          min-width="180"
          prop="withdrawAmount"
          sortable
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.withdrawAmount, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.withdrawDate')"
          align="center"
          min-width="180"
          prop="withdrawDate"
          sortable
        >
          <template #default="scope">
            <span
              v-formatter="{
                data: scope.row.withdrawDate,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.checkDate')"
          align="center"
          min-width="180"
          prop="checkDate"
          sortable
        >
          <template #default="scope">
            <span
              v-formatter="{
                data: scope.row.checkDate,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.paymentDate')"
          align="center"
          min-width="180"
          prop="paymentDate"
          sortable
        >
          <template #default="scope">
            <span
              v-formatter="{
                data: scope.row.paymentDate,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.withdrawStatus')"
          prop="status"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.status === 'APPLY'">{{ t('fields.applying') }}</span>
            <span v-else-if="scope.row.status === 'STEP_1'">{{ t('fields.underReview') }}</span>
            <span v-else-if="scope.row.status === 'STEP_2'">{{ t('fields.toBePaid') }}</span>
            <span v-else-if="scope.row.status === 'STEP_3'">
              {{ t('fields.paymentOnGoing') }}
            </span>
            <span v-else-if="scope.row.status === 'AUTOPAY'">
              {{ t('fields.automaticPayment') }}
            </span>
            <span v-else-if="scope.row.status === 'PENDING'">{{ t('fields.suspend') }}</span>
            <span v-else-if="scope.row.status === 'SUCCESS'">{{ t('fields.success') }}</span>
            <span v-else>{{ scope.row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.checkBy')"
          prop="checkBy"
          align="center"
          min-width="180"
        />
        <el-table-column
          :label="t('fields.payBy')"
          prop="paymentBy"
          align="center"
          min-width="180"
        />
        <el-table-column
          :label="t('fields.remark')"
          prop="remark"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.remark === null">-</span>
            <span v-else>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.operate')"
          align="center"
          min-width="120"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              size="mini"
              type="primary"
              @click="showDialog('LOG', scope.row)"
            >
              {{ t('fields.viewLog') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top:10px;">
        <span style="margin-right:20px;">
          {{ t('fields.totalNoOfWithdrawals') }}: {{ page.total }}
        </span>
        <span>{{ t('fields.totalWithdrawnAmount') }}: {{ page.totalWithdrawAmount }}</span>
      </div>
      <el-pagination
        :total="page.total"
        :page-sizes="[20, 50, 100, 150]"
        layout="total,sizes,prev, pager, next"
        style="margin-top: 10px"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @current-change="loadWithdrwalInfo"
        @size-change="loadWithdrwalInfo"
      />
    </el-card>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="900px"
    >
      <el-table
        v-if="uiControl.dialogType === 'LOG'"
        height="400px"
        size="small"
        :resizable="true"
        :data="logPage.records"
        v-loading="logPage.loading"
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          prop="operate"
          :label="t('fields.operate')"
          align="center"
          min-width="200"
        >
          <template #default="scope">
            <span v-if="scope.row.operate === 'UPGRADE_TO_CHECK'">
              {{ t('fields.upgradeToCheck') }}
            </span>
            <span v-else-if="scope.row.operate === 'DOWNGRADE_TO_APPLY'">
              {{ t('fields.downgradeToApplying') }}
            </span>
            <span v-else-if="scope.row.operate === 'CHECK'">{{ t('fields.check') }}</span>
            <span v-else-if="scope.row.operate === 'CHECK_FAIL'">
              {{ t('fields.checkFail') }}
            </span>
            <span v-else-if="scope.row.operate === 'UPGRADE_TO_PAY'">
              {{ t('fields.upgradeToPaymentOnGoing') }}
            </span>
            <span v-else-if="scope.row.operate === 'DOWNGRADE_TO_WAIT_PAY'">
              {{ t('fields.downgradeToWaitPay') }}
            </span>
            <span v-else-if="scope.row.operate === 'AUTOPAY'">
              {{ t('fields.automaticPay') }}
            </span>
            <span v-else-if="scope.row.operate === 'PENDING'">{{ t('fields.pending') }}</span>
            <span v-else-if="scope.row.operate === 'SUCCESS'">{{ t('fields.success') }}</span>
            <span v-else-if="scope.row.operate === 'RESUME'">{{ t('fields.resume') }}</span>
            <span v-else>{{ scope.row.operate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operator"
          :label="t('fields.operator')"
          align="center"
          min-width="180"
        />
        <el-table-column
          prop="operateTime"
          :label="t('fields.operateTime')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <span v-if="scope.row.operateTime === null">-</span>
            <span
              v-if="scope.row.operateTime !== null"
              v-formatter="{
                data: scope.row.operateTime,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="cancelType"
          :label="t('fields.cancelType')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <span v-if="scope.row.cancelType === null">-</span>
            <span v-if="scope.row.cancelType !== null">
              {{ scope.row.cancelType }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          :label="t('fields.remark')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <span v-if="scope.row.remark === null">-</span>
            <span v-if="scope.row.remark !== null">{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <div class="log-dialog-footer">
          <el-button type="primary" @click="uiControl.dialogVisible = false">
            {{ t('fields.close') }}
          </el-button>
        </div>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, defineProps, reactive } from 'vue'
import moment from 'moment'
import {
  getMemberWithdrawRecord,
  getMemberWithdrawRecordTotalAmount,
} from '../../../../../api/member'
import { getMemberWithdrawLog } from '../../../../../api/member-withdraw-log'
import { useI18n } from "vue-i18n";
import { convertDateToEnd, convertDateToStart, getShortcuts } from "@/utils/datetime";
import { formatInputTimeZone } from "@/utils/format-timeZone"
const props = defineProps({
  mbrId: {
    type: String,
    required: true,
  },
  timeZone: {
    type: String,
    required: true,
  }
})

const { t } = useI18n();
const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];
const shortcuts = getShortcuts(t);
const startDate = new Date()
startDate.setDate(startDate.getDate() - 2)
const defaultStartDate = convertDateToStart(startDate);
const defaultEndDate = convertDateToEnd(new Date());
const request = reactive({
  withdrawDate: [defaultStartDate, defaultEndDate],
  status: null,
  size: 20,
  current: 1,
  orderBy: 'withdrawDate',
})

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
  totalWithdrawAmount: 0,
})

const uiControl = reactive({
  dialogVisible: false,
  progressBarVisible: false,
  dialogTitle: '',
  dialogType: 'LOG',
})

const logPage = reactive({
  records: [],
  loading: false,
})

const statusList = reactive({
  list: [
    { key: 1, name: t('withdrawStatus.APPLY'), value: 'APPLY' },
    { key: 2, name: t('withdrawStatus.REJECT'), value: 'REJECT' },
    { key: 3, name: t('withdrawStatus.STEP_1'), value: 'STEP_1' },
    { key: 4, name: t('withdrawStatus.STEP_2'), value: 'STEP_2' },
    { key: 5, name: t('withdrawStatus.STEP_3'), value: 'STEP_3' },
    { key: 6, name: t('withdrawStatus.PAYING'), value: 'PAYING' },
    { key: 7, name: t('withdrawStatus.AUTOPAY'), value: 'AUTOPAY' },
    { key: 8, name: t('withdrawStatus.SENDING'), value: 'SENDING' },
    { key: 9, name: t('withdrawStatus.WAITING_CALLBACK'), value: 'WAITING_CALLBACK' },
    { key: 10, name: t('withdrawStatus.SUCCESS'), value: 'SUCCESS' },
    { key: 11, name: t('withdrawStatus.FAIL'), value: 'FAIL' },
    { key: 12, name: t('withdrawStatus.PENDING'), value: 'PENDING' },
  ],
})
const sort = column => {
  request.orderBy = column.prop
  loadWithdrwalInfo()
}

function disabledDate(time) {
  return (
    time.getTime() <
      moment(new Date())
        .subtract(2, 'months')
        .startOf('month')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

function resetQuery() {
  request.withdrawDate = [defaultStartDate, defaultEndDate]
  request.status = null
}

async function loadWithdrwalInfo() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.withdrawDate && request.withdrawDate.length === 2) {
    query.withdrawDate = JSON.parse(JSON.stringify(request.withdrawDate));
    query.withdrawDate[0] = formatInputTimeZone(query.withdrawDate[0], props.timeZone);
    query.withdrawDate[1] = formatInputTimeZone(query.withdrawDate[1], props.timeZone);
    query.withdrawDate = query.withdrawDate.join(',')
  }
  query.memberId = props.mbrId
  query.status = request.status
  const { data: ret } = await getMemberWithdrawRecord(props.mbrId, query)
  page.pages = ret.pages
  page.records = ret.records
  page.total = ret.total
  if (page.records.length !== 0) {
    const { data: amount } = await getMemberWithdrawRecordTotalAmount(
      props.mbrId,
      query
    )
    page.totalWithdrawAmount = amount
  }
  page.loading = false
}

async function showDialog(type, memberWithdrawRecord) {
  if (type === 'LOG') {
    uiControl.dialogTitle = t('fields.memberWithdrawLog')
    logPage.loading = true
    const { data: ret } = await getMemberWithdrawLog(memberWithdrawRecord.id, memberWithdrawRecord.withdrawDate)
    logPage.records = ret
    logPage.loading = false
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

onMounted(() => {
  loadWithdrwalInfo()
})
</script>

<style scoped>
.header-container {
  margin: 20px 0;
  display: flex;
}

.search {
  display: flex;
  justify-content: flex-start;
}
</style>
