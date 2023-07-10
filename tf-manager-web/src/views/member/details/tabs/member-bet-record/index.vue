<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.betTime"
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
          v-model="request.platform"
          size="small"
          :placeholder="t('fields.platform')"
          class="filter-item"
          style="margin-left: 5px; width: 200px;"
        >
          <el-option
            v-for="item in platform.list"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
        <el-select
          v-if="request.platform !== null"
          v-model="request.gameType"
          size="small"
          :placeholder="t('fields.gameType')"
          class="filter-item"
          style="margin-left: 5px; width: 200px;"
        >
          <el-option
            v-for="item in uiControl.gameType"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-if="request.gameType.length !== 0"
          multiple
          v-model="request.result"
          size="small"
          :placeholder="t('fields.result')"
          class="filter-item"
          style="margin-left: 5px; width: 250px;"
        >
          <el-option
            v-for="item in uiControl.result"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-if="request.gameType.length !== 0 && request.result.length !== 0"
          v-model="request.bet"
          style="margin-left: 5px; width: 200px;"
          size="small"
          maxlength="20"
          :placeholder="t('fields.betMoreThan')"
          @keypress="restrictInput($event)"
        />
        <el-button
          style="margin-left: 10px"
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="loadMemberBetRecords()"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-download"
          size="mini"
          type="primary"
          v-permission="['sys:member:detail']"
          @click="exportExcel"
        >{{ t('fields.exportToExcel') }}
        </el-button>
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.memberBetRecord') }}</span>
        </div>
      </template>
      <el-table :data="page.records" ref="table"
                row-key="id"
                size="small"
                highlight-current-row
                v-loading="page.loading"
                :empty-text="t('fields.noData')"
      >
        <el-table-column prop="betId" :label="t('fields.betId')" align="center" min-width="250" />
        <el-table-column prop="transactionId" :label="t('fields.transactionId')" align="center" min-width="250" />
        <el-table-column prop="platform" :label="t('fields.platform')" align="center" min-width="120" />
        <el-table-column prop="bet" :label="t('fields.bet')" align="center" min-width="100">
          <template #default="scope">
            $
            <span v-if="scope.row.bet === null">0</span>
            <span v-if="scope.row.bet !== null">{{ scope.row.bet.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payout" :label="t('fields.payout')" align="center" min-width="100">
          <template #default="scope">
            $
            <span v-if="scope.row.payout === null">0</span>
            <span v-if="scope.row.payout !== null">{{ scope.row.payout.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="beforeBalance" :label="t('fields.beforeBalance')" align="center" min-width="140">
          <template #default="scope">
            $
            <span v-if="scope.row.beforeBalance === null">0</span>
            <span v-if="scope.row.beforeBalance !== null">{{ scope.row.beforeBalance.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="afterBalance" :label="t('fields.afterBalance')" align="center" min-width="140">
          <template #default="scope">
            $
            <span v-if="scope.row.afterBalance === null">0</span>
            <span v-if="scope.row.afterBalance !== null">{{ scope.row.afterBalance.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="betStatus" :label="t('fields.betStatus')" align="center" min-width="140">
          <template #default="scope">
            <el-tag v-if="scope.row.betStatus === 'BET'" size="mini">{{ scope.row.betStatus }}</el-tag>
            <el-tag v-else-if="scope.row.betStatus === 'SETTLE' || scope.row.betStatus === 'BET_N_SETTLE'" size="mini" type="success">{{ scope.row.betStatus }}</el-tag>
            <el-tag v-else-if="scope.row.betStatus === 'PATCH'" size="mini" type="warning">{{ scope.row.betStatus }}</el-tag>
            <el-tag v-else size="mini" type="danger">{{ scope.row.betStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="gameType" :label="t('fields.gameType')" align="center" min-width="140" />
        <el-table-column prop="gameName" :label="t('fields.gameName')" align="center" min-width="140" />
        <el-table-column prop="betTime" :label="t('fields.betTime')" align="center" min-width="180">
          <template #default="scope">
            <span v-if="scope.row.betTime === null">-</span>
            <span
              v-if="scope.row.betTime !== null"
              v-formatter="{data: scope.row.betTime, formatter: 'YYYY/MM/DD HH:mm:ss', type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="settleTime" :label="t('fields.settleTime')" align="center" min-width="180">
          <template #default="scope">
            <span v-if="scope.row.settleTime === null">-</span>
            <span
              v-if="scope.row.settleTime !== null"
              v-formatter="{data: scope.row.settleTime, formatter: 'YYYY/MM/DD HH:mm:ss', type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="result" :label="t('fields.result')" align="center" min-width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.result === null" size="mini" type="info">-</el-tag>
            <el-tag v-else-if="scope.row.result === 'WIN'" size="mini" type="success">{{ scope.row.result }}</el-tag>
            <el-tag v-else-if="scope.row.result === 'LOSS'" size="mini" type="danger">{{ scope.row.result }}</el-tag>
            <el-tag v-else size="mini" type="warning">{{ scope.row.result }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sportBetResult" :label="t('fields.sportBetResult')" align="center" min-width="120">
          <template #default="scope">
            <el-tag
              v-if="scope.row.sportBetResult === null"
              size="mini"
              type="info"
            >
              -
            </el-tag>
            <el-tag
              v-else-if="scope.row.sportBetResult === 'WIN_HALF' || scope.row.sportBetResult === 'WIN_ALL'"
              size="mini"
              type="success"
            >
              {{ scope.row.sportBetResult }}
            </el-tag>
            <el-tag
              v-else-if="scope.row.sportBetResult === 'LOSS_HALF' || scope.row.sportBetResult === 'LOSS_ALL'"
              size="mini"
              type="danger"
            >
              {{ scope.row.sportBetResult }}
            </el-tag>
            <el-tag
              v-else
              size="mini"
              type="warning"
            >
              {{ scope.row.sportBetResult }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="table-footer">
        <span>{{ t('fields.totalBetRecords') }}</span>
        <span style="margin-left: 10px">{{ total.totalRecord }}</span>
        <span style="margin-left: 30px"> {{ t('fields.totalBet') }}</span>
        <span style="margin-left: 10px">$ </span>
        <span v-formatter="{data: total.totalBet, type: 'money'}" />
        <span style="margin-left: 30px"> {{ t('fields.totalPayout') }}</span>
        <span style="margin-left: 10px">$ </span>
        <span v-formatter="{data: total.totalPayout, type: 'money'}" />
      </div> -->
      <el-pagination
        class="pagination"
        :total="page.total"
        :page-sizes="[20, 50, 100, 150]"
        @current-change="changepage"
        layout="total,sizes,prev, pager, next"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @size-change="loadMemberBetRecords(true)"
      />
    </el-card>

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
  </div>
</template>

<script setup>
import { defineProps, onMounted, reactive, ref } from 'vue';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { getExport, getMemberBetRecords } from '../../../../../api/member-bet-record';
import { getMemberDetails } from '../../../../../api/member';
import { getPlatformsBySite } from '../../../../../api/platform';
import { useI18n } from "vue-i18n";
import { useRoute } from 'vue-router'

const { t } = useI18n();
const props = defineProps({
  mbrId: {
    type: String,
    required: true
  }
})

const route = useRoute()
const site = reactive({
  id: route.query.site
});

const uiControl = reactive({
  progressBarVisible: false,
  colors: [
    { color: '#f56c6c', percentage: 30 },
    { color: '#e6a23c', percentage: 70 },
    { color: '#5cb87a', percentage: 100 }
  ],
  gameType: [
    { key: 1, displayName: "SLOT", value: "SLOT" },
    { key: 2, displayName: "LIVE", value: "LIVE" },
    { key: 3, displayName: "FISH", value: "FISH" },
    { key: 4, displayName: "SPORT", value: "SPORT" },
    { key: 5, displayName: "ESPORT", value: "ESPORT" },
    { key: 6, displayName: "POKER", value: "POKER" },
    { key: 7, displayName: "LOTTERY", value: "LOTTERY" }
  ],
  result: [
    { key: 1, displayName: "WIN", value: "WIN" },
    { key: 2, displayName: "LOSS", value: "LOSS" },
    { key: 3, displayName: "DRAW", value: "DRAW" }
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
];

const exportPercentage = ref(0);

const EXPORT_HEADER = ['Bet ID', 'Transaction ID', 'Login Name', 'Platform', 'Bet', 'Payout', 'Before Balance', 'After Balance',
  'Bet Status', 'Game Type', 'Game Name', 'Bet Time', 'Settle Time', 'Result', 'Sport Bet Result'];

const memberDetail = ref(null);
const platform = reactive({
  list: null
});

const date = new Date();
const defaultStartDate = convertStartDate(date);
const defaultEndDate = convertDate(date);

const request = reactive({
  size: 20,
  current: 1,
  betTime: [defaultStartDate, defaultEndDate],
  platform: null,
  bet: null,
  gameType: [],
  result: ["WIN", "LOSS", "DRAW"]
});

// const total = reactive({
//   totalRecord: 0,
//   totalBet: 0,
//   totalPayout: 0
// });

function resetQuery() {
  request.betTime = [defaultStartDate, defaultEndDate];
  request.platform = null;
  request.result = ["WIN", "LOSS", "DRAW"];
  request.bet = null;
  request.gameType = null;
}

const page = reactive({
  pages: 0,
  records: [],
  pagingState: '',
  loading: false
});

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

function convertStartDate(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
}

function disabledDate(time) {
  return time.getTime() < moment(new Date()).subtract(2, 'months').startOf('month').format('x') || time.getTime() > new Date().getTime();
}

function checkQuery() {
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.betTime !== null) {
    if (request.betTime.length === 2) {
      query.betTime = request.betTime.join(",");
    }
  }
  if (request.result !== null) {
    if (request.result.length === 1) {
      query.result = request.result[0];
    } else {
      query.result = request.result.join(",");
    }
  }
  query.memberId = props.mbrId;
  return query;
}

async function loadMemberBetRecords(frombutton) {
  if (frombutton === true) {
    request.current = 1
    page.pagingState = null
  }
  page.loading = true;
  const query = checkQuery();
  query.pagingState = page.pagingState
  const { data: ret } = await getMemberBetRecords(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.pagingState = ret.pagingState;

  //   const { data: t } = await getMemberBetRecordsTotal(query);
  //   total.totalBet = t.totalBet;
  //   total.totalPayout = t.totalPayout;

  //   const { data: r } = await getMemberBetRecordsTotalRecord(query);
  //   total.totalRecord = r;

  page.loading = false;
}

function changepage(page) {
  if (request.current >= 1) {
    request.current = page;
    loadMemberBetRecords();
  }
}

async function loadPlatform() {
  const { data: ret } = await getPlatformsBySite(memberDetail.value.siteId);
  platform.list = ret;
}

function restrictInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (
    (charCode < 48 || charCode > 57) && charCode !== 46
  ) {
    event.preventDefault();
  }

  if (
    request.bet !== null &&
    request.bet.toString().indexOf('.') > -1
  ) {
    if (charCode === 46) {
      event.preventDefault();
    }
  }
}

async function exportExcel() {
  uiControl.progressBarVisible = true;
  const query = checkQuery();
  query.current = 1;
  const { data: ret } = await getExport(query);
  const exportData = [EXPORT_HEADER];
  const maxLength = [];

  pushRecordToData(ret.records, exportData);
  exportPercentage.value = Math.round(ret.current / (ret.pages + 1) * 100);
  query.current = ret.current;
  query.pagingState = ret.pagingState

  while (query.current < ret.pages) {
    query.current += 1;
    const { data: ret } = await getExport(query);
    query.pagingState = ret.pagingState
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
  wb.SheetNames.push('Member_Bet_Records');
  wb.Sheets.Member_Bet_Records = ws;
  XLSX.writeFile(wb, "member_bet_records.xlsx");
  exportPercentage.value = 100;
}

function pushRecordToData(records, exportData) {
  const data = records.map(record => Object.values(record).map(item => item !== 0 && (!item || item === '') ? '-' : item));
  exportData.push(...data);
}

onMounted(async() => {
  const { data: ret } = await getMemberDetails(props.mbrId, site.id);
  memberDetail.value = ret;
  await loadPlatform();
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
}

.search {
  display: flex;
  justify-content: flex-start;
}

.table-footer {
  margin-top: 15px;
  margin-right: 20px;
  float: right;
  font-size: small;
}

.btn-group {
  margin-top: 15px;
}
</style>
