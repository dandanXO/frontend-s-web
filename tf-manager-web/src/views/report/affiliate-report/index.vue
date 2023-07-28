<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px; margin-left: 5px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-input v-model="request.loginName" size="small" style="width: 200px; margin-left: 5px" :placeholder="t('fields.loginName')" />
        <el-input v-model="request.affiliateCode" size="small" style="width: 200px; margin-left: 5px" :placeholder="t('fields.affiliateCode')" />
        <el-select
          v-model="request.affiliateLevel"
          size="small"
          :placeholder="t('fields.affiliateLevel')"
          class="filter-item"
          style="width: 180px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.affiliateLevel"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadAffiliateReport()"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-download"
          size="mini"
          type="primary"
          v-permission="['sys:report:summary:affiliate:export']"
          @click="exportExcel"
        >{{ t('fields.exportToExcel') }}
        </el-button>
      </div>
    </div>

    <el-dialog :title="t('fields.exportToExcel')" v-model="uiControl.progressBarVisible" append-to-body width="500px"
               :close-on-click-modal="false" :close-on-press-escape="false"
    >
      <el-progress :text-inside="true" :stroke-width="26" :percentage="exportPercentage"
                   :color="uiControl.colors" v-if="exportPercentage !== 100"
      />
      <el-result
        icon="success"
        :title="t('fields.successfullyExport')"
        v-if="exportPercentage === 100"
      />
      <div class="dialog-footer">
        <el-button type="primary" :disabled="exportPercentage !== 100"
                   @click="uiControl.progressBarVisible = false"
        >{{ t('fields.done') }}
        </el-button>
      </div>
    </el-dialog>

    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="recordTime" :label="t('fields.recordTime')" align="center" min-width="110" />
      <el-table-column prop="loginName" :label="t('fields.loginName')" align="center" min-width="110">
        <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
          <router-link :to="`/affiliate/details/${scope.row.affiliateId}?site=${request.siteId}`">
            <el-link type="primary">{{ scope.row.loginName }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="affiliateCode" :label="t('fields.affiliateCode')" align="center" min-width="100" />
      <el-table-column prop="affiliateLevel" :label="t('fields.affiliateLevel')" align="center" min-width="100">
        <template #default="scope">
          {{ t('affiliate.level.' + scope.row.affiliateLevel) }}
        </template>
      </el-table-column>
      <el-table-column prop="commissionModel" :label="t('fields.commissionModel')" align="center" min-width="130">
        <template #default="scope">
          <el-tag v-if="scope.row.commissionModel === 'NORMAL'" type="success">{{ t('affiliate.commissionModel.' + scope.row.commissionModel) }}</el-tag>
          <el-tag v-else type="primary">{{ t('affiliate.commissionModel.' + scope.row.commissionModel) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="registerMemberCount" :label="t('fields.registerCount')" align="center" min-width="110" />
      <el-table-column prop="ftdMemberCount" :label="t('fields.ftdCount')" align="center" min-width="100" />
      <el-table-column prop="depositAmount" :label="t('fields.depositAmount')" align="center" min-width="120">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.depositAmount, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="depositMemberCount" :label="t('fields.depositMemberCount')" align="center" min-width="150" />
      <el-table-column prop="withdrawAmount" :label="t('fields.withdrawAmount')" align="center" min-width="120">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.withdrawAmount, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="withdrawMemberCount" :label="t('fields.withdrawMemberCount')" align="center" min-width="160" />
      <el-table-column prop="bet" :label="t('fields.bet')" align="center" min-width="120">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.bet, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="payout" :label="t('fields.payout')" align="center" min-width="120">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.payout, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="bonus" :label="t('fields.bonus')" align="center" min-width="120">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.bonus, type: 'money'}" />
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
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import * as XLSX from 'xlsx';
import moment from 'moment'
import { getAffiliateReport } from '../../../api/report-affiliate'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { hasPermission } from '../../../utils/util'
import { formatMoney } from "@/utils/format-money";

const { t } = useI18n()
const startDate = new Date()
const defaultDate = convertDate(startDate)

const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteList = reactive({
  list: [],
})

const uiControl = reactive({
  progressBarVisible: false,
  affiliateLevel: [
    { key: 1, displayName: t('affiliate.level.AFFILIATE'), value: "AFFILIATE" },
    { key: 2, displayName: t('affiliate.level.SUPER_AFFILIATE'), value: "SUPER_AFFILIATE" },
    { key: 3, displayName: t('affiliate.level.MASTER_AFFILIATE'), value: "MASTER_AFFILIATE" },
    { key: 4, displayName: t('affiliate.level.CHIEF_AFFILIATE'), value: "CHIEF_AFFILIATE" }
  ],
  colors: [
    { color: '#f56c6c', percentage: 30 },
    { color: '#e6a23c', percentage: 70 },
    { color: '#5cb87a', percentage: 100 }
  ]
});

const exportPercentage = ref(0);

const EXPORT_HEADER = [t('fields.recordTime'), t('fields.affiliateName'), t('fields.affiliateCode'), t('fields.affiliateLevel'),
  t('fields.commissionModel'), t('fields.registerCount'), t('fields.ftdCount'), t('fields.depositAmount'), t('fields.depositMemberCount'),
  t('fields.withdrawAmount'), t('fields.withdrawMemberCount'), t('fields.bet'), t('fields.payout'), t('fields.bonus')];

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const request = reactive({
  size: 20,
  current: 1,
  loginName: null,
  recordTime: [defaultDate, defaultDate],
  siteId: null,
  affiliateCode: null,
  affiliateLevel: null
})

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
]

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function disabledDate(time) {
  return time.getTime() < moment(new Date()).subtract(2, 'months').startOf('month').format('x') || time.getTime() > new Date().getTime();
}

function resetQuery() {
  request.loginName = null;
  request.affiliateCode = null;
  request.affiliateLevel = null;
  request.recordTime = [defaultDate, defaultDate];
  request.siteId = site.value ? site.value.id : siteList.list[0].id;
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(',')
    }
  }
  return query;
}

async function loadAffiliateReport() {
  page.loading = true
  const query = checkQuery();
  const { data: ret } = await getAffiliateReport(query)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

async function exportExcel() {
  uiControl.progressBarVisible = true;
  const query = checkQuery();
  query.current = 1;
  const { data: ret } = await getAffiliateReport(query);
  const exportData = [EXPORT_HEADER];
  const maxLength = [];

  pushRecordToData(ret.records, exportData);
  exportPercentage.value = Math.round(ret.current / (ret.pages + 1) * 100);
  query.current = ret.current;

  while (query.current < ret.pages) {
    query.current += 1;
    const { data: ret } = await getAffiliateReport(query);
    pushRecordToData(ret.records, exportData);
    exportPercentage.value = Math.round(ret.current / (ret.pages + 1) * 100);
  }
  const ws = XLSX.utils.aoa_to_sheet(exportData);
  exportData.map(data => {
    Object.keys(data).map(key => {
      const value = data[key];

      maxLength[key] = typeof value === 'number'
        ? (maxLength[key] >= 10 ? maxLength[key] : 10)
        : (maxLength[key] >= value.length + 2 ? maxLength[key] : value.length + 2);
    });
  });
  const wsCols = maxLength.map(w => { return { width: w } });
  ws['!cols'] = wsCols;
  const wb = XLSX.utils.book_new();
  wb.SheetNames.push('Summary');
  wb.Sheets.Summary = ws;
  XLSX.writeFile(wb, t('menu.Affiliate Report') + '(' + request.recordTime[0] + '-' + request.recordTime[1] + ').xlsx');
  exportPercentage.value = 100;
}

function pushRecordToData(records, exportData) {
  records.forEach(item => {
    delete item.id;
    delete item.affiliateId;
    delete item.registerMember;
    delete item.ftdMember;
  })
  const data = records.map(record => Object.entries(record).map(([key, item]) => {
    if (item !== 0 && (!item || item === '')) {
      return '-';
    } else {
      if (key === 'bet' || key === 'payout' || key === 'bonus' || key === 'depositAmount' || key === 'withdrawAmount') {
        return '$ ' + formatMoney(item, 2);
      } else if (key === 'commissionModel') {
        return t('affiliate.commissionModel.' + item);
      } else if (key === 'affiliateLevel') {
        return t('affiliate.level.' + item);
      } else {
        return item;
      }
    }
  }));
  exportData.push(...data);
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function changePage(page) {
  request.current = page
  loadAffiliateReport()
}

onMounted(async () => {
  await loadSites()
  request.siteId = siteList.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  await loadAffiliateReport()
})
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

.el-table--enabled-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

.el-input-number:deep .el-input__inner {
  text-align: left;
}
</style>
