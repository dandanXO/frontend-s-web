<template>
  <div class="roles-main">
    <div class="header-container">
      <el-form
        ref="summaryForm"
        :model="form"
        :inline="false"
        size="small"
        label-width="150px"
        style="margin-bottom:30px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId">
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
        </el-form-item>
        <el-form-item :label="t('fields.memberId')" prop="memberId">
          <el-input
            v-model="request.memberId"
            size="small"
            style="width: 200px"
            :placeholder="t('fields.memberId')"
          />

          <el-button
            style="margin-left: 20px"
            icon="el-icon-search"
            size="mini"
            type="success"
            @click="loadMember"
          >
            {{ t('fields.search') }}
          </el-button>
        </el-form-item>

        <el-divider content-position="right" v-if="uiControl.show">
          {{ t('fields.accountInfo') }}
        </el-divider>
        <el-form-item
          :label="t('fields.memberName')"
          prop="memberName"
          v-if="uiControl.show"
        >
          {{ request.memberName }}
        </el-form-item>
        <el-form-item
          :label="t('fields.vipLevel')"
          prop="vip"
          v-if="uiControl.show"
        >
          {{ request.vip }}
        </el-form-item>
        <el-form-item
          :label="t('fields.riskLevel')"
          prop="risk"
          v-if="uiControl.show"
        >
          {{ request.risk }}
        </el-form-item>
      </el-form>
    </div>

    <el-divider content-position="right" v-if="uiControl.show">
      {{ t('fields.additionalTicketDetail') }}
    </el-divider>

    <div class="btn-group" v-if="uiControl.show">
      <el-date-picker
        v-model="request.recordTime"
        format="DD/MM/YYYY"
        value-format="YYYY-MM-DD"
        size="small"
        type="daterange"
        range-separator=":"
        :start-placeholder="t('fields.startDate')"
        :end-placeholder="t('fields.endDate')"
        style="width: 300px; margin-left: 5px;margin-right:10px"
        :shortcuts="shortcuts"
        :editable="false"
        :clearable="false"
      />
      <el-button
        style="margin-left: 20px"
        icon="el-icon-search"
        size="mini"
        type="success"
        @click="loadMemberMultiWheelAdd"
      >
        {{ t('fields.search') }}
      </el-button>

      <el-button
        icon="el-icon-plus"
        size="mini"
        type="primary"
        v-permission="['sys:member:multi:wheel:additional:add']"
        @click="showDialog()"
      >
        {{ t('fields.addTicket') }}
      </el-button>
    </div>

    <el-table
      v-if="uiControl.show"
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="date" :label="t('fields.date')" />
      <el-table-column prop="reason" :label="t('fields.reason')" />
      <el-table-column type="title" :label="t('fields.action')">
        <template #default="scope">
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:member:multi:wheel:additional:delete']"
            @click="removeMemberMultiWheelAdd(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="uiControl.show"
      class="pagination"
      @current-change="changePage"
      layout="prev, pager, next"
      :page-size="request.size"
      :page-count="page.pages"
      :current-page="request.current"
    />
  </div>

  <el-dialog
    :title="uiControl.dialogTitle"
    v-model="uiControl.dialogVisible"
    append-to-body
    width="580px"
  >
    <el-form
      ref="memberMultiWheelAddForm"
      :model="form"
      :rules="formRules"
      :inline="true"
      size="small"
      label-width="150px"
    >
      <el-form-item :label="t('fields.reason')" prop="prize">
        <el-input
          v-model="form.reason"
          style="width: 350px"
          maxlength="11"
          :placeholder="t('fields.reason')"
        />
      </el-form-item>

      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">
          {{ t('fields.cancel') }}
        </el-button>
        <el-button type="primary" @click="createMemberMultiWheelAdd">
          {{ t('fields.confirm') }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import {
  getMemberMultiWheelAdd,
  deleteMemberMultiWheelAdd,
  addMemberMultiWheelAdd,
} from '../../../../api/member-multi-wheel-add'
import { getMemberDetails } from '../../../../api/member'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import { getShortcuts } from '@/utils/datetime'
import { useStore } from '../../../../store'
import { getSiteListSimple } from '../../../../api/site'
import { TENANT } from '../../../../store/modules/user/action-types'
import { required } from '../../../../utils/validate'

const { t } = useI18n()
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

const memberMultiWheelAddForm = ref(null)
const form = reactive({
  siteId: null,
  memberId: null,
  reason: null,
})

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

const request = reactive({
  size: 10,
  current: 1,
  recordTime: [defaultStartDate, defaultEndDate],
  memberId: null,
  siteId: null,
  memberName: null,
  vip: null,
  risk: null,
})

const page = reactive({
  pages: 0,
  records: [],
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: t('fields.add'),
  show: false,
})

async function showDialog() {
  if (memberMultiWheelAddForm.value) {
    memberMultiWheelAddForm.value.resetFields()
  }
  uiControl.dialogVisible = true
}

function changePage(page) {
  request.current = page
  loadMemberMultiWheelAdd()
}

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  date: [required(t('message.validateDateRequired'))],
})

async function removeMemberMultiWheelAdd(multiwheel) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await deleteMemberMultiWheelAdd(multiwheel.id)
    await loadMemberMultiWheelAdd()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

async function loadMemberMultiWheelAdd() {
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
  const { data: ret } = await getMemberMultiWheelAdd(query)
  page.pages = ret.pages
  page.records = ret.records
}

function createMemberMultiWheelAdd() {
  memberMultiWheelAddForm.value.validate(async valid => {
    if (valid) {
      form.siteId = request.siteId
      form.memberId = request.memberId
      await addMemberMultiWheelAdd(form)
      uiControl.dialogVisible = false
      await loadMemberMultiWheelAdd()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

async function loadMember() {
  uiControl.show = false
  if (request.memberId === null) {
    ElMessage({
      message: t('message.validateMemberIdRequired'),
      type: 'success',
    })
  } else {
    const { data: ret } = await getMemberDetails(
      request.memberId,
      request.siteId
    )

    uiControl.show = true
    request.memberName = ret.realName
    request.vip = ret.vip
    request.risk = ret.risk
    loadMemberMultiWheelAdd()
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  } else {
    request.siteId = 1
  }
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

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>
