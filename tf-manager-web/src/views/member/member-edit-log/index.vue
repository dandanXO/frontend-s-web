<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <!-- <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 100px;"
          default-first-option
          @focus="loadSites"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select> -->
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px;margin-left: 5px"
          :placeholder="t('fields.loginName')"
        />
        <el-select
          clearable
          v-model="request.type"
          size="small"
          :placeholder="t('fields.editType')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.editType"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="request.createBy"
          size="small"
          style="width: 200px;margin-left: 5px"
          :placeholder="t('fields.createBy')"
        />
        <el-date-picker
          v-model="request.createTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="margin-left: 5px; width: 250px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          :disabled="isSearchDisabled"
          @click="loadMemberEditLog"
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
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:member-edit:add']"
          @click="showDialog()"
        >
          {{ t('fields.editDetails') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="t('message.enterMemberDetails')"
      v-model="uiControl.memberInfoDialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="memberMainInfoForm"
        :model="memberInfoForm"
        :rules="memberInfoFormRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.site')" prop="site">
          <el-select
            v-model="memberInfoForm.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 100px;"
            default-first-option
            @focus="loadSites"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.loginName')" prop="loginName">
          <el-input style="width: 350px" v-model="memberInfoForm.loginName" />
        </el-form-item>

        <div class="dialog-footer">
          <el-button @click="uiControl.memberInfoDialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="submitMainInfo">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="t('message.editMemberDetail')"
      v-model="uiControl.memberEditLogDialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="memberEditLogForm"
        :model="editLogForm"
        :rules="editLogFormRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.editType')" prop="editType">
          <el-select
            v-model="editLogForm.type"
            size="small"
            :placeholder="t('fields.editType')"
            class="filter-item"
            style="width: 150px;margin-left: 5px"
          >
            <el-option
              v-for="item in uiControl.editType"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.value')" prop="afterInfo">
          <el-input
            v-if="editLogForm.type !== 'BIRTHDAY'"
            style="width: 350px"
            v-model="editLogForm.afterInfo"
          />
          <el-date-picker
            v-else
            v-model="editLogForm.afterInfo"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            size="small"
            type="date"
            :placeholder="t('fields.birthday')"
            style="width: 350px"
            :disabled-date="disabledBirthday"
            :editable="false"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.memberEditLogDialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="submitEditLog">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
    >
      <el-table-column
        prop="loginName"
        :label="t('fields.loginName')"
        min-width="100"
      />
      <el-table-column
        prop="type"
        :label="t('fields.editType')"
        min-width="140"
      />
      <el-table-column
        prop="beforeInfo"
        :label="t('fields.beforeEdit')"
        min-width="120"
      />
      <el-table-column
        prop="afterInfo"
        :label="t('fields.afterEdit')"
        min-width="120"
      />
      <el-table-column prop="siteName" :label="t('fields.site')" />
      <el-table-column
        prop="createTime"
        :label="t('fields.createTime')"
        min-width="140"
      >
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <!-- eslint-disable -->
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
      <el-table-column
        prop="checkedTime"
        :label="t('fields.checkDate')"
        min-width="140"
      >
        <template #default="scope">
          <span v-if="scope.row.checkedTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.checkedTime !== null"
            v-formatter="{
              data: scope.row.checkedTime,
              timeZone: timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="checkedBy"
        :label="t('fields.checkBy')"
        align="center"
        min-width="100"
      >
        <template #default="scope">
          <span v-if="scope.row.checkedBy !== null && scope.row.status === '1'">
            {{ scope.row.checkedBy }}
          </span>
          <span
            v-else-if="scope.row.checkedBy !== null && scope.row.status === '2'"
          >
            {{ scope.row.checkedBy }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="status"
        :label="t('fields.status')"
        align="center"
        width="160"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.status === '0'" type="danger">
            {{ t('editCheckedStatus.' + scope.row.status) }}
          </el-tag>
          <el-tag v-else-if="scope.row.status === '1'" type="success">
            {{ t('editCheckedStatus.' + scope.row.status) }}
          </el-tag>
          <el-tag v-else-if="scope.row.status === '2'" type="danger">
            {{ t('editCheckedStatus.' + scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        :label="t('fields.operate')"
        align="center"
        min-width="100"
        fixed="right"
      >
        <template #default="scope">
          <el-button
            v-if="
              scope.row.status === '0' &&
                hasPermission(['sys:member:editlog:check'])
            "
            size="mini"
            type="primary"
            @click="toCheck(scope.row)"
          >
            {{ t('fields.editCheck') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-pagination
    class="pagination"
    @current-change="changePage"
    layout="prev, pager, next"
    :page-size="request.size"
    :page-count="page.pages"
    :current-page="request.current"
  />
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import {
  createMemberEditLog,
  getMemberEditLogList,
  getMemberEditLogSensitiveList,
  preCheckForCreate,
  check,
  fail,
} from '../../../api/memberEditLog'
import { required } from '../../../utils/validate'
import { useI18n } from 'vue-i18n'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { getShortcuts } from '@/utils/datetime'
import { hasPermission } from '../../../utils/util'
import { formatInputTimeZone } from '@/utils/format-timeZone'

const { t } = useI18n()
const memberMainInfoForm = ref(null)
const memberEditLogForm = ref(null)
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteList = reactive({
  list: [],
})

const shortcuts = getShortcuts(t)
const startDate = new Date()
startDate.setDate(startDate.getDate() - 2)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())
let timeZone = null

const uiControl = reactive({
  memberInfoDialogVisible: false,
  memberEditLogDialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  // ENUM('NAME', 'PASSWORD', 'STATUS', 'EMAIL', 'TELEPHONE', 'AGENT', 'BIRTHDAY', 'COUNTRY', 'VIP_LEVEL', 'FINANCIAL_LEVEL', 'RISK_LEVEL', 'MEMBER_TYPE', 'NAME2')
  editType: [
    { key: 1, displayName: 'Name', value: 'NAME' },
    { key: 2, displayName: 'Name2', value: 'NAME2' },
    // { key: 2, displayName: 'VIP LEVEL', value: 'VIP_LEVEL' },
    { key: 3, displayName: 'Email', value: 'EMAIL' },
    { key: 4, displayName: 'Status', value: 'STATUS' },
    { key: 5, displayName: 'Birthday', value: 'BIRTHDAY' },
    { key: 6, displayName: 'Password', value: 'PASSWORD' },
    { key: 7, displayName: 'Telephone', value: 'TELEPHONE' },
    { key: 8, displayName: 'Risk Level', value: 'RISK_LEVEL' },
    { key: 9, displayName: 'Member Type', value: 'MEMBER_TYPE' },
    { key: 10, displayName: 'Financial Level', value: 'FINANCIAL_LEVEL' },
    { key: 11, displayName: 'Withdraw Password', value: 'WITHDRAW_PASSWORD' },
    { key: 12, displayName: 'Withdraw Type', value: 'WITHDRAW_TYPE' }
  ],
})
const request = reactive({
  size: 30,
  current: 1,
  loginName: null,
  type: null,
  createBy: null,
  siteId: null,
  createTime: [defaultStartDate, defaultEndDate],
})

const isSearchDisabled = computed(() => {
  return !request.loginName && !request.type && !request.createBy
})

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function disabledBirthday(time) {
  return time.getTime() > new Date().getTime()
}

function disabledDate(time) {
  return (
    time.getTime() <
      moment(new Date())
        .subtract(2, 'months')
        .startOf('month')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

function resetQuery() {
  request.loginName = null
  request.type = null
  request.createBy = null
  request.siteId = store.state.user.siteId
  request.createTime = [defaultStartDate, defaultEndDate]
}

const memberInfoForm = reactive({
  loginName: null,
  siteId: null,
})

const editLogForm = reactive({
  memberId: null,
  type: null,
  afterInfo: null,
})

const memberInfoFormRules = reactive({
  loginName: [required(t('message.validateLoginNameRequired'))],
})

const editLogFormRules = reactive({
  afterInfo: [required(t('message.validateValueRequired'))],
})

function showDialog() {
  memberInfoForm.siteId = store.state.user.siteId
  if (memberMainInfoForm.value) {
    memberMainInfoForm.value.resetFields()
  }
  uiControl.memberInfoDialogVisible = true
}

function submitMainInfo() {
  memberMainInfoForm.value.validate(async valid => {
    if (valid) {
      const { data: ret } = await preCheckForCreate(memberInfoForm)
      console.log(ret.loginName)
      if (ret.loginName !== undefined) {
        editLogForm.siteId = memberInfoForm.siteId
        editLogForm.memberId = ret.id
        uiControl.memberInfoDialogVisible = false
        if (memberEditLogForm.value) {
          memberEditLogForm.value.resetFields()
        }
        uiControl.memberEditLogDialogVisible = true
      }
      ElMessage({
        message: t('message.found') + ret.loginName,
        type: 'success',
      })
    }
  })
}

function submitEditLog() {
  memberEditLogForm.value.validate(async valid => {
    if (valid) {
      await createMemberEditLog(editLogForm)

      uiControl.memberEditLogDialogVisible = false
      await loadMemberEditLog()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

const page = reactive({
  pages: 0,
  records: [],
})

async function loadMemberEditLog() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone

  if (request.createTime.length === 2) {
    query.createTime = JSON.parse(JSON.stringify(request.createTime))
    query.createTime[0] = formatInputTimeZone(
      query.createTime[0],
      timeZone,
      'start'
    )
    query.createTime[1] = formatInputTimeZone(
      query.createTime[1],
      timeZone,
      'end'
    )
    query.createTime = query.createTime.join(',')
  }
  if (hasPermission(['sys:member:editlog:unmask'])) {
    const { data: ret } = await getMemberEditLogList(query)
    page.pages = ret.pages
    page.records = ret.records
  } else {
    const { data: ret } = await getMemberEditLogSensitiveList(query)
    page.pages = ret.pages
    page.records = ret.records
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function toCheck(val) {
  ElMessageBox.confirm(t('message.confirmToCheck'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('editCheckedStatus.2'),
    distinguishCancelAndClose: true,
    type: 'warning',
    beforeClose: async (action, instance, done) => {
      if (action === 'cancel') {
        await fail(val, request.siteId)
        await loadMemberEditLog()
        ElMessage({
          message: t('message.updateToFailSuccess'),
          type: 'success',
        })
        done()
      } else if (action === 'close') {
        done()
      } else {
        await check(val, request.siteId)
        await loadMemberEditLog()
        ElMessage({ message: t('message.updateSuccess'), type: 'success' })
        done()
      }
    },
  }).then(async () => {})
}

onMounted(async () => {
  await loadSites()
  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  // loadMemberEditLog()
})

function changePage(page) {
  request.current = page
  loadMemberEditLog()
}
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
