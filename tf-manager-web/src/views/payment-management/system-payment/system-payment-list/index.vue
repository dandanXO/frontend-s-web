<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.paymentName"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.paymentName')"
        />
        <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 150px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.statusType"
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
          @click="loadSystemPayment"
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
          v-permission="['sys:payment:add']"
          @click="addPayment()"
        >
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="paymentName" :label="t('fields.paymentName')" />
      <el-table-column prop="mallName" :label="t('fields.mallName')" />
      <el-table-column prop="payType" :label="t('fields.paymentType')" />
      <el-table-column prop="mallCode" :label="t('fields.mallCode')" />
      <el-table-column prop="createTime" :label="t('fields.createTime')">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{
              data: scope.row.createTime,
              formatter: 'YYYY/MM/DD HH:mm:ss',
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" :label="t('fields.updateTime')">
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.updateTime !== null"
            v-formatter="{
              data: scope.row.updateTime,
              formatter: 'YYYY/MM/DD HH:mm:ss',
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        :label="t('fields.state')"
        v-if="hasPermission(['sys:payment:update:state'])"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="OPEN"
            inactive-value="CLOSE"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changePaymentStatus(scope.row.id, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column
        type="title"
        :label="t('fields.action')"
        v-if="hasPermission(['sys:payment:update'])"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            @click="editPayment(scope.row)"
          />

          <el-button
            icon="el-icon-copy-document"
            size="mini"
            type="warning"
            @click="showDialog(scope.row)"
          />
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

    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="600px"
    >
      <el-form
        ref="copyPaymentForm"
        v-loading="uiControl.dialogLoading"
        :model="copyForm"
        :inline="true"
        size="small"
        label-width="160px"
      >
        <el-form-item :label="t('fields.paymentName')" prop="name">
          <el-input v-model="copyForm.name" style="width: 350px" />
        </el-form-item>

        <el-form-item :label="t('fields.mallName')" prop="mall">
          <el-input v-model="copyForm.mall" style="width: 350px" />
        </el-form-item>

        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="copySubmit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
</template>

<script setup>
import { nextTick, onMounted, reactive, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getSystemPaymentList,
  updateSystemPaymentStatus,
  copyPayment,
  updatePaymentPlatform,
} from '../../../../api/system-payment'
import { hasPermission } from '../../../../utils/util'
import { useStore } from '../../../../store'
import { TENANT } from '../../../../store/modules/user/action-types'
import { getSiteListSimple } from '../../../../api/site'
import { useI18n } from "vue-i18n";
import { ElMessage } from 'element-plus'

// eslint-disable-next-line
const { t } = useI18n();
const store = useStore()
const copyPaymentForm = ref(null)
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteList = reactive({
  list: [],
})

const uiControl = reactive({
  statusType: [
    { key: 1, displayName: 'Open', value: 'OPEN' },
    { key: 2, displayName: 'Close', value: 'STATUS' },
  ],
  dialogVisible: false,
  dialogTitle: '',
  dialogLoading: false,
})
const request = reactive({
  size: 30,
  current: 1,
  mallName: null,
  status: null,
  siteId: null,
})

const copyForm = reactive({
  name: null,
  mall: null,
  id: null,
  paymentName: null
})

const form = reactive({
  id: null,
  paymentName: null,
  status: null,
  payType: null,
  mallName: null,
  mallCode: null,
  mallKey: null,
  mallExtraKey: null,
  className: null,
  requestUrl: null,
  callbackUrl: null,
  ruleType: null,
  ruleParam: null,
  countryId: null,
  currencyId: null,
  supportWay: null,
  payMsg: null,
  payMsgMobile: null,
  extraParam: null,
  payResultType: null,
  feeRate: 0,
  depositMin: 0,
  depositMax: 0,
  createBy: null,
  createTime: null,
  updateBy: null,
  updateTime: null,
})

function resetQuery() {
  request.paymentName = null
  request.status = null
  request.siteId = site.value ? site.value.id : null
  updatePaymentPlatform();
}

async function changePaymentStatus(id, status) {
  await updateSystemPaymentStatus(id, status)
}

const router = useRouter()
function addPayment() {
  router.push({
    name: 'Add Payment',
  })
}

function showDialog(systemPayment) {
  copyForm.id = systemPayment.id;
  copyForm.mall = "";
  copyForm.name = "";
  uiControl.dialogTitle = t('fields.copyPayment') + " -  " + systemPayment.paymentName;
  uiControl.dialogVisible = true
}

function editPayment(systemPayment) {
  nextTick(() => {
    for (const key in systemPayment) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = systemPayment[key]
      }
    }
    router.push({
      name: 'Edit Payment',
      params: { id: systemPayment.id, current: request.current },
    })
  })
}

async function copySubmit() {
  if (copyForm.name === null || copyForm.name === "") {
    ElMessage({ message: t('message.validatePaymentNameRequired'), type: 'error' });
  } else if (copyForm.mall === null || copyForm.mall === "") {
    ElMessage({ message: t('message.validateMallNameRequired'), type: 'error' });
  } else {
    uiControl.dialogVisible = false;
    await copyPayment(copyForm);
    loadSystemPayment();
    ElMessage({ message: t('message.copySuccess'), type: 'success' });
  }
}

const page = reactive({
  pages: 0,
  records: [],
})

async function loadSystemPayment() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  const { data: ret } = await getSystemPaymentList(query)
  page.pages = ret.pages
  page.records = ret.records
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

const route = useRoute()

onMounted(async () => {
  if (route.query.current != null) {
    request.current = Number(route.query.current)
  }

  await loadSites()

  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }

  loadSystemPayment()
})

function changePage(page) {
  request.current = page
  loadSystemPayment()
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
