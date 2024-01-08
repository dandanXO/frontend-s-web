<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.withdrawDate"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="margin-right: 10px; width: 300px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
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
        >
          <template #default="scope">
            <span v-if="scope.row.serialNumber === null">-</span>
            <span v-if="scope.row.serialNumber !== null">
              {{ scope.row.serialNumber }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.bank')"
          prop="bankName"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.bankName === null">-</span>
            <span v-if="scope.row.bankName !== null">
              {{ scope.row.bankName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.bankCardNumber')"
          prop="bankCard"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.bankCard === null">-</span>
            <span v-if="scope.row.bankCard !== null">
              {{ scope.row.bankCard }}
            </span>
          </template>
        </el-table-column>
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
            <span v-if="scope.row.withdrawDate === null">-</span>
            <span
              v-if="scope.row.withdrawDate !== null"
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
            <span v-if="scope.row.checkDate === null">-</span>
            <span
              v-if="scope.row.checkDate !== null"
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
            <span v-if="scope.row.paymentDate === null">-</span>
            <span
              v-if="scope.row.paymentDate !== null"
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
            <el-tag
              v-if="scope.row.status === 'SUCCESS'"
              size="mini"
              type="success"
            >
              {{ scope.row.status }}
            </el-tag>
            <el-tag
              v-else-if="
                scope.row.status === 'FAIL' || scope.row.status === 'REJECT'
              "
              size="mini"
              type="danger"
            >
              {{ scope.row.status }}
            </el-tag>
            <el-tag
              v-else-if="
                scope.row.status !== 'SUCCESS' &&
                  scope.row.status !== 'FAIL' &&
                  scope.row.status !== 'REJECT'
              "
              size="mini"
            >
              {{ scope.row.status }}
            </el-tag>
            <el-tag
              v-if="
                scope.row.status !== 'FAIL' &&
                  scope.row.status !== 'SUCCESS' &&
                  scope.row.status !== 'REJECT' &&
                  scope.row.status === 'APPLY'
              "
            >
              APPLYING
            </el-tag>
            <el-tag
              v-else-if="
                scope.row.status !== 'FAIL' &&
                  scope.row.status !== 'SUCCESS' &&
                  scope.row.status !== 'REJECT' &&
                  scope.row.status === 'STEP_1'
              "
            >
              UNDER REVIEW
            </el-tag>
            <el-tag
              v-else-if="
                scope.row.status !== 'FAIL' &&
                  scope.row.status !== 'SUCCESS' &&
                  scope.row.status !== 'REJECT' &&
                  scope.row.status === 'STEP_2'
              "
            >
              TO BE PAID
            </el-tag>
            <el-tag
              v-else-if="
                scope.row.status !== 'FAIL' &&
                  scope.row.status !== 'SUCCESS' &&
                  scope.row.status !== 'REJECT' &&
                  scope.row.status === 'STEP_3'
              "
            >
              PAYMENT ON GOING
            </el-tag>
            <el-tag
              v-else-if="
                scope.row.status !== 'FAIL' &&
                  scope.row.status !== 'SUCCESS' &&
                  scope.row.status !== 'REJECT' &&
                  scope.row.status === 'AUTOPAY'
              "
            >
              AUTOMATIC PAYMENT
            </el-tag>
            <el-tag
              v-else-if="
                scope.row.status !== 'FAIL' &&
                  scope.row.status !== 'SUCCESS' &&
                  scope.row.status !== 'REJECT' &&
                  scope.row.status === 'PENDING'
              "
            >
              SUSPEND
            </el-tag>
            <el-tag v-else>{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.checkBy')"
          prop="checkBy"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.checkBy === null">-</span>
            <span v-if="scope.row.checkBy !== null">
              {{ scope.row.checkBy }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.payBy')"
          prop="paymentBy"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.paymentBy === null">-</span>
            <span v-if="scope.row.paymentBy !== null">
              {{ scope.row.paymentBy }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.remark')"
          prop="remark"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.remark === null">-</span>
            <span v-if="scope.row.remark !== null">{{ scope.row.remark }}</span>
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
  </div>
</template>

<script setup>
import { onMounted, defineProps, reactive } from 'vue'
import moment from 'moment'
import {
  getMemberWithdrawRecord,
  getMemberWithdrawRecordTotalAmount,
} from '../../../../../api/member'
import { useI18n } from "vue-i18n";
import { convertDateToEnd, convertDateToStart, getShortcuts } from "@/utils/datetime";
import { formatInputTimeZone } from "@/utils/format-timeZone"

const { t } = useI18n();
const props = defineProps({
  affId: {
    type: String,
    required: true,
  },
  timeZone: {
    type: String,
    required: true
  }
})

const shortcuts = getShortcuts(t);
const startDate = new Date()
startDate.setDate(startDate.getDate() - 2)
const defaultStartDate = convertDateToStart(startDate)
const defaultEndDate = convertDateToEnd(new Date())

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
    query.withdrawDate[0] = formatInputTimeZone(query.withdrawDate[0], props.timeZone, 'start');
    query.withdrawDate[1] = formatInputTimeZone(query.withdrawDate[1], props.timeZone, 'end');
    query.withdrawDate = query.withdrawDate.join(',')
  }
  query.memberId = props.affId
  query.status = request.status
  const { data: ret } = await getMemberWithdrawRecord(props.affId, query)
  page.pages = ret.pages
  page.records = ret.records
  page.total = ret.total
  if (page.records.length !== 0) {
    const { data: amount } = await getMemberWithdrawRecordTotalAmount(
      props.affId,
      query
    )
    page.totalWithdrawAmount = amount
  }
  page.loading = false
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
