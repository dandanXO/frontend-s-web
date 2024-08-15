<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.createTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-input
          v-model="request.loginName"
          style="width: 200px; margin-left: 10px"
          size="small"
          maxlength="50"
          :placeholder="t('fields.loginName')"
        />
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in sites.list"
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
          @click="loadTreasureKeyRecord"
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
          v-permission="['sys:privi:treasure-key:add']"
          @click="showDialog('CREATE_ADD')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-minus"
          size="mini"
          type="danger"
          v-permission="['sys:privi:treasure-key:deduct']"
          @click="showDialog('CREATE_DEDUCT')"
        >
          {{ t('fields.deduct') }}
        </el-button>
        <el-button
          size="mini"
          type="primary"
          @click="requestExportExcel"
        >{{ t('fields.requestExportToExcel') }}
        </el-button>
      </div>
    </div>
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
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="priviTreasureKeyForm"
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
            style="width: 120px; margin-left: 5px"
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.loginName')" prop="loginName">
          <el-input v-model="form.loginName" style="width: 350px" />
          <span
            v-if="uiControl.dialogType === 'CREATE_DEDUCT'"
            style="display: block"
          >
            {{ t('fields.keyQuantity') }}: {{ uiControl.keyQuantity }}
          </span>
        </el-form-item>
        <el-form-item :label="t('fields.keyQuantity')" prop="quantity">
          <el-input
            v-model="form.quantity"
            style="width: 350px"
            maxlength="11"
            @keypress="restrictIntegerInput($event)"
          />
        </el-form-item>
        <el-form-item :label="t('fields.adjustReason')" prop="adjustReason">
          <el-input v-model="form.adjustReason" style="width: 350px" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button
            v-if="
              uiControl.dialogType === 'CREATE_ADD' &&
                hasPermission(['sys:privi:treasure-key:add'])
            "
            type="primary"
            @click="createAdd"
          >
            {{ t('fields.confirm') }}
          </el-button>
          <el-button
            v-if="
              uiControl.dialogType === 'CREATE_DEDUCT' &&
                hasPermission(['sys:privi:treasure-key:deduct'])
            "
            type="primary"
            @click="createDeduct"
          >
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table
      size="small"
      :data="page.records"
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column
        prop="loginName"
        :label="t('fields.loginName')"
        min-width="120"
      >
        <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
          <router-link
            :to="`/member/details/${scope.row.memberId}?site=${request.siteId}`"
          >
            <el-link type="primary">{{ scope.row.loginName }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="adjustReason" :label="t('fields.adjustReason')">
        <template #default="scope">
          <span v-if="scope.row.adjustReason !== null"> {{ scope.row.adjustReason }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" :label="t('fields.keyQuantity')" />
      <el-table-column
        prop="quantityBefore"
        :label="t('fields.keyQuantityBefore')"
      />
      <el-table-column
        prop="quantityAfter"
        :label="t('fields.keyQuantityAfter')"
      />
      <el-table-column prop="amount" :label="t('fields.amount')">
        <template #default="scope">
          <div v-if="scope.row.amount !== null">
            $
            <span v-formatter="{data: scope.row.amount, type: 'money'}" />
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createBy"
        :label="t('fields.createBy')"
        min-width="150"
      />
      <el-table-column
        prop="createTime"
        :label="t('fields.createTime')"
        min-width="150"
      >
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{
              data: scope.row.createTime,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="page.total"
      :page-sizes="[20, 50, 100, 150]"
      layout="total,sizes,prev, pager, next"
      style="margin-top: 10px"
      v-model:page-size="request.size"
      v-model:page-count="page.pages"
      v-model:current-page="request.current"
      @current-change="loadTreasureKeyRecord"
      @size-change="loadTreasureKeyRecord"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { required } from '../../../utils/validate'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { findIdByLoginName } from '../../../api/member'
import {
  addTreasureKey,
  deductTreasureKey,
  listTreasureKeyRecord,
  getMemberKey,
  requestExportTreasureKey,
} from '../../../api/privi-treasure-key-record'
import { useI18n } from 'vue-i18n'
import { hasPermission } from '../../../utils/util'
import { getShortcuts } from '@/utils/datetime'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { isDY } from '@/utils/site'

const { t } = useI18n()
const priviTreasureKeyForm = ref(null)
const shortcuts = getShortcuts(t)
const site = ref(null)
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)

const uiControl = reactive({
  messageVisible: false,
  colors: [
    { color: '#f56c6c', percentage: 30 },
    { color: '#e6a23c', percentage: 70 },
    { color: '#5cb87a', percentage: 100 },
  ],
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE_ADD',
  editBtn: true,
  removeBtn: true,
  operationType: [
    { key: 1, displayName: 'ADD', value: 'ADD' },
    { key: 2, displayName: 'DEDUCT', value: 'DEDUCT' },
  ],
  importDialogVisible: false,
  keyQuantity: null,
})

const startDate = new Date()
startDate.setDate(startDate.getDate() - 2)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())

const sites = reactive({
  list: [],
})

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
})

const request = reactive({
  size: 20,
  current: 1,
  createTime: [defaultStartDate, defaultEndDate],
  siteId: null,
  loginName: null,
})

const form = reactive({
  id: null,
  siteId: null,
  memberId: null,
  loginName: null,
  quantity: null,
  adjustReason: null,
  privilegeCode: '',
})

const loginNameValidator = async (rule, value, callback) => {
  if (isDY(form.siteId)) {
    form.privilegeCode = 'dy2-cs2-copenhagen-major-2024'
  } else {
    form.privilegeCode = 'lh-cs2-copenhagen-major-2024'
  }
  if (uiControl.dialogType === 'CREATE_DEDUCT') {
    const { data } = await getMemberKey(value, form.siteId, form.privilegeCode)
    if (data === null || data === undefined) {
      callback(new Error(t('message.memberNotInSite')))
    } else {
      uiControl.keyQuantity = data
      callback()
    }
  } else {
    uiControl.keyQuantity = null
    const { data } = await getMemberKey(value, form.siteId, form.privilegeCode)
    if (data === null || data === undefined) {
      callback(new Error(t('message.memberNotInSite')))
    } else {
      callback()
    }
  }
}

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  loginName: [
    required(t('message.validateLoginNameRequired')),
    { validator: loginNameValidator, trigger: 'blur' },
  ],
  quantity: [required(t('message.validateKeyQuantityRequired'))],
  adjustReason: [required(t('message.validateAdjustReasonRequired'))],
})

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
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

async function loadFormSelect() {
  form.loginName = null
  form.adjustReason = null
  uiControl.keyQuantity = null
}

function resetQuery() {
  request.createTime = [defaultStartDate, defaultEndDate]
  request.siteId = site.value ? site.value.id : sites.list[0].id
  request.loginName = null
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.createTime !== null) {
    if (request.createTime.length === 2) {
      query.createTime = JSON.parse(JSON.stringify(request.createTime))
      query.createTime = query.createTime.join(',')
    }
  }

  return query
}

async function loadTreasureKeyRecord() {
  page.loading = true
  const query = checkQuery()
  const { data: ret } = await listTreasureKeyRecord(query)
  page.pages = ret.pages
  page.records = ret.records
  page.total = ret.total
  page.loading = false
}

async function showDialog(type) {
  if (type === 'CREATE_ADD') {
    if (priviTreasureKeyForm.value) {
      priviTreasureKeyForm.value.resetFields()
    }
    uiControl.dialogTitle = t('fields.addMemberTreasureKey')
  } else if (type === 'CREATE_DEDUCT') {
    if (priviTreasureKeyForm.value) {
      priviTreasureKeyForm.value.resetFields()
    }
    uiControl.keyQuantity = null
    uiControl.dialogTitle = t('fields.deductMemberTreasureKey')
  }
  await loadFormSelect()
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function createAdd() {
  priviTreasureKeyForm.value.validate(async valid => {
    form.id = null
    form.memberId = null
    const { data: id } = await findIdByLoginName(form.loginName, form.siteId)
    form.memberId = id
    if (valid) {
      await addTreasureKey(form)
      uiControl.dialogVisible = false
      await loadTreasureKeyRecord()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function createDeduct() {
  priviTreasureKeyForm.value.validate(async valid => {
    form.id = null
    form.memberId = null
    const { data: id } = await findIdByLoginName(form.loginName, form.siteId)
    form.memberId = id
    if (valid) {
      await deductTreasureKey(form)
      uiControl.dialogVisible = false
      await loadTreasureKeyRecord()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function restrictIntegerInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57 || charCode === 46) {
    event.preventDefault()
  }
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

async function requestExportExcel() {
  const query = checkQuery();
  const { data: ret } = await requestExportTreasureKey(query);
  if (ret) {
    uiControl.messageVisible = true;
  }
}

onMounted(async () => {
  await loadSites()
  request.siteId = sites.list[0].id
  form.siteId = sites.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName)
    request.siteId = site.value.id
    form.siteId = site.value.id
  }
  await loadTreasureKeyRecord()
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

.el-pagination {
  display: inline-block;
}

.table-footer {
  margin-top: 15px;
  margin-right: 20px;
  float: right;
  font-size: small;
}
</style>
