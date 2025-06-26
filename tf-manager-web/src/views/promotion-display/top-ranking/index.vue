<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 200px;"
          @focus="loadSites"
          @change="handleChangeSite"
        >
          <el-option
            v-for="item in list.site"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-date-picker
          v-model="request.recordTime"
          size="small"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px; margin-left: 5px"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px; margin-left: 5px;"
          :placeholder="t('fields.loginName')"
        />
        <el-select
          clearable
          v-model="request.type"
          size="small"
          :placeholder="t('fields.type')"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in topRankingTypes.list"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.timeType"
          size="small"
          :placeholder="t('fields.type')"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in rankingTimeTypes.list"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadTopRanking">
          {{ t('fields.search') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button icon="el-icon-plus" size="mini" type="primary" v-permission="['sys:privi:top-ranking:add']" @click="showDialog('CREATE')">{{ t('fields.add') }}</el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="topRankingForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="170px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId" v-if="!hasRole(['TENANT'])">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @focus="loadSites"
            @change="handleChangeSite()"
            :disabled="uiControl.dialogType === 'EDIT'"
          >
            <el-option
              v-for="item in list.site"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.privilegeName')" prop="privilegeId">
          <el-select
            filterable
            v-model="form.privilegeId"
            :placeholder="t('fields.privilegeName')"
            size="small"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @focus="loadPrivilegeInfos"
          >
            <el-option
              v-for="item in list.privilege"
              :key="item.id"
              :label="item.alias !== null ? item.alias : item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.platform')" prop="platform">
          <el-select
            v-model="form.platform"
            value-key="id"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
            @focus="loadSearchPlatforms"
          >
            <el-option
              v-for="item in list.platform"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.memberName')" prop="loginName">
          <el-input v-model="form.loginName" style="width: 350px;" maxlength="50" :disabled="uiControl.dialogType === 'EDIT'" />
        </el-form-item>
        <el-form-item :label="t('fields.gameType')" prop="gameType">
          <el-select
            v-model="form.gameType"
            value-key="id"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
          >
            <el-option
              v-for="item in gameTypes.list"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.gameName')" prop="gameName">
          <el-input v-model="form.gameName" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.amount')" prop="amount">
          <el-input v-model="form.amount" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.timeType')" prop="timeType">
          <el-select
            v-model="form.timeType"
            value-key="id"
            :placeholder="t('fields.timeType')"
            style="width: 350px"
            filterable
          >
            <el-option
              v-for="item in rankingTimeTypes.list"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.type')" prop="type">
          <el-select
            v-model="form.type"
            value-key="id"
            :placeholder="t('fields.type')"
            style="width: 350px"
            filterable
          >
            <el-option
              v-for="item in topRankingTypes.list"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table :data="page.records" v-loading="page.loading" ref="table" row-key="id" size="small" highlight-current-row>
      <!-- <el-table-column prop="siteId" :label="t('fields.site')" width="50" /> -->
      <el-table-column type="index" width="50" />
      <el-table-column prop="type" :label="t('fields.type')" width="50" />
      <el-table-column prop="platform" :label="t('fields.platform')" width="100" />
      <el-table-column prop="gameType" :label="t('fields.gameType')" width="100" />
      <el-table-column prop="gameName" :label="t('fields.gameName')" width="100" />
      <el-table-column prop="loginName" :label="t('fields.memberName')" width="120" />
      <el-table-column prop="amount" :label="t('fields.amount')" align="center" min-width="180" sortable>
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.amount, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="recordTime" :label="t('fields.rankingTime')" width="100">
        <template #default="scope">
          <span v-if="scope.row.recordTime === null">-</span>
          <span
            v-if="scope.row.recordTime !== null"
            v-formatter="{
              data: scope.row.recordTime,
              timeZone: timeZone,
              formatter: 'YYYY-MM-DD',
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="timeType" :label="t('fields.timeType')" width="100" />
      <el-table-column prop="createTime" :label="t('fields.createTime')">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{
              data: scope.row.createTime,
              timeZone: timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createBy" :label="t('fields.createBy')" />
      <el-table-column :label="t('fields.action')" align="right" v-if="hasPermission(['sys:privi:top-ranking:update']) || hasPermission(['sys:privi:top-ranking:delete'])">
        <template #default="scope">
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:privi:top-ranking:update']" @click="showEdit(scope.row)" />
          <el-button icon="el-icon-remove" size="mini" type="danger" v-permission="['sys:privi:top-ranking:delete']" @click="remove(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      :total="page.total"
      :page-sizes="[20, 50, 100, 150, 200, 500]"
      @current-change="changepage"
      layout="total,sizes,prev, pager, next"
      v-model:page-size="request.size"
      v-model:page-count="page.pages"
      v-model:current-page="request.current"
      @size-change="loadTopRanking()"
    />
  </div>
</template>

<script setup>

import { nextTick, reactive, ref, watch } from "vue";
import { required } from "../../../utils/validate";
import { getSiteListSimple } from "@/api/site";
import { getPlatformsBySite } from "../../../api/platform";
import { getActivePrivilegeInfoBySiteId } from "../../../api/privilege-info";
import { createTopRanking, updateTopRanking, getTopRankingList, delTopRanking } from "@/api/top-ranking";
import { hasRole, hasPermission } from "@/utils/util";
import { onMounted } from "@vue/runtime-core";
import { useStore } from '@/store';
import { useI18n } from "vue-i18n";
import { getGameTypes } from '../../../api/game'
import { ElMessage, ElMessageBox } from "element-plus";
import moment from 'moment'
import { getShortcuts } from '@/utils/datetime'
import { formatInputTimeZone } from "@/utils/format-timeZone"

const { t } = useI18n();
const store = useStore();
const site = ref(null);
const list = reactive({
  platform: [],
  site: [],
  privilege: []
});
// const startDate = new Date()
// startDate.setTime(
//   moment(startDate)
//     .startOf('month')
//     .format('x')
// )

const defaultStartDate = convertStartDate(new Date())
const defaultEndDate = convertDate(new Date())
function convertDate(date) {
  return moment(date).endOf('day').format('YYYY-MM-DD HH:mm:ss');
}

function convertStartDate(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
}
const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];
const shortcuts = getShortcuts(t)
let timeZone = null;
const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  recordTime: [defaultStartDate, defaultEndDate],
  type: 'BET',
  timeType: 'DAILY',
  orderBy: "record_time, time_type, amount"
});

const topRankingForm = ref(null);
const topRankingTypes = reactive({
  list: ["BET", "WIN", "LOSS"],
});
const rankingTimeTypes = reactive({
  list: ["DAILY", "WEEKLY", "MONTHLY"],
});
const gameTypes = reactive({
  list: [],
});
const uiControl = reactive({
  dialogVisible: false,
  checkDialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true,
});
const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const form = reactive({
  id: null,
  siteId: null,
  privilegeId: null,
  platform: null,
  memberId: null,
  loginName: null,
  gameType: null,
  gameName: null,
  amount: null,
  timeType: null,
  type: null
});

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  privilegeId: [required(t('message.validatePrivilegeRequired'))],
  loginName: [required(t('message.validateLoginNameRequired'))],
  platform: [required(t('message.validatePlatformRequired'))],
  gameType: [required(t('message.validateGameTypeRequired'))],
  gameName: [required(t('message.validateGameNameRequired'))],
  amount: [required(t('message.validateAmountRequired'))],
  timeType: [required(t('message.validateTimeTypeRequired'))],
  type: [required(t('message.validateTypeRequired'))],
});

async function loadTopRanking() {
  page.loading = true;
  const query = checkQuery()
  const { data: ret } = await getTopRankingList(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  timeZone = list.site.find(e => e.id === request.siteId).timeZone;
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = JSON.parse(JSON.stringify(request.recordTime))
      query.recordTime[0] = formatInputTimeZone(query.recordTime[0], timeZone)
      query.recordTime[1] = formatInputTimeZone(query.recordTime[1], timeZone)
      query.recordTime = query.recordTime.join(',')
    } else {
      query.recordTime[0] = formatInputTimeZone(query.recordTime[0], timeZone)
    }
  }
  return query
}

async function loadGameTypes() {
  const { data: ret } = await getGameTypes()
  gameTypes.list = ret
}

function showDialog(type) {
  if (topRankingForm.value) {
    topRankingForm.value.resetFields();
  }
  if (type === "CREATE") {
    form.id = null;
    form.status = "true";
    form.orderSequence = page.records.length + 1;
    uiControl.dialogTitle = t('fields.add');
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.edit');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(topRanking) {
  showDialog("EDIT");
  nextTick(() => {
    for (const key in topRanking) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = topRanking[key];
      }
    }
  });
}

function remove(ranking) {
  ElMessageBox.confirm(t('fields.deleteRanking'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await delTopRanking(ranking.id)
    await loadTopRanking()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

function handleChangeSite(value) {
  request.siteId = value
  loadSearchPlatforms()
}

function save() {
  topRankingForm.value.validate(async (valid) => {
    if (valid) {
      await createTopRanking(form);
      uiControl.dialogVisible = false;
      await loadTopRanking();
    }
  });
}

function update() {
  topRankingForm.value.validate(async (valid) => {
    if (valid) {
      await updateTopRanking(form);
      uiControl.dialogVisible = false;
      await loadTopRanking();
    }
  });
}

function submit() {
  uiControl.dialogLoading = true;
  if (uiControl.dialogType === "CREATE") {
    save();
  } else if (uiControl.dialogType === "EDIT") {
    update();
  }
}

async function loadSearchPlatforms() {
  if (request.siteId !== null) {
    const { data: ret } = await getPlatformsBySite(request.siteId)
    list.platform = ret
  } else {
    list.platform = []
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  list.site = site;
  request.siteId = site[0].id;
}

function changepage(page) {
  request.current = page;
  loadTopRanking();
}

async function loadPrivilegeInfos(siteId) {
  const { data: privilegeInfo } = await getActivePrivilegeInfoBySiteId(siteId);
  list.privilege = privilegeInfo;
}

watch(() => request.siteId, () => {
  form.siteId = request.siteId
})
onMounted(async () => {
  await loadGameTypes();
  await loadSites();
  site.value = list.site.find(s => s.siteName === store.state.user.siteName);
  request.siteId = site.value.id;
  await loadPrivilegeInfos(request.siteId)
  loadSearchPlatforms();
  await loadTopRanking();
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

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>
