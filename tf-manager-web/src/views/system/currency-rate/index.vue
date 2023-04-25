<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          clearable
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
        >
          <el-option
            v-for="item in list.site"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.currencyId"
          size="small"
          :placeholder="t('fields.currency')"
          class="filter-item"
        >
          <el-option
            v-for="item in list.allcurrencies"
            :key="item.id"
            :label="item.currencyCode"
            :value="item.id"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadCurrencyrate"
          v-permission="['sys:currencyrate:list']"
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
          @click="showDialog('CREATE')"
          v-permission="['sys:currencyrate:add']"
        >
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="currencyForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.siteName')" prop="siteId">
          <el-select
            clearable
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.pleaseChoose')"
            class="filter-item"
            style="width: 200px; margin-bottom: 10px"
            @change="onSiteChange()"
          >
            <el-option
              v-for="item in list.site"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.currencyName')" prop="currencyId">
          <el-select
            clearable
            v-model="form.currencyId"
            size="small"
            :placeholder="t('fields.pleaseChoose')"
            class="filter-item"
            style="width: 200px; margin-bottom: 16px"
          >
            <el-option
              v-for="item in list.currencies"
              :key="item.id"
              :label="item.currencyCode"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.depositExchangeRate')" prop="exchangeRateDeposit">
          <el-input
            v-model="form.exchangeRateDeposit"
            style="width: 350px;"
            oninput="value=value.replace(/[^\d.]/g,'')"
          />
        </el-form-item>
        <el-form-item
          :label="t('fields.withdrawExchangeRate')"
          prop="exchangeRateWithdraw"
        >
          <el-input
            v-model="form.exchangeRateWithdraw"
            style="width: 350px;"
            oninput="value=value.replace(/[^\d.]/g,'')"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table
      :data="page.records"
      v-loading="page.loading"
      stripe
      ref="table"
      row-key="id"
      size="small"
      style="width: 100%"
      highlight-current-row
    >
      <el-table-column prop="siteName" :label="t('fields.site')" width="100" />
      <el-table-column prop="currencyName" :label="t('fields.currencyName')" width="200" />
      <el-table-column
        prop="exchangeRateDeposit"
        :label="t('fields.depositExchangeRate')"
        width="200"
      />
      <el-table-column
        prop="exchangeRateWithdraw"
        :label="t('fields.withdrawExchangeRate')"
        width="200"
      />
      <el-table-column prop="createTime" :label="t('fields.createTime')" width="200" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="200" />
      <el-table-column :label="t('fields.operate')" align="right" width="100">
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            @click="showEdit(scope.row)"
            v-permission="['sys:currencyrate:update']"
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
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { isNumeric, required } from '../../../utils/validate'
import { ElMessage } from 'element-plus'
import {
  createCurrencyrate,
  getCurrencyrate,
  updateCurrencyrate,
} from '../../../api/currencyrate'
import { getCurrencyNames } from '../../../api/currency'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)

const currencyForm = ref(null)
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
})
const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})
const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
  currencyId: null,
})

const form = reactive({
  id: null,
  currencyId: null,
  siteId: null,
  exchangeRateDeposit: null,
  exchangeRateWithdraw: null,
})

const list = reactive({
  currencies: [],
  allcurrencies: [],
  site: [],
})

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  currencyId: [required(t('message.validateCurrencyRequired'))],
  exchangeRateDeposit: [
    required(t('message.validateDepositExchangeRateRequired')),
    isNumeric(t('message.validateNumberFourDecimalOnly')),
  ],
  exchangeRateWithdraw: [
    required(t('message.validateWithdrawExchangeRateRequired')),
    isNumeric(t('message.validateNumberFourDecimalOnly')),
  ],
})

function resetQuery() {
  request.siteId = ''
  request.currencyId = ''
  list.currencies = []
}

async function loadCurrencyrate() {
  page.loading = true
  const { data: ret } = await getCurrencyrate(request)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}
function changePage(page) {
  request.current = page
  loadCurrencyrate()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (currencyForm.value) {
      currencyForm.value.resetFields()
    }
    form.id = null
    list.currencies = []
    uiControl.dialogTitle = t('fields.addCurrencyRate')
  } else if (type === 'EDIT') {
    form.id = ''
    uiControl.dialogTitle = t('fields.editCurrencyRate')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(currency) {
  showDialog('EDIT')
  nextTick(() => {
    for (const key in currency) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = currency[key]
        if (key === 'siteId') {
          onSiteChange()
        }
      }
    }
  })
}

function create() {
  currencyForm.value.validate(async valid => {
    if (valid) {
      await createCurrencyrate(form)
      uiControl.dialogVisible = false
      await loadCurrencyrate()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  currencyForm.value.validate(async valid => {
    if (valid) {
      await updateCurrencyrate(form)
      uiControl.dialogVisible = false
      await loadCurrencyrate()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  }
}

async function onSiteChange() {
  console.log(form)
  var currencyBySite = null
  for (const s of list.site) {
    if (s.id === form.siteId) {
      currencyBySite = s.currency.split(',')
    }
  }

  console.log(currencyBySite)

  var finalList = []

  for (const data of list.allcurrencies) {
    var add = false

    for (const currency of currencyBySite) {
      if (data.currencyCode === currency) {
        add = true
      }
    }
    // if site have currency, add data to final list
    if (add === true) {
      finalList.push(data)
    }
  }

  list.currencies = finalList
}

async function loadSite() {
  const { data: ret } = await getSiteListSimple()
  list.site = ret
}

async function loadCurrency() {
  const { data: ret } = await getCurrencyNames()
  list.allcurrencies = ret
}

onMounted(async () => {
  await loadSite()

  if (LOGIN_USER_TYPE.value === TENANT.value) {
    var a = list.site.find(s => s.siteName === store.state.user.siteName)
    request.siteId = a.id
  }

  await loadCurrencyrate()
  await loadCurrency()
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
