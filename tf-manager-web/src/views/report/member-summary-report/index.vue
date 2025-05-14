<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 280px; margin-left: 10px;"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
        />
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.loginName')"
        />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadSummaryRecords()">
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
    </div>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      v-loading="page.loading"
      highlight-current-row
      :summary-method="getSummaries"
      show-summary
      :empty-text="t('fields.noData')"
      :default-sort="{prop: 'balance', order: 'descending'}"
      @sort-change="sort"
    >
      <el-table-column prop="loginName" :label="t('fields.loginName')">
        <template
          #default="scope"
          v-if="hasPermission(['sys:member:detail'])"
        >
          <router-link
            :to="`/member/details/${scope.row.memberId}?site=${request.siteId}`"
          >
            <el-link type="primary">{{ scope.row.loginName }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="balance" :label="t('fields.balance')" sortable :sort-orders="sortOrders">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.balance, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="depositAmount" :label="t('fields.depositAmount')" sortable :sort-orders="sortOrders">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.depositAmount, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="depositCount" :label="t('fields.depositCount')" sortable :sort-orders="sortOrders" />
      <el-table-column prop="withdrawAmount" :label="t('fields.withdrawAmount')" sortable :sort-orders="sortOrders">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.withdrawAmount, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="withdrawCount" :label="t('fields.withdrawCount')" sortable :sort-orders="sortOrders" />
      <el-table-column prop="bonus" :label="t('fields.bonus')" sortable :sort-orders="sortOrders">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.bonus, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="bet" :label="t('fields.bet')" sortable :sort-orders="sortOrders">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.bet, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="validBet" :label="t('fields.validBet')" sortable :sort-orders="sortOrders">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.validBet, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="payout" :label="t('fields.payout')" sortable :sort-orders="sortOrders">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.payout, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="profit" :label="t('fields.profit')" sortable :sort-orders="sortOrders">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.profit, type: 'money'}" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="page.total"
      :page-sizes="[20, 50, 100, 150]"
      layout="total,sizes,prev, pager, next"
      class="pagination"
      v-model:page-size="request.size"
      v-model:page-count="page.pages"
      v-model:current-page="request.current"
      @current-change="loadSummaryRecords"
      @size-change="loadSummaryRecords"
    />
  </div>
</template>

<script setup>
/* eslint-disable */
import { computed, reactive, ref, defineEmits } from "vue";
import { onMounted } from "@vue/runtime-core";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import moment from "moment";
import { getShortcuts } from "@/utils/datetime";
import { getMemberSummaryReport } from "@/api/report-centre";
import { getSiteListSimple } from "@/api/site";
import { hasPermission } from '@/utils/util'

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const shortcuts = getShortcuts(t);
const emits = defineEmits(["switch-to-relation-tab"]);

function convertDate(date) {
  return moment(date).endOf('day').format('YYYY-MM-DD');
}

const sortOrders = ['descending', 'ascending', null]

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  loginName: null,
  recordTime: [convertDate(new Date()), convertDate(new Date())],
  order: null,
  sort: null,
});

const sites = reactive({
  list: []
});

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
  sums: [],
});

async function loadSummaryRecords() {
  page.loading = true;
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
  const { data: ret } = await getMemberSummaryReport(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.sums = ret.sums;
  page.loading = false;
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  sites.list = site;
}

function resetQuery() {
  request.siteId = site.value.id;
  request.recordTime = [convertDate(new Date()), convertDate(new Date())];
  request.loginName = null;
}

function getSummaries(param) {
  const { columns } = param
  var sums = []
  if (page.sums) {
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = t('fields.total')
      } else {
        var prop = column.property
        if (
          index === 3 ||
          index === 5
        ) {
          sums[index] = page.sums[prop]
        } else {
          sums[index] =
            '$' +
            parseFloat(page.sums[prop]).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
        }
      }
    })
  }
  return sums
}

const sort = (column) => {
  request.order = column.prop;
  if (column.order === "descending") {
    request.sort = "DESC";
  } else {
    request.sort = "ASC";
  }
  loadSummaryRecords();
};

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
  } else {
    site.value = sites.list[0];
  }
  request.siteId = site.value.id;
  await loadSummaryRecords();
});

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: flex;
  justify-content: flex-start;
}

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-form-item--level-color:deep(.el-form-item__content) {
  display: flex !important;
}
.el-overlay-dialog .el-image {
  width: 100px;
  height: 100px;
  background-color: #c1c1c1;
}
</style>
