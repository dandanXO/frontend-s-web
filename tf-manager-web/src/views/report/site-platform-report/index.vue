<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 350px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-select
          v-model="request.platform"
          size="small"
          :placeholder="t('fields.platform')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          filterable
        >
          <el-option
            v-for="item in platforms.list"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadRecord()"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          size="mini"
          type="primary"
          v-permission="['sys:report:sitePlatformBR:export']"
          @click="requestExportExcel"
          style="float: right;"
        >{{ t('fields.requestExportToExcel') }}
        </el-button>
      </div>
    </div>

    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
      style="margin-top:20px;"
      :row-style="{width: '100px'}"
      :row-class-name="setRowStyle"
    >
      <el-table-column prop="createTime" :label="t('fields.date')" />
      <el-table-column prop="platform" :label="t('fields.platform')" />
      <el-table-column prop="loginName" :label="t('fields.loginName')" />
      <el-table-column prop="betId" :label="t('fields.betId')" />
      <el-table-column prop="transactionId" :label="t('fields.transactionId')" />

      <el-table-column prop="bet" :label="t('fields.bet')">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.bet,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="validBet" :label="t('fields.validBet')">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.validBet,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>

      <el-table-column prop="payout" :label="t('fields.payout')">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.payout,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>

      <el-table-column prop="win" :label="t('fields.win')">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.win,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      :total="page.total"
      :page-sizes="[20, 50, 100, 150]"
      layout="sizes,prev,next"
      style="margin-top: 10px"
      v-model:page-size="request.size"
      v-model:page-count="page.pages"
      v-model:current-page="request.current"
      @current-change="changepage"
      @size-change="loadRecord"
    />
    <el-dialog :title="t('fields.exportToExcel')" v-model="uiControl.messageVisible" append-to-body width="500px"
               :close-on-click-modal="false" :close-on-press-escape="false"
    >
      <span>{{ t('message.requestExportToExcelDone1') }}</span>
      <router-link :to="`/site-management/download-manager`">
        <el-link type="primary">
          {{ t('menu.DownloadManager') }}
        </el-link>
      </router-link>
      <span>{{ t('message.requestExportToExcelDone2') }}</span>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import moment from 'moment'
import { getBetRecords, exportBetRecords } from '../../../api/site-platform-bet-record'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import {
  convertDateToEnd,
  convertDateToStart,
  getShortcuts,
} from '@/utils/datetime'
import { getPlatformsBySite } from '@/api/platform'

const { t } = useI18n()
const now = new Date()
const defaultStartDate = convertDateToStart(now)
const defaultEndDate = convertDateToEnd(now)
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)

const uiControl = reactive({
  messageVisible: false,
  orderBy: [
    { key: 1, displayName: t('fields.betTime'), value: "bet_time" },
    { key: 2, displayName: t('fields.bet'), value: "bet" },
    { key: 3, displayName: t('fields.payout'), value: "payout" }
  ],
  sortType: [
    { key: 1, displayName: t('sortType.DESC'), value: "DESC" },
    { key: 2, displayName: t('sortType.ASC'), value: "ASC" }
  ],
});

const siteList = reactive({
  list: [],
})

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
})

const platforms = reactive({
  list: [],
})

const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
  recordTime: [defaultStartDate, defaultEndDate],
  orderBy: null,
  sortType: null,
})

async function loadRecord() {
  page.loading = true
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
  const { data: ret } = await getBetRecords(query)
  page.records = ret.records;
  page.pages = ret.pages;
  page.total = ret.total;
  page.loading = false
}

function changepage(page) {
  if (request.current >= 1) {
    request.current = page
    loadRecord()
    handleDuplicateTransactionIds(request.current)
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function requestExportExcel() {
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
  query.requestBy = store.state.user.name;
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const { data: ret } = await exportBetRecords(query);
  if (ret) {
    uiControl.messageVisible = true;
  }
}

const shortcuts = getShortcuts(t)
function disabledDate(time) {
  return (
    time.getTime() <
      moment(new Date())
        .subtract(5, 'months')
        .startOf('month')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

async function loadSearchPlatforms() {
  if (request.siteId !== null) {
    const { data: ret } = await getPlatformsBySite(request.siteId)
    platforms.list = ret
  } else {
    platforms.list = []
  }
}

const allTransactionIds = reactive(new Map());
const pageTransactionIds = reactive(new Map());
const duplicateTransactionIds = reactive(new Map());
const colorMap = reactive({});
const stylesInserted = reactive(new Map());

function getRandomLightColor() {
  const letters = '89ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

function insertDynamicStyle(transactionId, color) {
  if (!stylesInserted.has(transactionId) && duplicateTransactionIds.has(transactionId)) {
    const style = document.createElement('style');
    style.innerHTML = `
      .row-${transactionId} {
        background-color: ${color} !important;
      }
    `;
    document.head.appendChild(style);
    stylesInserted.set(transactionId, style);
  }
}

function clearPreviousPageTransactionIds() {
  pageTransactionIds.forEach((transactionIds, page) => {
    transactionIds.forEach(id => {
      if (allTransactionIds.has(id)) {
        allTransactionIds.set(id, allTransactionIds.get(id) - 1);
        if (allTransactionIds.get(id) === 0) {
          allTransactionIds.delete(id);
        }
      }
    });
    pageTransactionIds.delete(page);
  });
}

function handleDuplicateTransactionIds(currentPage) {
  const transactionIds = page.records.map(record => record.transactionId);

  setTimeout(() => {
    clearPreviousPageTransactionIds();

    pageTransactionIds.set(currentPage, transactionIds);
    transactionIds.forEach(id => {
      allTransactionIds.set(id, (allTransactionIds.get(id) || 0) + 1);
    });

    transactionIds.forEach(id => {
      if (allTransactionIds.get(id) > 1) {
        if (!duplicateTransactionIds.has(id)) {
          duplicateTransactionIds.set(id, true);
          if (!colorMap[id]) {
            colorMap[id] = getRandomLightColor();
          }
          insertDynamicStyle(id, colorMap[id]);
        }
      } else {
        if (duplicateTransactionIds.has(id)) {
          duplicateTransactionIds.delete(id);
          if (stylesInserted.has(id)) {
            const styleSheet = stylesInserted.get(id);
            styleSheet.parentNode.removeChild(styleSheet);
            stylesInserted.delete(id);
          }
        }
      }
    });
  }, 500);
}

function setRowStyle({ row }) {
  return duplicateTransactionIds.has(row.transactionId) ? `row-${row.transactionId}` : '';
}

onMounted(async () => {
  await loadSites()
  request.siteId = siteList.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  await loadSearchPlatforms()
  request.platform = platforms.list[0].name
  await loadRecord()
  handleDuplicateTransactionIds(request.current)
})

watch(() => {
  handleDuplicateTransactionIds(request.current) // Update when the page data changes
})
</script>

<style>
.el-table .cell {
  word-break: break-word;
  text-overflow: unset;
}
.warning-row {
  color: #ff0000;
}
</style>
