<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('menu.Affiliate Daily Report') }}</span>
        </div>
      </template>
      <div class="inputs-wrap">
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          class="input-small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
        />
        <div class="btn-grp">
          <el-button icon="el-icon-search" type="primary" @click="loadAffiliateDailyReport()" size="mini">
            {{ $t('fields.search') }}
          </el-button>
          <el-button size="mini" type="warning" @click="request.recordTime=[]">
            {{ $t('fields.reset') }}
          </el-button>
        </div>
      </div>
      <el-table :data="page.records" ref="table"
                row-key="id"
                size="small"
                highlight-current-row
                v-loading="page.loading"
                :load="getChildren"
                lazy
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                :empty-text="t('fields.noData')"
      >
        <el-table-column prop="recordTime" :label="t('fields.recordTime')" header-align="center" min-width="180" />
        <el-table-column prop="loginName" :label="t('fields.loginName')" align="center" min-width="120" />
        <el-table-column prop="activeMember" :label="t('fields.activeMember')" align="center" min-width="140">
          <template #default="scope">
            <span v-if="scope.row.activeMember === null">0</span>
            <span v-if="scope.row.activeMember !== null">{{ scope.row.activeMember }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="depositAmount" :label="t('fields.depositAmount')" align="center" min-width="140">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.depositAmount,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="withdrawAmount" :label="t('fields.withdrawAmount')" align="center" min-width="140">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.withdrawAmount,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="bonus" :label="t('fields.bonus')" align="center" min-width="120">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.bonus,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="adjustment" :label="t('fields.adjustment')" align="center" min-width="120">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.adjustment,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="bet" :label="t('fields.bet')" align="center" min-width="120">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.bet,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="payout" :label="t('fields.payout')" align="center" min-width="120">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.payout,type: 'money'}" />
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
import { onMounted, reactive } from "vue";
import { useStore } from "@/store";
import moment from "moment";
import { countChild } from '../../../api/statistics';
import { getDailyReport, getChildDailyReport } from '../../../api/affiliate-summary';
import { useI18n } from "vue-i18n";
import { getShortcuts, disabledDate } from '@/utils/datetime';

const store = useStore();
const { t } = useI18n();
const startDate = new Date();
const defaultStartDate = convertDate(startDate.setTime(moment(startDate).startOf('month').format('x')));
const defaultEndDate = convertDate(new Date());

const request = reactive({
  recordTime: [defaultStartDate, defaultEndDate],
  size: 20,
  current: 1
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const shortcuts = getShortcuts(t);

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

async function loadAffiliateDailyReport() {
  page.loading = true;
  const query = checkQuery();
  const { data: ret } = await getDailyReport(store.state.user.id, query);
  page.pages = ret.pages;
  page.records = ret.records;
  for (const record of page.records) {
    const { data: count } = await countChild(record.affiliateId, query);
    if (count > 0) {
      record.hasChildren = true;
    }
  }
  page.loading = false;
}

async function getChildren(record, treeNode, resolve) {
  const query = checkQuery();
  query.recordTime = record.recordTime + "," + record.recordTime;
  const { data: ret } = await getChildDailyReport(record.affiliateId, query);
  record.children = ret;
  for (const child of record.children) {
    const { data: count } = await countChild(child.affiliateId, query);
    if (count > 0) {
      child.hasChildren = true;
    }
  }
  resolve(ret);
}

function checkQuery() {
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(",");
    }
  }
  return query;
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page;
    loadAffiliateDailyReport();
  }
}

onMounted(async() => {
  await loadAffiliateDailyReport();
});
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
