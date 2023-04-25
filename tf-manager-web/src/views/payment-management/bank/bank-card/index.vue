<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.bankName')"
        />
        <el-input
          v-model="request.code"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.identifyCode')"
        />
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in list.site"
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
          @click="loadBankCard"
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
          v-permission="['sys:bank-card:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:bank-card:del']"
          @click="removeCard()"
          :disabled="uiControl.removeBtn"
        >
          {{ t('fields.delete') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="800px"
    >
      <el-form
        ref="bankForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.identifyCode')" prop="identifyCode">
          <span>
            <el-input
              v-model="form.identifyCode"
              style="width: 200px"
              @blur="checkUnique($event)"
            />

            <i v-if="validateCode" class="el-icon-circle-check" />
            <i
              v-if="!validateCode && validateCode !== null"
              class="el-icon-circle-close"
            />
          </span>
        </el-form-item>
        <el-form-item :label="t('fields.bankName')" prop="bankId">
          <el-select
            clearable
            v-model="form.bankId"
            size="small"
            :placeholder="t('fields.bankName')"
            class="filter-item"
            style="width: 490px; margin-bottom: 10px"
            @change="bankChange"
            :disabled="uiControl.changingCurrency || uiControl.changingSite"
          >
            <el-option
              v-for="item in list.bankInfo"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-row>
          <el-form-item :label="t('fields.currency')" prop="currencyId">
            <el-select
              clearable
              v-model="form.currencyId"
              size="small"
              :placeholder="t('fields.pleaseChoose')"
              class="filter-item"
              style="width: 200px; margin-bottom: 16px"
              @change="currencyChange"
              :disabled="uiControl.changingBank || uiControl.changingSite"
            >
              <el-option
                v-for="item in list.currencies"
                :key="item.id"
                :label="item.currencyCode"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('fields.site')" prop="siteId" label-width="80px">
            <el-select
              clearable
              v-model="form.siteId"
              size="small"
              :placeholder="t('fields.pleaseChoose')"
              class="filter-item"
              style="width: 200px; margin-bottom: 10px"
              @change="siteChange"
              :disabled="uiControl.changingCurrency || uiControl.changingBank"
            >
              <el-option
                v-for="item in list.site"
                :key="item.id"
                :label="item.siteName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-form-item :label="t('fields.financialLevel')" prop="financialLevel">
          <el-select
            multiple
            filterable
            allow-create
            default-first-option
            :reserve-keyword="false"
            v-model="selected.financialLevel"
            size="small"
            :placeholder="t('fields.financialLevel')"
            class="filter-item"
            style="width: 490px; margin-bottom: 10px"
            @change="handleChangeFinancialGroup()"
            @focus="loadFinancialLevel"
          >
            <el-option
              v-for="item in list.financialLevel"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.cardNumber')" prop="cardNumber">
          <el-input v-model="form.cardNumber" style="width: 490px" />
        </el-form-item>
        <el-form-item :label="t('fields.cardAccount')" prop="cardAccount">
          <el-input v-model="form.cardAccount" style="width: 490px" />
        </el-form-item>
        <el-form-item :label="t('fields.cardAddress')" prop="cardAddress">
          <el-input v-model="form.cardAddress" style="width: 490px" />
        </el-form-item>
        <el-form-item :label="t('fields.status')" prop="status">
          <el-radio-group v-model="form.status" style="width: 490px">
            <el-radio
              v-for="s in uiControl.status"
              :label="s.value"
              :key="s.value"
            >
              {{ s.displayName }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('fields.type')" prop="type">
          <el-radio-group v-model="form.type" style="width: 490px">
            <el-radio
              v-for="item in uiControl.type"
              :key="item.key"
              :label="item.value"
            >
              {{ item.displayName }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="t('fields.payType')" prop="payType">
          <el-select
            multiple
            filterable
            allow-create
            default-first-option
            :reserve-keyword="false"
            v-model="selected.payType"
            size="small"
            :placeholder="t('fields.payType')"
            class="filter-item"
            style="width: 490px; margin-bottom: 16px"
            @change="handleChangePayType()"
          >
            <el-option
              v-for="item in payTypeList.list"
              :key="item.id"
              :label="item.code"
              :value="item.code"
            />
          </el-select>
          <!-- <el-select
            v-model="form.payType"
            :placeholder="t('fields.payType')"
            style="width: 350px"
            filterable
            default-first-option
            @focus="loadPayTypes"
          >
            <el-option
              v-for="item in payTypeList.list"
              :key="item.id"
              :label="item.code"
              :value="item.code"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :rows="2"
            type="textarea"
            :placeholder="t('fields.pleaseInput')"
            style="width: 490px"
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
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      @selection-change="handleSelectionChange"
      :empty-text="t('fields.noData')"
    >
      <el-table-column type="selection" v-if="!hasRole(['SUB_TENANT'])" />
      <el-table-column prop="bankName" :label="t('fields.bankName')" />
      <el-table-column prop="identifyCode" :label="t('fields.identifyCode')" />
      <el-table-column prop="cardNumber" :label="t('fields.cardNumber')" />
      <el-table-column prop="cardAccount" :label="t('fields.cardAccount')" />
      <el-table-column prop="siteName" :label="t('fields.site')" />
      <el-table-column prop="status" :label="t('fields.status')" v-if="hasPermission(['sys:bank-card:update:state'])">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeBankStatus(scope.row.id, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.action')" v-if="hasPermission(['sys:bank-card:update'])">
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            @click="showEdit(scope.row)"
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import {
  checkUniqueIdentityCode,
  createBankCard,
  deleteBankCard,
  getBankCardList,
  updateBankCard,
  updateBankCardStatus,
} from '../../../../api/bank-card'
import { getBankInfoListSimple } from '../../../../api/bank-info'
import { getCurrencyNames } from '../../../../api/currency'
import { getFinancialLevels } from '../../../../api/financial-level'
import { getSiteListSimple } from '../../../../api/site'
import { required } from '../../../../utils/validate'
import { hasRole, hasPermission } from '../../../../utils/util'
import { getActivePaymentTypes } from '../../../../api/payment-type'
import { useStore } from '../../../../store';
import { TENANT } from "../../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const bankForm = ref(null)

const selected = reactive({ financialLevel: [], selectedPayType: [] })

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  status: [
    { key: 1, displayName: 'Inactive', value: false },
    { key: 2, displayName: 'Active', value: true },
  ],
  type: [
    { key: 1, displayName: 'Both', value: 'BOTH' },
    { key: 2, displayName: 'Deposit', value: 'DEPOSIT' },
    { key: 2, displayName: 'Withdraw', value: 'WITHDRAW' },
  ],
  changingBank: false,
  changingCurrency: false,
  changingSite: false
})

const request = reactive({
  size: 30,
  current: 1,
  name: null,
  code: null,
  siteId: null,
})

const form = reactive({
  id: null,
  identifyCode: null,
  currencyId: null,
  siteId: null,
  financialLevel: null,
  bankId: null,
  cardNumber: null,
  cardAccount: null,
  cardAddress: null,
  status: true,
  type: null,
  remark: null,
  payTypes: null,
})

const validateCode = ref(null)
let originalIdentifyCode = ''

const formRules = reactive({
  identifyCode: [required(t('message.validateIdentifyCodeRequired'))],
  currencyId: [required(t('message.validateCurrencyRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
  financialLevel: [required(t('message.validateFinancialLevelRequired'))],
  bankId: [required(t('message.validateBankNameRequired'))],
  cardNumber: [required(t('message.validateCardNumberRequired'))],
  cardAccount: [required(t('message.validateCardAccountRequired'))],
  cardAddress: [required(t('message.validateCardAddressRequired'))],
  status: [required(t('message.validateStatusRequired'))],
})

const page = reactive({
  pages: 0,
  records: [],
})

const list = reactive({
  currencies: [],
  site: [],
  bankInfo: [],
  financialLevel: [],
})

const payTypeList = reactive({
  list: [],
})

let chooseCard = []

function resetQuery() {
  request.name = null
  request.code = null
  request.siteId = site.value ? site.value.id : null
}

function changePage(page) {
  request.current = page
  loadBankCard()
}

function handleSelectionChange(val) {
  chooseCard = val
  if (chooseCard.length === 0) {
    uiControl.removeBtn = true
  } else if (chooseCard.length === 1) {
    uiControl.removeBtn = false
  } else {
    uiControl.removeBtn = false
  }
}

function handleChangeFinancialGroup() {
  form.financialLevel = selected.financialLevel.join(',')
}

function handleChangePayType() {
  form.payTypes = selected.payType.join(',')
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (bankForm.value) {
      bankForm.value.resetFields()
      form.id = null
      validateCode.value = null
      originalIdentifyCode = ''
    }
    selected.financialLevel = []
    selected.payType = []
    uiControl.dialogTitle = t('fields.addBankCard')
  } else {
    uiControl.dialogTitle = t('fields.editBankCard')
    selected.financialLevel = []
    selected.payType = []
    if (bankForm.value) {
      bankForm.value.resetFields()
      validateCode.value = null
    }
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(banner) {
  showDialog('EDIT')

  nextTick(() => {
    for (const key in banner) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = banner[key]
      }
    }
    originalIdentifyCode = form.identifyCode
    if (form.financialLevel !== null) {
      const arr = form.financialLevel.slice(1).split(',')
      arr.forEach(element => {
        selected.financialLevel.push(Number(element))
      })
    }
    if (form.payTypes !== null) {
      const arr = form.payTypes.split(',')
      arr.forEach(element => {
        selected.payType.push(element)
      })
    }
  })
}

async function loadBankCard() {
  const { data: ret } = await getBankCardList(request)
  page.pages = ret.pages
  page.records = ret.records
}

async function changeBankStatus(id, state) {
  await updateBankCardStatus(id, state)
}

function create() {
  bankForm.value.validate(async valid => {
    if (valid) {
      form.financialLevel = ',' + form.financialLevel
      await createBankCard(form)
      uiControl.dialogVisible = false
      await loadBankCard()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  bankForm.value.validate(async valid => {
    if (valid) {
      form.financialLevel = ',' + form.financialLevel
      await updateBankCard(form)
      uiControl.dialogVisible = false
      await loadBankCard()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function removeCard(card) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    if (card) {
      await deleteBankCard([card.id])
    } else {
      await deleteBankCard(chooseCard.map(u => u.id))
    }
    await loadBankCard()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

async function checkUnique(e) {
  if (originalIdentifyCode !== form.identifyCode) {
    const codeInput = e.target.value
    if (codeInput !== '') {
      const { data: ret } = await checkUniqueIdentityCode(codeInput)
      validateCode.value = ret
    }
  } else {
    validateCode.value = null
  }
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else {
    edit()
  }
}
async function loadCurrency() {
  const { data: ret } = await getCurrencyNames()
  list.currencies = ret
}

async function loadSite() {
  const { data: ret } = await getSiteListSimple()
  list.site = ret
}

async function loadBank() {
  const { data: ret } = await getBankInfoListSimple()
  list.bankInfo = ret
}

async function loadFinancialLevel() {
  const { data: ret } = await getFinancialLevels({ siteId: form.siteId })
  list.financialLevel = ret
}

async function loadPayTypes() {
  const { data: payType } = await getActivePaymentTypes()
  payTypeList.list = payType
}

async function resetFinancialLevel() {
  selected.financialLevel = null;
  form.financialLevel = null;
  await loadFinancialLevel();
}

async function bankChange() {
  uiControl.changingBank = true;
  await loadCurrency();
  await loadSite();
  if (form.bankId !== null && form.bankId !== "") {
    const bankInfo = list.bankInfo.filter(bank => bank.id === form.bankId);
    list.currencies = list.currencies.filter(currency => bankInfo[0].currencyIds.includes(currency.id));
    const siteList = ref([]);
    list.currencies.forEach(c => list.site.forEach(s => {
      if (s.currency.includes(c.currencyCode)) {
        siteList.value.push(s);
      }
    }));
    list.site = siteList.value;
  } else {
    if (form.currencyId !== null && form.currencyId !== "") {
      await currencyChange();
    }
    if (form.siteId !== null && form.siteId !== "") {
      await siteChange();
    }
  }
  uiControl.changingBank = false;
}

async function currencyChange() {
  uiControl.changingCurrency = true;
  await loadBank();
  await loadSite();
  if (form.currencyId !== null && form.currencyId !== "") {
    list.bankInfo = list.bankInfo.filter(bank => bank.currencyIds.includes(form.currencyId));
    const selectedCurrency = list.currencies.filter(c => c.id === form.currencyId);
    list.site = list.site.filter(s => s.currency.includes(selectedCurrency[0].currencyCode));
    let isSelectedSite = false;
    list.site.forEach(s => {
      if (s.id === form.siteId) {
        isSelectedSite = true;
      }
    });
    if (!isSelectedSite) {
      form.siteId = null;
      await resetFinancialLevel();
    }
  } else {
    if (form.bankId !== null && form.bankId !== "") {
      await bankChange();
    }
    if (form.siteId !== null && form.siteId !== "") {
      await siteChange();
    }
  }
  uiControl.changingCurrency = false;
}

async function siteChange() {
  await resetFinancialLevel();
  uiControl.changingSite = true;
  await loadBank();
  await loadCurrency();
  if (form.siteId !== null && form.siteId !== "") {
    const siteInfo = list.site.filter(s => s.id === form.siteId);
    list.currencies = list.currencies.filter(currency => siteInfo[0].currency.includes(currency.currencyCode));
    const bankList = ref([]);
    list.currencies.forEach(c => list.bankInfo.forEach(b => {
      if (b.currencyIds.includes(c.id)) {
        bankList.value.push(b);
      }
    }));
    list.bankInfo = bankList.value;
  } else {
    if (form.bankId !== null && form.bankId !== "") {
      await bankChange();
    }
    if (form.currencyId !== null && form.currencyId !== "") {
      await currencyChange();
    }
  }
  uiControl.changingSite = false;
}

onMounted(async() => {
  await loadSite()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = list.site.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  await loadBankCard()
  await loadCurrency()
  await loadBank()
  await loadFinancialLevel()
  await loadPayTypes()
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

i.el-icon-circle-check {
  color: green;
  margin-left: 5px;
}

i.el-icon-circle-close {
  color: red;
  margin-left: 5px;
}
</style>
