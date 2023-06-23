<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.loginName')"
        />
        <el-date-picker
          v-model="request.queryTime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px;margin-left: 5px"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />
        <el-select
          clearable
          v-model="request.cardType"
          size="small"
          :placeholder="t('fields.tigerCardType')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.cardTypes"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.operationType"
          size="small"
          :placeholder="t('fields.tigerCardOpeType')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.opeTypes"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadPage"
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
        <el-button icon="el-icon-setting" size="mini" type="primary" @click="uiControl.settingVisible = true">
          修改配置
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
    >
      <el-table-column prop="loginName" :label="t('fields.loginName')" width="200" />
      <el-table-column prop="cardType" :label="t('fields.tigerCardType')" width="150">
        <template #default="scope">
          <span v-for="b in uiControl.cardTypes" :key="b.key">
            <span v-if="scope.row.cardType === b.value">
              {{ b.displayName }}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="opType" :label="t('fields.tigerCardOpeType')" width="150">
        <template #default="scope">
          <span v-for="b in uiControl.opeTypes" :key="b.key">
            <span v-if="scope.row.opType === b.value">
              {{ b.displayName }}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="comeFrom" :label="t('fields.tigerCardSource')" width="160" />
      <el-table-column prop="beforeNum" :label="t('fields.tigerCardBeforeCount')" width="120" />
      <el-table-column prop="opTime" :label="t('fields.operateTime')" width="200" />
      <el-table-column prop="cardDesc" :label="t('fields.description')" width="300" />
    </el-table>
    <el-pagination
      class="pagination"
      @current-change="changePage"
      layout="prev, pager, next"
      :page-size="request.size"
      :page-count="page.pages"
      :current-page="request.current"
    />
    <el-table
      :data="tigerSetting.setting"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      v-loading="tigerSetting.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="realCount" :label="t('fields.tigerCardRealCount')" width="150" />
      <el-table-column prop="virtualCount" :label="t('fields.tigerCardVirtualCount')" width="150" />
      <el-table-column prop="sumAward" :label="t('fields.totalBonus')" width="200" />
      <el-table-column prop="lotteryStartTime" :label="t('fields.startTime')" width="200" />
      <el-table-column prop="lotteryEndTime" :label="t('fields.endTime')" width="200" />
      <el-table-column prop="period" :label="t('fields.tigerCardPeriod')" width="160" />
      <el-table-column prop="lotteryTime" :label="t('fields.tigerCardTime')" width="200" />
      <el-table-column prop="bonusTime" :label="t('fields.tigerCardBonusTime')" width="200" />
    </el-table>

    <el-dialog
      title="修改配置"
      v-model="uiControl.settingVisible"
      append-to-body
      width="700px"
    >
      <el-form
        ref="tigerCardSettingForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-row>
          <el-col>
            <el-form-item :label="t('fields.startTime')" prop="lotteryTime">
              <el-date-picker
                type="datetime"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                v-model="form.lotteryTime"
                :disabled-date="disabledStartDate"
              />
            </el-form-item>
            <el-form-item :label="t('fields.endTime')" prop="deadline">
              <el-date-picker
                type="datetime"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                v-model="form.deadline"
                :disabled-date="disabledEndDate"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="t('fields.tigerCardPeriod')" prop="periodStr">
          <el-input v-model="form.periodStr" style="width: 450px" maxlength="30" />
        </el-form-item>
        <el-form-item :label="t('fields.tigerCardTime')" prop="lotteryStr">
          <el-input v-model="form.lotteryStr" style="width: 450px" maxlength="30" />
        </el-form-item>
        <el-form-item :label="t('fields.tigerCardBonusTime')" prop="openStr">
          <el-input v-model="form.openStr" style="width: 450px" maxlength="30" />
        </el-form-item>
        <el-form-item :label="t('fields.amount')" prop="sumAward">
          <el-input v-model="form.sumAward" style="width: 450px" maxlength="30" />
        </el-form-item>
        <el-form-item :label="t('fields.count')" prop="cardCount">
          <el-input v-model="form.cardCount" style="width: 450px" maxlength="30" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.settingVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="updateSetting">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import { required } from '../../../utils/validate'
import { ElMessage } from 'element-plus'
import {
  updateTigerCardSetting,
  getTigerCardList, getTigerCardSetting,
} from '../../../api/tiger-card'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const tigerCardSettingForm = ref(null)
const siteList = reactive({
  list: [],
})
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
      start.setTime(moment(start).startOf('week').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.lastWeek'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(1, 'weeks').startOf('week').format('x'));
      end.setTime(moment(end).subtract(1, 'weeks').endOf('week').format('x'));
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

const uiControl = reactive({
  settingVisible: false,
  cardTypes: [
    { key: 1, displayName: '大奖虎', value: 'goldhu' },
    { key: 2, displayName: '鸿运虎', value: 'hongyunhu' },
    { key: 3, displayName: '吉利虎', value: 'jilihu' },
    { key: 4, displayName: '平安虎', value: 'pinganhu' },
    { key: 5, displayName: '如意虎', value: 'ruyihu' },
    { key: 6, displayName: '幸运虎', value: 'xinyunhu' },
  ],
  opeTypes: [
    { key: 1, displayName: '抽卡', value: 1 },
    { key: 2, displayName: '送卡', value: 2 },
    { key: 3, displayName: '合卡', value: 3 },
    { key: 4, displayName: '收卡', value: 4 },
  ],
})
const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})
const tigerSetting = reactive({
  setting: [],
  loading: false,
});

const date = new Date();
const defaultStartDate = convertStartDate(date);
const defaultEndDate = convertDate(date);

const request = reactive({
  size: 30,
  current: 1,
  loginName: null,
  queryTime: [defaultStartDate, defaultEndDate],
  cardType: null,
  operationType: null,
  siteId: null,
})

const form = reactive({
  id: null,
  lotteryTime: null,
  deadline: null,
  periodStr: null,
  lotteryStr: null,
  openStr: null,
  sumAward: null,
  cardCount: null
})

const formRules = reactive({
  lotteryTime: [required(t('message.validateStartTimeRequired'))],
  deadline: [required(t('message.validateEndTimeRequired'))],
  periodStr: [required(t('message.validateTigerCardPeriodRequired'))],
  lotteryStr: [required(t('message.validateTigerCardTimeRequired'))],
  openStr: [required(t('message.validateTigerCardBonusTimeRequired'))],
  sumAward: [required(t('message.validateTigerSumAwardRequired'))],
  cardCount: [required(t('message.validateVirtualCountRequired'))]
})

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

function convertStartDate(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
}

function disabledStartDate(time) {
  if (form.endTime !== null) {
    const date = moment(form.startTime, 'yyyy-MM-dd HH:mm:ss')
    return time.getTime() > date.millisecond()
  }
  return time.getTime() > Date.now();
}

function disabledEndDate(time) {
  if (form.startTime !== null) {
    const date = moment(form.startTime, 'yyyy-MM-dd HH:mm:ss')
    return time.getTime() <= date.millisecond()
  }
  return time.getTime() <= Date.now()
}

function resetQuery() {
  request.loginName = null
  request.queryTime = null
  request.cardType = null
  request.operationType = null
  request.siteId = site.value ? site.value.id : null
}

function loadPage() {
  loadTigerCardRecord()
  loadTigerCardSetting()
}

async function loadTigerCardRecord() {
  page.loading = true
  const query = checkQuery();
  const { data: ret } = await getTigerCardList(query)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

async function loadTigerCardSetting() {
  tigerSetting.loading = true
  const query = { siteId: request.siteId };
  const { data: ret } = await getTigerCardSetting(query)
  for (const key in ret) {
    if (Object.keys(form).find(k => k === key)) {
      form[key] = ret[key];
    }
  }
  form.lotteryTime = ret.lotteryStartTime
  form.deadline = ret.lotteryEndTime
  form.cardCount = ret.virtualCount
  form.periodStr = ret.period
  form.lotteryStr = ret.lotteryTime
  form.openStr = ret.bonusTime
  tigerSetting.setting = [ret]
  tigerSetting.loading = false
}

function checkQuery() {
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.queryTime !== null) {
    if (request.queryTime.length === 2) {
      query.queryTime = request.queryTime.join(",");
    }
  }
  return query;
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
  request.siteId = site[0].id
}

function changePage(page) {
  request.current = page
  loadTigerCardRecord()
}

function updateSetting() {
  tigerCardSettingForm.value.validate(async valid => {
    if (valid) {
      await updateTigerCardSetting(form)
      uiControl.settingVisible = false
      await loadTigerCardSetting()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  await loadTigerCardRecord()
  await loadTigerCardSetting()
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
