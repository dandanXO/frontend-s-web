<template>
  <div class="roles-main">
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
      <el-select
        v-model="request.status"
        size="small"
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
      <!-- <el-table-column prop="paymentName" :label="t('fields.paymentName')" align="center" min-width="100">
        <template #default="scope">
          <span v-if="scope.row.paymentName === null">-</span>
          <span v-if="scope.row.paymentName !== null">{{ scope.row.paymentName }}</span>
        </template>
      </el-table-column> -->
    </el-table>
    <div class="table-footer">
      <span style="margin-right:20px;">{{ t('fields.totalDeposit') }}: $ <span v-formatter="{data: page.totalDeposit,type: 'money'}" /></span>
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
import { getDepositRecords, getTotal } from '@/api/affiliate-deposit-record';
import { useI18n } from "vue-i18n";
import { getShortcuts, convertDateToStart, convertDateToEnd, disabledDate } from '@/utils/datetime';

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
const shortcuts = getShortcuts(t);

const request = reactive({
  size: 20,
  current: 1,
  depositDate: [convertDateToStart(new Date()), convertDateToEnd(new Date())],
  status: null
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  total: 0,
  totalDeposit: 0
});

function resetQuery() {
  request.depositDate = [convertDateToStart(new Date()), convertDateToEnd(new Date())];
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
