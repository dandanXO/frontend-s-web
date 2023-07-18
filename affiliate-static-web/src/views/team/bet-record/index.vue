<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('fields.memberBetRecords') }}</span>
        </div>
      </template>
      <div class="inputs-wrap">
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
        <el-input v-model="request.loginName" size="small" class="input-small" :placeholder="t('fields.loginName')" />
        <el-select
          v-model="request.platform"
          size="small"
          :placeholder="t('fields.platform')"
          class="filter-item"
          style="margin-left: 5px; width: 200px;"
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
        <el-select
          v-model="request.gameType"
          size="small"
          :placeholder="t('fields.gameType')"
          class="filter-item"
          style="margin-left: 5px; width: 200px;"
        >
          <el-option
            v-for="item in list.gameType"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-select
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
        <div class="btn-grp">
          <el-button icon="el-icon-search" type="primary" @click="loadBetRecords()" size="mini">
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
        <el-table-column prop="loginName" :label="t('fields.loginName')" align="center" min-width="100" />
        <el-table-column prop="betTime" :label="t('fields.betTime')" align="center" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.betTime === null">-</span>
            <span
              v-if="scope.row.betTime !== null"
              v-formatter="{data: scope.row.betTime, formatter: 'YYYY/MM/DD HH:mm:ss', type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="settleTime" :label="t('fields.settleTime')" align="center" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.settleTime === null">-</span>
            <span
              v-if="scope.row.settleTime !== null"
              v-formatter="{data: scope.row.settleTime, formatter: 'YYYY/MM/DD HH:mm:ss', type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="platform" :label="t('fields.platform')" align="center" min-width="100">
          <template #default="scope">
            <span v-if="scope.row.platform === null">-</span>
            <span v-if="scope.row.platform !== null">{{ scope.row.platform }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="gameName" :label="t('fields.gameName')" align="center" min-width="100">
          <template #default="scope">
            <span v-if="scope.row.gameName === null">-</span>
            <span v-if="scope.row.gameName !== null">{{ scope.row.gameName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="transactionId" :label="t('fields.transactionId')" align="center" min-width="350">
          <template #default="scope">
            <span v-if="scope.row.transactionId === null">-</span>
            <span v-if="scope.row.transactionId !== null">{{ scope.row.transactionId }}</span>
          </template>
        </el-table-column>
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
        <el-table-column prop="win" :label="t('fields.winLoss')" align="center" min-width="100">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.win,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="result" :label="t('fields.result')" align="center" min-width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.result === 'WIN'" type="success" size="mini">{{ scope.row.result }}</el-tag>
            <el-tag v-else-if="scope.row.result === 'LOSS'" type="danger" size="mini">{{ scope.row.result }}</el-tag>
            <el-tag v-else-if="scope.row.result === 'DRAW'" type="warning" size="mini">{{ scope.row.result }}</el-tag>
            <el-tag v-else type="info" size="mini">-</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.operate')" fixed="right" align="center" width="150">
          <template #default="scope">
            <el-button icon="el-icon-edit" size="mini" type="success" @click="viewDetails(scope.row)">{{ t('fields.viewDetails') }}</el-button>
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
    <el-dialog
      :title="t('fields.betRecordDetails')"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="800px"
    >
      <el-form :model="details" label-width="200px" label-suffix=":" size="small" :inline="true">
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
              <span>{{ details.gameType }}</span>
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
          <el-form-item :label="t('fields.result')" prop="result">
            <el-tag v-if="details.result === 'WIN'" type="success" size="mini">{{ details.result }}</el-tag>
            <el-tag v-else-if="details.result === 'LOSS'" type="danger" size="mini">{{ details.result }}</el-tag>
            <el-tag v-else-if="details.result === 'DRAW'" type="warning" size="mini">{{ details.result }}</el-tag>
            <el-tag v-else type="info" size="mini">-</el-tag>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.settleTime')" prop="settleTime">
            <span v-formatter="{data: details.settleTime, formatter: 'YYYY/MM/DD HH:mm:ss', type: 'date'}" />
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useStore } from "@/store";
import moment from 'moment';
import { getMemberBetRecords, getPlatformsBySite, getVipName } from '../../../api/affiliate-bet-record';
import { useI18n } from "vue-i18n";

const store = useStore();
const { t } = useI18n();
const betRecords = ref([]);
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
  result: null,
  settleTime: null
})

const uiControl = reactive({
  dialogVisible: false,
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
  result: ["WIN", "LOSS", "DRAW"]
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
  request.betTime = [convertStartDate(new Date()), convertDate(new Date())];
  request.loginName = null;
  request.platform = null;
  request.gameType = null;
  request.result = ["WIN", "LOSS", "DRAW"];
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
  if (request.result !== null) {
    if (request.result.length === 1) {
      query.result = request.result[0];
    } else {
      query.result = request.result.join(",");
    }
  }
  query.siteId = store.state.user.siteId;
  const { data: ret } = await getMemberBetRecords(store.state.user.id, query);
  page.pages = Math.ceil(ret.length / request.size);
  betRecords.value = ret;
  getRecords(request.current)
  page.loading = false;
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page;
    getRecords(request.current)
  }
}

function getRecords(currentPage) {
  page.records = [];
  if (betRecords.value.length > 0) {
    const firstRecordIndex = currentPage === 1 ? 0 : request.size * (currentPage - 1);
    const lastRecordIndex = betRecords.value.length - 1 > (request.size * currentPage) - 1 ? (request.size * currentPage) - 1 : betRecords.value.length - 1;
    for (let i = firstRecordIndex; i <= lastRecordIndex; i++) {
      page.records.push(betRecords.value[i]);
    }
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
  details.result = betRecord.result;
  details.settleTime = betRecord.settleTime;
  getVip(betRecord.id)
}

async function getVip(memberId) {
  const { data: vip } = await getVipName(memberId, store.state.user.siteId);
  details.vipName = vip;
}

onMounted(() => {
  loadPlatform();
  loadBetRecords();
  populateGameType();
});
</script>

<style rel="stylesheet/scss" lang="scss">
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
