<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.depositDate"
          format="DD/MM/YYYY HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="margin-right: 10px; width: 300px"
          :shortcuts="shortcuts"
          @change="checkDateValue"
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
            :label="t('depositStatus.'+item.value)"
            :value="item.value"
          />
        </el-select>
        <el-button
          icon="el-icon-search"
          type="primary"
          @click="loadDepositInfo"
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
          :label="t('fields.depositAmount')"
          align="center"
          min-width="180"
          prop="depositAmount"
          sortable
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.depositAmount, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.depositDate')"
          align="center"
          min-width="180"
          prop="depositDate"
          sortable
        >
          <template #default="scope">
            <span
              v-formatter="{
                data: scope.row.depositDate,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.finishDate')"
          align="center"
          min-width="180"
          prop="finishDate"
          sortable
        >
          <template #default="scope">
            <span v-if="scope.row.finishDate === null">-</span>
            <span
              v-else
              v-formatter="{
                data: scope.row.finishDate,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.paymentType')"
          prop="paymentTypeName"
          align="center"
          min-width="180"
        />
        <el-table-column
          :label="t('fields.updateBy')"
          prop="updateBy"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.updateBy === null">-</span>
            <span v-if="scope.row.updateBy !== null">{{ scope.row.updateBy }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.updateTime')"
          prop="updateTime"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.updateTime === null">-</span>
            <span
              v-else
              v-formatter="{
                data: scope.row.updateTime,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.privilegeName')"
          prop="privilegeName"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.privilegeName === null">-</span>
            <span v-if="scope.row.privilegeName !== null">{{ scope.row.privilegeName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.depositStatus')"
          prop="status"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <el-tag
              v-if="scope.row.status === 'PENDING'"
              type="warning"
              size="mini"
            >
              {{ t('depositStatus.PENDING') }}
            </el-tag>
            <el-tag
              v-else-if="scope.row.status === 'CLOSED'"
              type="danger"
              size="mini"
            >
              {{ t('depositStatus.CLOSED') }}
            </el-tag>
            <el-tag
              v-else-if="scope.row.status === 'SUCCESS'"
              type="success"
              size="mini"
            >
              {{ t('depositStatus.SUCCESS') }}
            </el-tag>
            <el-tag
              v-else-if="scope.row.status === 'SUPPLEMENT_SUCCESS'"
              type="success"
              size="mini"
            >
              {{ t('depositStatus.SUPPLEMENT_SUCCESS') }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top:10px;">
        <span style="margin-right:20px;">{{ t('fields.totalSuccessDeposit') }}: {{ page.totalSuccess }}</span>
        <span style="margin-right:20px;">{{ t('fields.totalSuccessDepositAmount') }}: {{ page.totalSuccessDepositAmount }}</span>
        <span style="margin-right:20px;">{{ t('fields.totalNoOfDeposits') }}: {{ page.total }}</span>
        <span>{{ t('fields.totalDepositedAmount') }}: {{ page.totalDepositAmount }}</span>
      </div>
      <el-pagination
        :total="page.total"
        :page-sizes="[20, 50, 100, 150]"
        layout="total,sizes,prev, pager, next"
        style="margin-top: 10px"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @current-change="loadDepositInfo"
        @size-change="loadDepositInfo"
      />
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, defineProps, reactive } from 'vue';
import moment from 'moment';
import { getMemberDepositRecord, getMemberDepositRecordTotalAmount, getMemberDepositSuccessRecord } from '../../../../../api/member';
import { useI18n } from "vue-i18n";
import { convertDateToEnd, convertDateToStart, getShortcuts } from "@/utils/datetime";
import { formatInputTimeZone } from "@/utils/format-timeZone"
import { ElMessage } from "element-plus";
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
const statusList = reactive({
  list: [
    { key: 1, name: 'PENDING', value: 'PENDING' },
    { key: 2, name: 'SUCCESS', value: 'SUCCESS' },
    { key: 3, name: 'CLOSED', value: 'CLOSED' },
    { key: 4, name: 'SUPPLEMENT_SUCCESS', value: 'SUPPLEMENT_SUCCESS' }
  ]
})

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];
const shortcuts = getShortcuts(t);
const startDate = new Date();
startDate.setDate(startDate.getDate() - 2);
const defaultStartDate = convertDateToStart(startDate);
const defaultEndDate = convertDateToEnd(new Date());
const request = reactive({
  depositDate: [defaultStartDate, defaultEndDate],
  status: null,
  size: 20,
  current: 1,
  orderBy: 'depositDate',
})
const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
  totalDepositAmount: 0,
  totalSuccessDepositAmount: 0,
  totalSuccess: 0
})
const sort = column => {
  request.orderBy = column.prop
  loadDepositInfo()
}

const checkDateValue = (date) => {
  const [startCheck, endCheck] = date;
  const distract = moment(endCheck).diff(startCheck, 'days');
  if (distract >= 93) {
    ElMessage({
      message: t('message.startenddatemore3months'),
      type: "error"
    });
    request.depositDate = [defaultStartDate, defaultEndDate];
  }
}

function resetQuery() {
  request.depositDate = [defaultStartDate, defaultEndDate]
  request.status = null
}
async function loadDepositInfo() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  })
  if (request.depositDate && request.depositDate.length === 2) {
    query.depositDate = JSON.parse(JSON.stringify(request.depositDate));
    query.depositDate[0] = formatInputTimeZone(query.depositDate[0], props.timeZone);
    query.depositDate[1] = formatInputTimeZone(query.depositDate[1], props.timeZone);
    query.depositDate = query.depositDate.join(',');
  }
  query.memberId = props.mbrId;
  query.status = request.status;
  const { data: ret } = await getMemberDepositRecord(props.mbrId, query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  if (page.records.length !== 0) {
    const { data: amount } = await getMemberDepositRecordTotalAmount(props.mbrId, query);
    page.totalDepositAmount = amount;
  } else {
    page.totalDepositAmount = 0;
  }
  const { data: success } = await getMemberDepositSuccessRecord(props.mbrId, query);
  page.totalSuccessDepositAmount = success.totalAmount
  page.totalSuccess = success.totalCount
  page.loading = false;
}

onMounted(() => {
  loadDepositInfo()
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
