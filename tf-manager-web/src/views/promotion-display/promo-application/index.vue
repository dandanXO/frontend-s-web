<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          style="width: 120px"
          @focus="loadSites"
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
          style="margin-left: 5px; width: 380px"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-input
          v-model="request.loginName"
          style="margin-left: 5px; width: 200px;"
          size="small"
          :placeholder="t('fields.loginName')"
        />
        <el-input
          v-model="request.promoCode"
          style="margin-left: 5px; width: 200px;"
          size="small"
          :placeholder="t('fields.promoCode')"
        />
        <el-input
          v-model="request.promoTitle"
          style="margin-left: 5px; width: 200px;"
          size="small"
          :placeholder="t('fields.title')"
        />
        <el-button
          style="margin-left: 10px"
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="loadPromoApplications()"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
        <div class="btn-group">
          <el-button
            icon="el-icon-download"
            size="mini"
            type="success"
            v-permission="['sys:promo-application:export']"
            @click="exportExcel"
          >{{ t('fields.exportToExcel') }}
          </el-button>
        </div>
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.promoApplication') }}</span>
        </div>
      </template>
      <el-table :data="page.records" ref="table"
                row-key="id"
                size="small"
                highlight-current-row
                v-loading="page.loading"
                :empty-text="t('fields.noData')"
                sortable
      >
        <el-table-column prop="loginName" :label="t('fields.loginName')" align="center" min-width="150">
          <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
            <router-link :to="`/member/details/${scope.row.memberId}?site=${request.siteId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="siteName" :label="t('fields.site')" align="center" min-width="120" />
        <el-table-column prop="promoCode" :label="t('fields.promoCode')" align="center" min-width="150" />
        <el-table-column prop="promoTitle" :label="t('fields.title')" align="center" min-width="180" />
        <el-table-column prop="recordTime" :label="t('fields.recordTime')" align="center" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.recordTime === null">-</span>
            <span
              v-if="scope.row.recordTime !== null"
              v-formatter="{data: scope.row.recordTime, formatter: 'YYYY-MM-DD', type: 'date'}"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        :total="page.total"
        :page-sizes="[20, 50, 100, 150, 200]"
        @current-change="changepage"
        layout="total,sizes,prev, pager, next"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @size-change="loadPromoApplications()"
      />
    </el-card>
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
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { hasPermission } from '../../../utils/util'
import * as XLSX from 'xlsx';
import moment from 'moment';
import { useI18n } from "vue-i18n";
import { getSiteListSimple } from '../../../api/site';
import { useStore } from '../../../store';
import { TENANT } from '../../../store/modules/user/action-types';
import { getPromoApplication } from '../../../api/promo-application';

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteList = reactive({
  list: []
});
const exportPercentage = ref(0);
const uiControl = reactive({
  dialogTitle: "",
  dialogType: "",
  dialogVisible: false,
  dialogWidth: '580px',
  progressBarVisible: false
});

const EXPORT_HEADER = [t('fields.loginName'), t('fields.site'), t('fields.promoCode'), t('fields.title'), t('fields.recordTime')];

const defaultDate = convertDate(new Date());

const request = reactive({
  size: 20,
  current: 1,
  recordTime: [defaultDate, defaultDate],
  siteId: null,
  loginName: null,
  promoCode: null,
  promoTitle: null
});

function resetQuery() {
  request.recordTime = [defaultDate, defaultDate];
  request.siteId = siteList.list[0].id;
  request.loginName = null;
  request.promoCode = null;
  request.promoTitle = null;
}

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  total: 0
});

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

function disabledDate(time) {
  return time.getTime() < moment(new Date()).subtract(2, 'months').startOf('month').format('x') || time.getTime() > new Date().getTime();
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
  request.siteId = siteList.list[0].id;
};

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

async function loadPromoApplications() {
  page.loading = true;
  const query = checkQuery();
  const { data: ret } = await getPromoApplication(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
}

function changepage(page) {
  request.current = page;
  loadPromoApplications();
}

async function exportExcel() {
  uiControl.progressBarVisible = true;
  const query = checkQuery();
  query.current = 1;
  const { data: ret } = await getPromoApplication(query);
  const exportData = [EXPORT_HEADER];
  const maxLength = [];

  pushRecordToData(ret.records, exportData);
  exportPercentage.value = Math.round(ret.current / (ret.pages + 1) * 100);
  query.current = ret.current;

  while (query.current < ret.pages) {
    query.current += 1;
    const { data: ret } = await getPromoApplication(query);
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
  wb.SheetNames.push('Promo_Application');
  wb.Sheets.Promo_Application = ws;
  XLSX.writeFile(wb, "promo_application.xlsx");
  exportPercentage.value = 100;
}

function pushRecordToData(records, exportData) {
  records.forEach(item => {
    delete item.id;
    delete item.memberId;
    delete item.siteId;
  })
  const data = records.map(record => {
    return Object.values(record).map(item => !item || item === '' ? '-' : item)
  });
  exportData.push(...data);
}

onMounted(async() => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
}

.search {
  float: left;
  width: 100%;
  display: block;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
