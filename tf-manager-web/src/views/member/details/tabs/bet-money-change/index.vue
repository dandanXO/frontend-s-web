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
        <!-- <el-select
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
        /> -->
        <el-button
          style="margin-left: 10px"
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="loadMemberBetMoneyChange()"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
      <div class="btn-group">
        <el-button
          size="mini"
          type="primary"
          v-permission="['sys:member:detail']"
          @click="requestExportExcel"
        >{{ t('fields.requestExportToExcel') }}
        </el-button>
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.betMoneyChange') }}</span>
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
            $ <span v-formatter="{data: scope.row.bet,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="payout" :label="t('fields.payout')" align="center" min-width="100">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.payout,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="beforeBalance" :label="t('fields.beforeBalance')" align="center" min-width="140">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.beforeBalance,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="afterBalance" :label="t('fields.afterBalance')" align="center" min-width="140">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.afterBalance,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="result" :label="t('fields.result')" align="center" min-width="140">
          <template #default="scope">
            <el-tag v-if="scope.row.result === 'WIN'" size="mini" type="success">{{ scope.row.result }}</el-tag>
            <el-tag v-else-if="scope.row.result === 'LOSS'" size="mini" type="danger">{{ scope.row.result }}</el-tag>
            <el-tag v-else size="mini" type="warning">{{ scope.row.result }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="betStatus" :label="t('fields.betStatus')" align="center" min-width="140">
          <template #default="scope">
            <el-tag v-if="scope.row.betStatus === 'SETTLE'" size="mini" type="success">{{ scope.row.betStatus }}</el-tag>
            <el-tag v-else-if="scope.row.betStatus === 'BET'" size="mini" type="secondary">{{ scope.row.betStatus }}</el-tag>
            <el-tag v-else-if="scope.row.betStatus === 'CANCEL'" size="mini" type="danger">{{ scope.row.betStatus }}</el-tag>
            <el-tag v-else size="mini" type="warning">{{ scope.row.betStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="gameType" :label="t('fields.gameType')" align="center" min-width="140">
          <template #default="scope">
            {{ t('gameType.' + scope.row.gameType) }}
          </template>
        </el-table-column>
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
            <span v-if="scope.row.settleTime === null || scope.row.betStatus === 'UNSETTLED'">-</span>
            <span
              v-if="scope.row.settleTime !== null && scope.row.betStatus !== 'UNSETTLED'"
              v-formatter="{data: scope.row.settleTime, formatter: 'YYYY/MM/DD HH:mm:ss', type: 'date'}"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        :total="page.total"
        :page-sizes="[20, 50, 100, 150, 200]"
        @current-change="changepage"
        layout="sizes,prev, next"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @size-change="loadMemberBetMoneyChange(true)"
      />
    </el-card>

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
import { defineProps, onMounted, reactive, ref } from 'vue';
import moment from 'moment';
import {
  getBetMoneyChange,
  requestBetMoneyChangeExport
} from '../../../../../api/member-bet-record';
import { getMemberDetails } from '../../../../../api/member';
import { getPlatformsBySite } from '../../../../../api/platform';
import { useI18n } from "vue-i18n";
import { useRoute } from 'vue-router'
import { getShortcuts } from "@/utils/datetime";
import { useStore } from "@/store";

const store = useStore()
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
  messageVisible: false,
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
    { key: 7, displayName: "LOTTERY", value: "LOTTERY" },
    { key: 8, displayName: "CASUAL", value: "CASUAL" },
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
const shortcuts = getShortcuts(t);
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
  // platform: null,
  // bet: null,
  // gameType: [],
  // result: ["WIN", "LOSS", "DRAW"]
});

// const total = reactive({
//   totalRecord: 0,
//   totalBet: 0,
//   totalPayout: 0
// });

function resetQuery() {
  request.betTime = [defaultStartDate, defaultEndDate];
  // request.platform = null;
  // request.result = ["WIN", "LOSS", "DRAW"];
  // request.bet = null;
  // request.gameType = [];
}

const page = reactive({
  pages: 0,
  records: [],
  pagingState: '',
  loading: false
});

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD') + ' 23:59:59';
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
  // if (request.result !== null) {
  //   if (request.result.length === 1) {
  //     query.result = request.result[0];
  //   } else {
  //     query.result = request.result.join(",");
  //   }
  // }
  query.memberId = props.mbrId;
  query.siteId = site.id;
  return query;
}

async function loadMemberBetMoneyChange(frombutton) {
  if (frombutton === true) {
    request.current = 1
    page.pagingState = null
  }
  page.loading = true;
  const query = checkQuery();
  query.pagingState = page.pagingState
  const { data: ret } = await getBetMoneyChange(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.pagingState = ret.pagingState;

  page.loading = false;
}

function changepage(page) {
  if (request.current >= 1) {
    request.current = page;
    loadMemberBetMoneyChange();
  }
}

async function loadPlatform() {
  const { data: ret } = await getPlatformsBySite(memberDetail.value.siteId);
  platform.list = ret;
}

// function restrictInput(event) {
//   var charCode = event.which ? event.which : event.keyCode
//   if (
//     (charCode < 48 || charCode > 57) && charCode !== 46
//   ) {
//     event.preventDefault();
//   }

//   if (
//     request.bet !== null &&
//     request.bet.toString().indexOf('.') > -1
//   ) {
//     if (charCode === 46) {
//       event.preventDefault();
//     }
//   }
// }

async function requestExportExcel() {
  const query = checkQuery();
  query.requestBy = store.state.user.name;
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const { data: ret } = await requestBetMoneyChangeExport(query);
  if (ret) {
    uiControl.messageVisible = true;
  }
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
