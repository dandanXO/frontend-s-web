<template>
  <div class="roles-main">
    <div class="inputs-wrap">
      <el-date-picker
        v-model="request.depositDate"
        format="DD/MM/YYYY HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        size="normal"
        type="datetimerange"
        range-separator=":"
        :start-placeholder="t('fields.startDate')"
        :end-placeholder="t('fields.endDate')"
        style="width: 100%; max-width: 380px;"
        :shortcuts="shortcuts"
        :disabled-date="disabledDate"
        :editable="false"
        :clearable="false"
        :default-time="defaultTime"
      />
      <el-select
        v-model="request.status"
        size="normal"
        :placeholder="t('fields.status')"
        class="filter-item"
        style="margin-left: 5px; width: 200px;"
        clearable
      >
        <el-option
          v-for="item in uiControl.status"
          :key="item.key"
          :label="item.displayName"
          :value="item.value"
        />
      </el-select>
      <div class="btn-grp">
        <el-button icon="el-icon-search" type="primary" @click="loadDepositRecords()" size="normal">
          {{ $t('fields.search') }}
        </el-button>
        <el-button size="normal" type="primary" plain @click="resetQuery()">
          {{ $t('fields.reset') }}
        </el-button>
      </div>
    </div>
    <table style="width: 98%; margin: 20px auto" cellpadding="0" cellspacing="0" border="0" class="custom-table">
      <thead>
        <tr>
          <th>{{ t('fields.serialNumber') }}</th>
          <th>{{ t('fields.depositAmount') }}</th>
          <th>{{ t('fields.depositDate') }}</th>
          <th>{{ t('fields.finishDate') }}</th>
          <th>{{ t('fields.status') }}</th>
        </tr>
      </thead>
      <tbody v-if="page.records.length > 0">
        <tr v-for="item in page.records" :key="item.id">
          <td>{{ item.serialNumber }}</td>
          <td>
            <span v-formatter="{data: item.depositAmount,type: 'money'}" />
          </td>
          <td>
            <span v-if="item.depositDate === null">-</span>
            <span v-if="item.depositDate !== null" v-formatter="{ data: item.depositDate, type: 'date'}" />
          </td>
          <td>
            <span v-if="item.finishDate === null">-</span>
            <span v-if="item.finishDate !== null" v-formatter="{ data: item.finishDate, type: 'date'}" />
          </td>
          <td>
            <el-tag v-if="item.status === 'SUCCESS' || item.status === 'SUPPLEMENT_SUCCESS'" type="success" size="normal">{{ t('depositStatus.' + item.status) }}</el-tag>
            <el-tag v-else-if="item.status === 'CLOSED'" type="danger" size="normal">{{ t('depositStatus.' + item.status) }}</el-tag>
            <el-tag v-else-if="item.status === 'PENDING'" type="warning" size="normal">{{ t('depositStatus.' + item.status) }}</el-tag>
            <el-tag v-else type="info" size="normal">-</el-tag>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="page.records.length === 0">
      <emptyComp />
    </div>
    <div class="table-footer">
      <span style="margin-right:20px;">{{ t('fields.totalDeposit') }}: <span v-formatter="{data: page.totalDeposit,type: 'money'}" /></span>
    </div>
    <el-pagination
      class="pagination"
      @current-change="changePage"
      layout="total, prev, pager, next"
      :total="page.total"
      :page-size="request.size"
      :page-count="page.pages"
      :current-page="request.current"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { useStore } from "@/store";
import moment from 'moment';
import { getDepositRecords, getTotal } from '@/api/affiliate-deposit-record';
import { useI18n } from "vue-i18n";
import emptyComp from "@/components/empty"
import { formatMoney } from "@/utils/format-money";

const store = useStore();
const { t } = useI18n();

const uiControl = reactive({
  status: [
    { key: 1, displayName: t('depositStatus.SUCCESS'), value: "SUCCESS" },
    { key: 2, displayName: t('depositStatus.SUPPLEMENT_SUCCESS'), value: "SUPPLEMENT_SUCCESS" },
    { key: 3, displayName: t('depositStatus.CLOSED'), value: "CLOSED" },
    { key: 4, displayName: t('depositStatus.PENDING'), value: "PENDING" }
  ]
});

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];
const shortcuts = [
  {
    text: t('fields.today'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(
        moment(start)
          .startOf('day')
          .format('x')
      )
      return [start, end];
    }
  },
  {
    text: t('fields.yesterday'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(1, 'days').startOf('day').format('x'));
      end.setTime(moment(end).subtract(1, 'days').endOf('day').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.thisWeek'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).startOf('isoWeek').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.lastWeek'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(1, 'weeks').startOf('isoWeek').format('x'));
      end.setTime(moment(end).subtract(1, 'weeks').endOf('isoWeek').format('x'));
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
  }
];

const request = reactive({
  size: 20,
  current: 1,
  depositDate: [convertStartDate(new Date()), convertDate(new Date())],
  status: null
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  total: 0,
  totalDeposit: 0
});

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

function convertStartDate(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
}

function disabledDate(time) {
  return time.getTime() > new Date().getTime();
}

function resetQuery() {
  request.depositDate = [convertStartDate(new Date()), convertDate(new Date())];
  request.status = null;
}

async function loadDepositRecords() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.depositDate !== null) {
    if (request.depositDate.length === 2) {
      query.depositDate = request.depositDate.join(",");
    }
  }
  query.siteId = store.state.user.siteId;
  const { data: ret } = await getDepositRecords(store.state.user.id, query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  query.type = 'AFFILIATE';
  const { data: total } = await getTotal(store.state.user.id, query);
  page.totalDeposit = total;
  page.loading = false;
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page;
    loadDepositRecords();
  }
}

onMounted(() => {
  loadDepositRecords();
});
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
  display: flex;
}

.box-card {
  ::v-deep(.el-card__body) {
    padding: 0;
  }
}

.inputs-wrap {
  margin: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  .input-small {
    width: 100%;
    max-width: 200px;
    &.el-range-editor--small.el-input__inner {
      height: 40px;
      max-width: 300px;
    }
  }
  .btn-grp {
    display: flex;
  }
}

.el-pagination {
  display: inline-block;
}

.table-footer {
  margin-top: 15px;
  margin-right: 20px;
  float: right;
  font-size: small;
}

@media (max-width: 768px) {
  // .inputs-wrap {
  //   flex-direction: column;
  //   gap: 10px;
  //   .el-input--small {
  //     width: 100% !important;
  //     max-width: unset !important;
  //     margin: 0 !important;
  //     .el-button {
  //       margin: 0 !important;
  //     }
  //   }
  //   .input-small {
  //     max-width: unset;
  //     width: 100%;
  //   &.el-range-editor--small.el-input__inner {
  //     max-width: unset;
  //   }
  //   }
  // }
}
</style>
