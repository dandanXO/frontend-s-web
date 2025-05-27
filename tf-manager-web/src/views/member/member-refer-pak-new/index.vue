<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px;"
          :placeholder="t('fields.loginName')"
        />
        <!-- <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
          @focus="loadSites"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select> -->
        <el-date-picker
          v-model="request.regTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          class="input-small"
          style="margin-left: 5px;"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="search()"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
        <el-button
          size="mini"
          type="primary"
          v-permission="['sys:member-refer-pak:export']"
          @click="requestExportExcel"
        >{{ t('fields.requestExportToExcel') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="700px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-row>
          <el-form-item :label="t('fields.loginName')" prop="loginName">
            <el-input v-model="form.loginName" disabled />
          </el-form-item>
          <el-form-item :label="t('fields.referrer')" prop="loginName">
            <el-input v-model="form.referrerLoginName" />
          </el-form-item>
        </el-row>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-card class="box-card" shadow="never" style="margin-top: 40px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.referrerList') }}</span>
          <el-row />
          <span v-if="uiControl.referrer"> {{ t('fields.referrer') }} : {{ uiControl.referrer }}</span>
        </div>
      </template>
      <el-table
        :data="page.records"
        ref="table"
        v-loading="page.loading"
        row-key="id"
        size="mini"
        :resizable="true"
        highlight-current-row
        :empty-text="t('fields.noData')"
      >
        <el-table-column prop="totalDownlineCount" :label="t('fields.downlineMember')" width="100">
          <template
            #default="scope"
            v-if="hasPermission(['sys:member-refer-pak-new:list'])"
          >
            <a v-if="scope.row.totalDownlineCount > 0">
              <el-link type="primary" @click="reloadMembers(scope.row.loginName, scope.row.id)">{{ scope.row.totalDownlineCount }}</el-link>
            </a>
            <span v-else>{{ scope.row.totalDownlineCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          width="180"
        >
          <template
            #default="scope"
            v-if="hasPermission(['sys:member:detail'])"
          >
            <router-link :to="`details/${scope.row.id}?site=${request.siteId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="regTime"
          :label="t('fields.registerTime')"
          width="150"
        >
          <template #default="scope">
            <span v-if="scope.row.regTime === null">-</span>
            <span
              v-if="scope.row.regTime !== null"
              v-formatter="{
                data: scope.row.regTime,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column prop="todayRegCount" :label="t('fields.todayRegCount')" width="100" />
        <el-table-column prop="yesterdayRegCount" :label="t('fields.yesterdayRegCount')" width="100" /> -->
        <el-table-column :label="t('fields.operate')" align="center" fixed="right" min-width="120">
          <template #default="scope" v-if="hasPermission(['sys:member-refer-pak:change-referrer'])">
            <el-button icon="el-icon-edit" size="mini" type="success" @click="showEditDialog(scope.row)">{{ t('fields.changeReferrer') }}</el-button>
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
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import {
  getPakMemberReferParentNew,
  changeMemberReferrer,
  requestPakReferRecord
} from '../../../api/member-refer-event'
import { getSiteListSimple } from '../../../api/site'
import { hasPermission } from '../../../utils/util'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { required } from "@/utils/validate";
import { getShortcuts } from "@/utils/datetime";
import moment from "moment/moment";

const router = useRouter()
const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const table = ref(null)
const formRef = ref(null);
const siteList = reactive({
  list: [],
})
let timeZone = null
const shortcuts = getShortcuts(t)

const form = reactive({
  memberId: null,
  siteId: null,
  loginName: null,
  referrerLoginName: null,
});

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  referrer: null,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const startDate = new Date()
startDate.setDate(startDate.getDate() - 7)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

const request = reactive({
  size: 10,
  current: 1,
  loginName: null,
  siteId: null,
  memberRemark: null,
  referrerId: null,
  regTime: [defaultStartDate, defaultEndDate],
})

function resetQuery() {
  request.loginName = null
  request.memberRemark = null
  request.siteId = store.state.user.siteId
  request.referrerId = null
  request.regTime = [defaultStartDate, defaultEndDate]
  uiControl.referrer = null
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (key === 'regTime') {
      query[key] = [...requestCopy.regTime]
    } else {
      query[key] = value
    }
  })
  query.regTime = joinRecordTime(query.regTime)
  return query
}

function joinRecordTime(recordTime) {
  const string = JSON.parse(JSON.stringify(recordTime))
  return string.join(',')
}

function search() {
  uiControl.referrer = null
  request.referrerId = null
  loadMembers()
}

async function requestExportExcel() {
  const query = checkQuery();
  query.requestBy = store.state.user.name;
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const { data: ret } = await requestPakReferRecord(query);
  if (ret) {
    uiControl.messageVisible = true;
  }
}

async function reloadMembers(loginName, uplineId) {
  request.referrerId = uplineId
  request.loginName = null
  uiControl.referrer = loginName
  loadMembers()
}

async function loadMembers() {
  page.loading = true
  uiControl.searchDialogVisible = false
  const query = checkQuery()
  const result = await getPakMemberReferParentNew(query)

  page.pages = result.data.pages
  page.records = result.data.records
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone
  page.loading = false
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadMembers()
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site.filter(e => e.id === 11 || e.id === 12 || e.id === 19)
}

async function showEditDialog(row) {
  uiControl.dialogTitle = t('fields.changeReferrer')
  uiControl.dialogVisible = true
  form.memberId = row.id
  form.siteId = row.siteId
  form.loginName = row.loginName
  form.referrerLoginName = null
}

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  memberId: [required(t('message.validateMemberRequired'))],
  referrerLoginName: [required(t('message.validateReferrerRequired'))],
})

function submit() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await changeMemberReferrer(form.siteId, form.memberId, form.referrerLoginName);
      uiControl.dialogVisible = false
      await loadMembers()
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

onMounted(async () => {
  await loadSites()
  if (router.currentRoute.value.query.id) {
    request.siteId = Number(router.currentRoute.value.query.site)
    request.referrerId = router.currentRoute.value.query.id
    uiControl.referrer = router.currentRoute.value.query.referrer
  } else {
    request.siteId = store.state.user.siteId
    if (LOGIN_USER_TYPE.value === TENANT.value) {
      site.value = siteList.list.find(
        s => s.siteName === store.state.user.siteName
      )
      request.siteId = site.value.id
    }
  }
  await loadMembers();
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

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}

:deep(.el-table__row:not([class*='el-table__row--level-'])) {
  td:first-child {
    padding-left: 23px;
  }
}

.level-color {
  width: 30px;
  height: 30px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 5px;
}
</style>
