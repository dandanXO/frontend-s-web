<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px"
          @change="loadPrivilegeList"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.name')"
        />
        <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.privilegeId"
          size="small"
          :placeholder="t('fields.privilege')"
          class="filter-item"
          style="width: 200px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.privilegeList"
            :key="item.id"
            :label="item.alias !== null ? item.alias : item.name"
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
          style="width: 250px; margin-left: 5px"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadMemberPointRecord"
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
          v-permission="['sys:member:point-record:add']"
          @click="openDialog()"
        >
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="500px"
    >
      <el-form
        ref="memberPointForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 250px;"
            default-first-option
            @focus="loadSites"
            @change="loadFormPrivilegeList"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.name')" prop="name">
          <el-input v-model="form.name" style="width: 250px" maxlength="100" />
        </el-form-item>
        <el-form-item :label="t('fields.amount')" prop="amount">
          <el-input
            v-model="form.amount"
            style="width: 250px;"
            maxlength="100"
          />
        </el-form-item>
        <el-form-item :label="t('fields.privilegeName')" prop="privilegeId">
          <el-select
            filterable
            v-model="form.privilegeId"
            size="small"
            class="filter-item"
            style="width: 250px;"
            default-first-option
            @change="selectPrivilege"
          >
            <el-option
              v-for="item in uiControl.formPrivilegeList"
              :key="item.id"
              :label="item.alias !== null ? item.alias : item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="submit">
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
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="memberName" :label="t('fields.name')" />
      <el-table-column prop="privilege" :label="t('fields.privilege')" />
      <el-table-column prop="gameType" :label="t('fields.gameType')">
        <template #default="scope">
          <span v-if="scope.row.gameType !== null">
            {{ t(`gameType.${scope.row.gameType}`) }}
          </span>
          <span v-else>
            -
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" :label="t('fields.bonusAmount')">
        <template #default="scope">
          <span v-formatter="{data: scope.row.amount, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="transactionType" :label="t('fields.type')">
        <template #default="scope">
          <el-tag v-if="scope.row.transactionType === 'REDEEM'" type="success">
            {{ scope.row.transactionType }}
          </el-tag>
          <el-tag v-if="scope.row.transactionType === 'EARN'">
            {{ scope.row.transactionType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="t('fields.status')">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'CLAIMED'" type="success">
            {{ scope.row.status }}
          </el-tag>
          <el-tag v-if="scope.row.status === 'PENDING'" type="danger">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="recordTime" :label="t('fields.recordTime')">
        <template #default="scope">
          <span v-if="scope.row.recordTime === null">-</span>
          <span
            v-if="scope.row.recordTime !== null"
            v-formatter="{
              data: scope.row.recordTime,
              type: 'date',
            }"
          />
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
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import { required } from '../../../utils/validate'
import { ElMessage } from 'element-plus'
import { getActivePrivilegeInfoBySiteId } from '../../../api/privilege-info'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { getMemberPointRecordList, addMemberPointRecord } from '../../../api/member-point-record'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const memberPointForm = ref(null)
const siteList = reactive({
  list: [],
})
const defaultStartDate = convertDate(new Date())
const defaultEndDate = convertDate(new Date())

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: t('fields.createMemberPointRecord'),
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  status: [
    { displayName: t('fields.notClaimed'), value: 'PENDING' },
    { displayName: t('fields.claimed'), value: 'CLAIMED' },
  ],
  privilegeList: [],
  formPrivilegeList: [],
})
const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const request = reactive({
  size: 30,
  current: 1,
  name: null,
  status: null,
  recordTime: [defaultStartDate, defaultEndDate],
  siteId: null,
})

const form = reactive({
  siteId: null,
  name: null,
  amount: null,
  privilegeId: null,
})

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  name: [required(t('message.validateNameRequired'))],
  amount: [required(t('message.validateAmountRequired'))],
  privilegeId: [required(t('message.validatePrivilegeRequired'))],
})

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function resetQuery() {
  request.name = null
  request.status = null
  request.siteId = site.value ? site.value.id : siteList.list[0].id
  request.recordTime = [defaultStartDate, defaultEndDate]
}

function openDialog() {
  form.siteId = null
  form.name = null
  form.amount = null
  form.privilegeId = null
  uiControl.dialogVisible = true
}

async function loadFormPrivilegeList() {
  const { data: list } = await getActivePrivilegeInfoBySiteId(form.siteId)
  uiControl.formPrivilegeList = list
  form.privilegeId = null
}

async function loadMemberPointRecord() {
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
      query.recordTime = JSON.parse(JSON.stringify(request.recordTime));
      query.recordTime = query.recordTime.join(',')
    }
  }
  const { data: ret } = await getMemberPointRecordList(query)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function changePage(page) {
  request.current = page
  loadMemberPointRecord()
}

async function loadPrivilegeList() {
  const { data: list } = await getActivePrivilegeInfoBySiteId(request.siteId)
  uiControl.privilegeList = list
  request.privilegeId = null
}

function submit() {
  memberPointForm.value.validate(async valid => {
    if (valid) {
      await addMemberPointRecord(form)
      uiControl.dialogVisible = false
      await loadMemberPointRecord()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
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
  } else {
    request.siteId = siteList.list[0].id
  }
  loadPrivilegeList()
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
