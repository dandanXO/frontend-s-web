<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('fields.depositRecord') }}</span>
        </div>
      </template>
      <div class="inputs-wrap">
        <el-date-picker
          v-model="request.depositDate"
          format="DD/MM/YYYY HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 380px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />
        <el-input v-model="request.loginName" size="small" class="input-small" :placeholder="t('fields.loginName')" />
        <div class="btn-grp">
          <el-button icon="el-icon-search" type="primary" @click="loadDepositRecords()" size="mini">
            {{ $t('fields.search') }}
          </el-button>
          <el-button size="mini" type="warning" @click="resetQuery()">
            {{ $t('fields.reset') }}
          </el-button>
        </div>
      </div>
      <el-table :data="page.records" ref="table"
                row-key="id"
                size="small"
                highlight-current-row
                v-loading="page.loading"
                style="margin-top: 15px;"
                :empty-text="t('fields.noData')"
      >
        <el-table-column prop="serialNumber" :label="t('fields.serialNumber')" align="center" min-width="150" />
        <el-table-column prop="loginName" :label="t('fields.loginName')" align="center" min-width="100" />
        <el-table-column prop="depositAmount" :label="t('fields.depositAmount')" align="center" min-width="100">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.depositAmount,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="depositDate" :label="t('fields.depositDate')" align="center" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.depositDate === null">-</span>
            <span
              v-if="scope.row.depositDate !== null"
              v-formatter="{data: scope.row.depositDate, formatter: 'YYYY/MM/DD HH:mm:ss', type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="finishDate" :label="t('fields.finishDate')" align="center" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.finishDate === null">-</span>
            <span
              v-if="scope.row.finishDate !== null"
              v-formatter="{data: scope.row.finishDate, formatter: 'YYYY/MM/DD HH:mm:ss', type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('fields.status')" align="center" min-width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'SUCCESS' || scope.row.status === 'SUPPLEMENT_SUCCESS'" type="success" size="mini">{{ t('depositStatus.' + scope.row.status) }}</el-tag>
            <el-tag v-else-if="scope.row.status === 'CLOSED'" type="danger" size="mini">{{ t('depositStatus.' + scope.row.status) }}</el-tag>
            <el-tag v-else-if="scope.row.status === 'PENDING'" type="warning" size="mini">{{ t('depositStatus.' + scope.row.status) }}</el-tag>
            <el-tag v-else type="info" size="mini">-</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentName" :label="t('fields.paymentName')" align="center" min-width="100">
          <template #default="scope">
            <span v-if="scope.row.paymentName === null">-</span>
            <span v-if="scope.row.paymentName !== null">{{ scope.row.paymentName }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @current-change="changePage"
        layout="prev, pager, next"
        :page-size="request.size"
        :page-count="page.pages"
        :current-page="request.current"
      />
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { useStore } from "@/store";
import moment from 'moment';
import { getMemberDepositRecords } from '../../../api/affiliate-deposit-record';
import { useI18n } from "vue-i18n";

const store = useStore();
const { t } = useI18n();

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
  loginName: null
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false
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
  request.loginName = null;
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
  const { data: ret } = await getMemberDepositRecords(store.state.user.id, query);
  page.pages = ret.pages;
  page.records = ret.records;
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

@media (max-width: 768px) {
  .inputs-wrap {
    flex-direction: column;
    gap: 10px;
    .el-input--small {
      width: 100% !important;
      max-width: unset !important;
      margin: 0 !important;
      .el-button {
        margin: 0 !important;
      }
    }
    .input-small {
      max-width: unset;
      width: 100%;
    &.el-range-editor--small.el-input__inner {
      max-width: unset;
    }
    }
  }
}
</style>
