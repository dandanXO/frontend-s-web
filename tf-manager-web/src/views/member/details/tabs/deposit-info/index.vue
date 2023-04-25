<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.depositDate"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
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
                formatter: 'YYYY/MM/DD HH:mm:ss',
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
                formatter: 'YYYY/MM/DD HH:mm:ss',
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.paymentType')"
          prop="paymentType"
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
                formatter: 'YYYY/MM/DD HH:mm:ss',
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
              {{ scope.row.status }}
            </el-tag>
            <el-tag
              v-else-if="scope.row.status === 'CLOSED'"
              type="danger"
              size="mini"
            >
              {{ scope.row.status }}
            </el-tag>
            <el-tag
              v-else-if="scope.row.status === 'SUCCESS' || scope.row.status === 'SUPPLEMENT_SUCCESS'"
              type="success"
              size="mini"
            >
              {{ scope.row.status }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top:10px;">
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
import { getMemberDepositRecord, getMemberDepositRecordTotalAmount } from '../../../../../api/member';
import { useI18n } from "vue-i18n";

const props = defineProps({
  mbrId: {
    type: String,
    required: true,
  },
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

const shortcuts = [
  {
    text: t('fields.today'),
    value: () => {
      const end = new Date();
      const start = new Date();
      return [start, end];
    }
  },
  {
    text: t('fields.yesterday'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(1, 'days').format('x'));
      end.setTime(moment(end).subtract(1, 'days').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.thisWeek'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).startOf('week').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.lastWeek'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(1, 'weeks').startOf('week').format('x'));
      end.setTime(moment(end).subtract(1, 'weeks').endOf('week').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.thisMonth'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).startOf('month').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.lastMonth'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(1, 'months').startOf('month').format('x'));
      end.setTime(moment(end).subtract(1, 'months').endOf('month').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.last3Months'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(2, 'months').startOf('month').format('x'));
      return [start, end];
    }
  }
];

const startDate = new Date();
startDate.setDate(startDate.getDate() - 2);
const defaultStartDate = convertDate(startDate);
const defaultEndDate = convertDate(new Date());

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
  totalDepositAmount: 0
})
const sort = column => {
  request.orderBy = column.prop
  loadDepositInfo()
}
function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

function disabledDate(time) {
  return time.getTime() < moment(new Date()).subtract(2, 'months').startOf('month').format('x') || time.getTime() > new Date().getTime();
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
    query.depositDate = request.depositDate.join(',');
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
  }
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
