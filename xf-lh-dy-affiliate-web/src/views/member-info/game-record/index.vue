<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('fields.memberBetRecords') }}</span>
        </div>
      </template>
      <div class="inputs-wrap">
        <el-row :gutter="10">
          <el-col :xl="6" :lg="10" :md="12">
            <el-date-picker
              v-model="request.betTime"
              format="DD/MM/YYYY HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              size="normal"
              type="datetimerange"
              range-separator=":"
              :start-placeholder="t('fields.startDate')"
              :end-placeholder="t('fields.endDate')"
              :shortcuts="shortcuts"
              :disabled-date="disabledDate"
              :editable="false"
              :clearable="false"
              :default-time="defaultTime"
              style="width: 100%;"
            />
          </el-col>
          <el-col :xl="3" :lg="6" :md="12">
            <el-input v-model="request.loginName" size="normal" class="input-small" :placeholder="t('fields.loginName')" />
          </el-col>
          <el-col :xl="3" :lg="6" :md="12">
            <el-select
              v-model="request.platform"
              size="normal"
              :placeholder="t('fields.platform')"
              class="filter-item"
              style="width: 100%"
              @focus="loadPlatform"
              @change="populateGameType"
            >
              <el-option
                v-for="item in list.platform"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-col>
          <el-col :xl="3" :lg="6" :md="12">
            <el-select
              v-model="request.gameType"
              size="normal"
              :placeholder="t('fields.gameType')"
              class="filter-item"
              style="width: 100%"
            >
              <el-option
                v-for="item in list.gameType"
                :key="item.key"
                :label="item.displayName"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :xl="6" :lg="10" :md="12">
            <el-select
              multiple
              v-model="request.status"
              size="normal"
              :placeholder="t('fields.status')"
              class="filter-item"
              style="width: 100%;"
            >
              <el-option
                v-for="item in uiControl.status"
                :key="item.key"
                :label="item.displayName"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :xl="3" :lg="8" :md="12">
            <div class="btn-grp">
              <el-button icon="el-icon-search" type="primary" @click="loadBetRecords()" size="normal">
                {{ $t('fields.search') }}
              </el-button>
              <el-button size="normal" type="primary" plain @click="resetQuery()">
                {{ $t('fields.reset') }}
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <table cellpadding="0" cellspacing="0" border="0" class="custom-table" style="width: 98%; margin: 15px auto;">
        <thead>
          <tr>
            <th scope="col">{{ t('fields.loginName') }}</th>
            <th scope="col">{{ t('fields.betTime') }}</th>
            <th scope="col">{{ t('fields.settleTime') }}</th>
            <th scope="col">{{ t('fields.platform') }}</th>
            <th scope="col">{{ t('fields.gameName') }}</th>
            <th scope="col">{{ t('fields.transactionId') }}</th>
            <th scope="col">{{ t('fields.bet') }}</th>
            <th scope="col">{{ t('fields.payout') }}</th>
            <th scope="col">{{ t('fields.companyProfit') }}</th>
            <th scope="col">{{ t('fields.status') }}</th>
            <th scope="col">{{ t('fields.operate') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in page.records" :key="item.id">
            <td :data-label="t('fields.loginName')">{{ item.loginName }}</td>
            <td :data-label="t('fields.betTime')">
              <span v-if="item.betTime === null">-</span>
              <span v-if="item.betTime !== null">{{ item.betTime }}</span>
            </td>
            <td :data-label="t('fields.settleTime')">
              <span v-if="item.settleTime === null || item.betStatus === 'UNSETTLED'">-</span>
              <span v-if="item.settleTime !== null && item.betStatus !== 'UNSETTLED'">{{ item.settleTime }}</span>
            </td>
            <td :data-label="t('fields.platform')">
              <span v-if="item.platform === null">-</span>
              <span v-if="item.platform !== null">{{ item.platform }}</span>
            </td>
            <td :data-label="t('fields.gameName')">
              <span v-if="item.gameName === null">-</span>
              <span v-if="item.gameName !== null">{{ item.gameName }}</span>
            </td>
            <td :data-label="t('fields.transactionId')">
              <span v-if="item.transactionId === null">-</span>
              <span v-if="item.transactionId !== null">{{ item.transactionId }}</span>
            </td>
            <td :data-label="t('fields.bet')">$ {{ item.bet }}</td>
            <td :data-label="t('fields.payout')">$ {{ item.payout }}</td>
            <td :data-label="t('fields.companyProfit')">$ {{ item.companyProfit }}</td>
            <td :data-label="t('fields.status')">
              <el-tag v-if="item.betStatus === 'SETTLED'" type="success" size="normal">{{ t('betStatus.' + item.betStatus) }}</el-tag>
              <el-tag v-else-if="item.betStatus === 'CANCEL'" type="danger" size="normal">{{ t('betStatus.' + item.betStatus) }}</el-tag>
              <el-tag v-else-if="item.betStatus === 'UNSETTLED'" type="warning" size="normal">{{ t('betStatus.' + item.betStatus) }}</el-tag>
              <el-tag v-else type="info" size="normal">-</el-tag>
            </td>
            <td :data-label="t('fields.operate')">
              <el-link type="primary" :underline="false" @click="viewDetails(item)">{{ t('fields.viewDetails') }}</el-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="page.records.length === 0">
        <emptyComp />
      </div>
      <div class="table-footer">
        <span style="margin-right:20px;">{{ t('fields.totalBet') }}: $ <span v-formatter="{data: page.totalBet,type: 'money'}" /></span>
        <span style="margin-right:20px;">{{ t('fields.totalPayout') }}: $ <span v-formatter="{data: page.totalPayout,type: 'money'}" /></span>
        <span style="margin-right:20px;">{{ t('fields.totalCompanyProfit') }}: $ <span v-formatter="{data: page.totalCompanyProfit,type: 'money'}" /></span>
      </div>
      <el-pagination
        class="pagination"
        @current-change="changePage"
        layout="total, prev, pager, next"
        style="margin: 5px;"
        :total="page.total"
        :page-size="request.size"
        :page-count="page.pages"
        :current-page="request.current"
      />
    </el-card>
    <el-dialog
      :title="t('fields.betRecordDetails')"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="800px"
    >
      <el-form :model="details" label-width="200px" label-suffix=":" size="normal" :inline="true">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="t('fields.account')" prop="loginName">
              <span>{{ details.loginName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('fields.vipLevel')" prop="vipName">
              <span>{{ details.vipName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.transactionId')" prop="transactionId">
            <span>{{ details.transactionId }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.betTime')" prop="betTime">
            <span v-formatter="{data: details.betTime, formatter: 'YYYY/MM/DD HH:mm:ss', type: 'date'}" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="t('fields.platform')" prop="platform">
              <span>{{ details.platform }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('fields.gameType')" prop="gameType">
              <span>{{ t('gameType.' + details.gameType) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.gameName')" prop="gameName">
            <span>{{ details.gameName }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="t('fields.bet')" prop="bet">
              $ <span v-formatter="{data: details.bet,type: 'money'}" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('fields.payout')" prop="payout">
              $ <span v-formatter="{data: details.payout,type: 'money'}" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="t('fields.companyProfit')" prop="companyProfit">
              $ <span v-formatter="{data: details.companyProfit,type: 'money'}" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('fields.status')" prop="betStatus">
              <el-tag v-if="details.betStatus === 'SETTLED'" type="success" size="normal">{{ t('betStatus.' + details.betStatus) }}</el-tag>
              <el-tag v-else-if="details.betStatus === 'CANCEL'" type="danger" size="normal">{{ t('betStatus.' + details.betStatus) }}</el-tag>
              <el-tag v-else-if="details.betStatus === 'UNSETTLED'" type="warning" size="normal">{{ t('betStatus.' + details.betStatus) }}</el-tag>
              <el-tag v-else type="info" size="normal">-</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.settleTime')" prop="settleTime">
            <span v-if="details.settleTime === null || details.betStatus === 'UNSETTLED'">-</span>
            <span
              v-if="details.settleTime !== null && details.betStatus !== 'UNSETTLED'"
              v-formatter="{data: details.settleTime, formatter: 'YYYY/MM/DD HH:mm:ss', type: 'date'}"
            />
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { useStore } from "@/store";
import moment from 'moment';
import { getMemberBetRecords, getPlatformsBySite, getVipName, getTotal } from '../../../api/affiliate-bet-record';
import { useI18n } from "vue-i18n";
import { useRoute } from 'vue-router'
import emptyComp from "@/components/empty"

const store = useStore();
const { t } = useI18n();
const route = useRoute();
const list = reactive({
  platform: [],
  gameType: []
});
const details = reactive({
  loginName: null,
  vipName: null,
  transactionId: null,
  betTime: null,
  platform: null,
  gameType: null,
  gameName: null,
  bet: 0,
  payout: 0,
  companyProfit: 0,
  betStatus: null,
  settleTime: null
})

const uiControl = reactive({
  dialogVisible: false,
  gameType: [
    { key: 1, displayName: t('gameType.SLOT'), value: "SLOT" },
    { key: 2, displayName: t('gameType.LIVE'), value: "LIVE" },
    { key: 3, displayName: t('gameType.FISH'), value: "FISH" },
    { key: 4, displayName: t('gameType.SPORT'), value: "SPORT" },
    { key: 5, displayName: t('gameType.ESPORT'), value: "ESPORT" },
    { key: 6, displayName: t('gameType.POKER'), value: "POKER" },
    { key: 7, displayName: t('gameType.LOTTERY'), value: "LOTTERY" }
  ],
  status: [
    { key: 1, displayName: t('betStatus.UNSETTLED'), value: "UNSETTLED" },
    { key: 2, displayName: t('betStatus.SETTLED'), value: "SETTLED" },
    { key: 3, displayName: t('betStatus.CANCEL'), value: "CANCEL" }
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
  betTime: [convertStartDate(new Date()), convertDate(new Date())],
  loginName: null,
  platform: null,
  gameType: [],
  status: ["UNSETTLED", "SETTLED", "CANCEL"]
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  total: 0,
  totalBet: 0,
  totalPayout: 0,
  totalCompanyProfit: 0
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
  request.betTime = [convertStartDate(new Date()), convertDate(new Date())];
  request.loginName = null;
  request.platform = null;
  request.gameType = null;
  request.status = ["UNSETTLED", "SETTLED", "CANCEL"];
  populateGameType();
}

async function loadPlatform() {
  const { data: ret } = await getPlatformsBySite(store.state.user.siteId);
  if (request.gameType) {
    console.log(request.gameType)
    list.platform = ret.filter(p => p.gameType.includes(request.gameType));
  } else {
    list.platform = ret;
  }
}

function populateGameType() {
  if (request.platform) {
    list.gameType = uiControl.gameType.filter(g => {
      const platform = list.platform.filter(p => p.code === request.platform)[0]
      return platform.gameType.includes(g.value);
    })
  } else {
    list.gameType = uiControl.gameType;
  }
}

async function loadBetRecords() {
  page.loading = true;
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
  if (request.status !== null) {
    if (request.status.length === 1) {
      query.status = request.status[0];
    } else {
      query.status = request.status.join(",");
    }
  }
  query.siteId = store.state.user.siteId;
  const { data: ret } = await getMemberBetRecords(store.state.user.id, query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  const { data: total } = await getTotal(store.state.user.id, query);
  page.totalBet = total.totalBet;
  page.totalPayout = total.totalPayout;
  page.totalCompanyProfit = total.totalCompanyProfit;
  page.loading = false;
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page;
    loadBetRecords()
  }
}

function viewDetails(betRecord) {
  uiControl.dialogVisible = true;
  details.loginName = betRecord.loginName;
  details.transactionId = betRecord.transactionId;
  details.betTime = betRecord.betTime;
  details.platform = betRecord.platform;
  details.gameType = betRecord.gameType;
  details.gameName = betRecord.gameName;
  details.bet = betRecord.bet;
  details.payout = betRecord.payout;
  details.companyProfit = betRecord.companyProfit;
  details.betStatus = betRecord.betStatus;
  details.settleTime = betRecord.settleTime;
  getVip(betRecord.memberId)
}

async function getVip(memberId) {
  const { data: vip } = await getVipName(memberId, store.state.user.siteId);
  details.vipName = vip;
}

onMounted(() => {
  if (route.query.user) {
    request.loginName = route.query.user
  }
  loadPlatform();
  loadBetRecords();
  populateGameType();
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
    // max-width: 200px;
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
  float: right;
  font-size: small;
  margin: 15px;
  display:flex;
  flex-wrap: wrap;
  gap: 10px;
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
<style>
.el-col {
  margin-bottom: 10px;
}
</style>
