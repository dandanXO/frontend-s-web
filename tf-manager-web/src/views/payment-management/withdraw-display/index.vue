<template>
  <div>
    <el-drawer
      :title="t('fields.switchPayment')"
      v-model="uiControl.searchDialogVisible"
      direction="rtl"
      size="40%"
    >
      <el-card class="search-card">
        <div class="clearfix">
          <span>{{ t('fields.way') }}</span>
        </div>
        <el-switch
          v-model="searchCondition.way"
          active-text="WEB"
          active-value="WEB"
          active-color="#13ce66"
          inactive-text="MOBILE"
          inactive-color="rgb(13 79 229)"
          inactive-value="MOBILE"
        />
      </el-card>
      <el-card class="search-card">
        <div class="clearfix">
          <span>{{ t('fields.site') }}</span>
        </div>
        <el-radio-group
          v-model="searchCondition.siteId"
          @change="handleSiteNameCheckedChange"
        >
          <el-radio v-for="c in page.sites" :label="c.id" :key="c.id">
            {{ c.siteName }}
          </el-radio>
        </el-radio-group>
      </el-card>
      <el-card class="search-card">
        <div class="clearfix">
          <span>{{ t('fields.financialLevel') }}</span>
        </div>
        <el-radio-group v-model="searchCondition.financialLevel">
          <el-radio v-for="c in page.financials" :label="c.level" :key="c.id">
            {{ c.name }}
          </el-radio>
        </el-radio-group>
      </el-card>
      <el-card class="search-card">
        <el-button
          type="primary"
          @click="loadPayments"
          :disabled="uiControl.dialogEditBtn"
        >
          {{ t('fields.switch') }}
        </el-button>
      </el-card>
    </el-drawer>
    <div class="body-container">
      <el-card class="display-area" shadow="never">
        <template #header>
          <div class="card-header">
            <el-row type="flex" class="row-bg" align="center">
              <el-col :span="16">
                <span>{{ t('fields.withdrawArea') }}</span>
              </el-col>
              <el-col :span="8" align="right">
                <!-- <el-button
                  type="success"
                  v-permission="['sys:payment:show:update']"
                  @click="updateWithdrawShowBtn"
                >
                  Update
                </el-button> -->
                <el-button
                  type="primary"
                  @click="uiControl.searchDialogVisible = true"
                >
                  {{ t('fields.switch') }}
                </el-button>
              </el-col>
            </el-row>
            <el-tag-group>
              <span style="font-size: 12px; margin-right: 10px">
                {{ t('fields.searchCondition') }}:
              </span>
              <el-tag>{{ t('fields.way') + ': ' + selectedCondition.way }}</el-tag>
              <el-tag>{{ t('fields.site') + ': ' + selectedCondition.siteName }}</el-tag>
              <el-tag>
                {{ t('fields.financialLevel') + ': ' + selectedCondition.financialLevel }}
              </el-tag>
            </el-tag-group>
          </div>

          <span style="font-size: 12px; margin-right: 10px;">{{ t('fields.copyToOtherLevel') }}: </span>
          <el-select
            multiple
            filterable
            allow-create
            default-first-option
            :reserve-keyword="false"
            v-model="copy.selectedLevel"
            size="small"
            :placeholder="t('fields.financialLevel')"
            class="filter-item"
            style="width: 400px; margin-bottom: 16px;margin-top:20px"
          >
            <el-option
              v-for="item in copy.financials"
              :key="item.level"
              :label="item.name"
              :value="item.level"
            />
          </el-select>

          <el-button
            type="danger"
            @click="copyLevel"
            size="mini"
            style="margin-left:10px"
            v-permission="['sys:payment:show:copy']"
          >
            {{ t('fields.startCopy') }}
          </el-button>

        </template>
        <div class="container">
          <el-button
            class="add"
            icon="el-icon-plus"
            size="mini"
            type="primary"
            @click="showDialog('CREATE')"
            v-permission="['sys:withdraw:show:add']"
          />
          <div
            class="node"
            v-if="page.paymentShowNodes && page.paymentShowNodes.length !== 0"
          >
            <div class="node-content">
              <div
                class="node-item"
                :key="i"
                v-for="(item, i) in page.paymentShowNodes"
              >
                <!-- <div
          :class="{ before: item.dragtype === 1, after: item.dragtype === 2 }"
        ></div> -->
                <!-- <div class="node-item-border"> -->
                <el-row :gutter="10" justify="space-between" align="middle">
                  <el-col :span="6" style="position: relative">
                    <!-- eslint-disable -->
                    <img
                      v-if="item.icon === 'OFFLINE' || item.icon === 'test'"
                      :src="paymethodicon + '/000/fff.png&text=payment'"
                    />
                    <!-- <el-empty
              image="http://149.28.155.235:9999/6f3ec696-4f82-4866-a427-22676659db3b.png"
            /> -->
                    <img v-else :src="paymethodicon + '/withdraw/' + item.icon" />
                  </el-col>
                  <el-col :span="12">
                    <div class="node-text">
                      <div class="payment-node">
                        <div>{{ t('fields.name') }}: {{ item.name }}</div>
                        <div>{{ t('fields.code') }}: {{ item.code }}</div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="6" class="icons">
                    <i
                      class="el-icon-edit"
                      size="mini"
                      type="success"
                      @click.stop="editHandle(item)"
                      v-permission="['sys:withdraw:show:update']"
                    />
                    <i
                      class="el-icon-remove"
                      size="mini"
                      type="danger"
                      @click.stop="deleteItem(item, i, idx)"
                      v-permission="['sys:withdraw:show:del']"
                    />
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      width="40%"
    >
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="ruleFormRules"
        status-icon
        label-width="100px"
      >
        <el-form-item :label="t('fields.name')" prop="name" required>
          <el-input v-model="ruleForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('fields.code')" prop="code" required>
          <!-- <el-input v-model="ruleForm.code" autocomplete="off" /> -->
          <el-select
            filterable
            clearable
            v-model="ruleForm.code"
            size="small"
            :placeholder="t('fields.pleaseChoose')"
            class="filter-item"
            style="width: 200px; margin-bottom: 16px"
          >
            <el-option
              v-for="item in list.filteredPayTypes"
              :key="item.id"
              :label="item.code"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.icon')" prop="icon" required>
          <el-row :gutter="24">
            <el-col :span="18">
              <el-input v-model="ruleForm.icon" autocomplete="off" />
            </el-col>
            <el-col :span="6">
              <!-- eslint-disable -->
              <input
                id="uploadFile"
                type="file"
                ref="input"
                style="display: none"
                accept="image/*"
                @change="attachPhoto($event)"
              />
              <el-button
                style="display: block"
                icon="el-icon-upload"
                size="mini"
                type="success"
                @click="$refs.input.click()"
              >
                {{ t('fields.upload') }}
              </el-button>
            </el-col>
          </el-row>
          <!-- <el-input v-model.number="ruleForm.icon" autocomplete="off" /> -->
        </el-form-item>
        <el-form-item :label="t('fields.currency')" prop="currencyId">
          <el-select
            clearable
            v-model="ruleForm.currencyId"
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
        <el-form-item :label="t('fields.sequence')" prop="sequence">
          <el-input-number
            v-model="ruleForm.sequence"
            :min="1"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit(item)">{{ t('fields.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { notEmpty } from '../../../utils/common'
import {
  createWithdrawShow,
  deleteWithdrawShow,
  getWithdrawShow,
  updateWithdrawShow, copyWithdrawShow,
} from '../../../api/withdraw-display'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSiteListSimple } from '../../../api/site'
import { getFinancialLevels } from '../../../api/financial-level'
import { getActivePaymentTypes } from '../../../api/payment-type'
import { uploadImage } from '../../../api/image'
import { required } from '../../../utils/validate'
import { getCurrencyNames } from '../../../api/currency'
import { useStore } from '../../../store'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const paymethodicon = process.env.VUE_APP_IMAGE
const store = useStore()
const LOGIN_USER_SITEID = computed(() => store.state.user.siteId)

const ruleFormRef = ref(null)
const ruleForm = reactive({
  id: null,
  name: null,
  code: null,
  icon: null,
  sequence: null,
  currencyId: null,
  selected: []
})

const ruleFormRules = reactive({
  name: [required(t('message.validateNameRequired'))],
  code: [required(t('message.validateCodeRequired'))],
  icon: [required(t('message.validateIconRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
  currencyId: [required(t('message.validateCurrencyRequired'))],
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogLoading: false,
  searchDialogVisible: false,
})

const page = reactive({
  paymentRecords: [],
  originPaymentRecords: [],
  paymentShowNodes: [],
  loading: false,
  sites: [],
  financials: [],
})
const searchCondition = reactive({
  way: 'WEB',
  siteId: 1,
  financialLevel: 1,
})

const copy = reactive({
  selectedLevel: [],
  financials: []
});

const list = reactive({
  currencies: [],
  payTypes: [],
  filteredPayTypes: [],
  siteCurrencyIds: [],
})

const paymentNameFilter = ref(null)

const selectedCondition = reactive({
  way: 'WEB',
  site: page.sites,
  financialLevel: 1,
})

function getSelectedSearchCondition() {
  selectedCondition.way = searchCondition.way
  page.sites.forEach(element => {
    if (searchCondition.siteId === element.id) {
      selectedCondition.siteName = element.siteName
    }
  })
  page.financials.forEach(element => {
    if (searchCondition.financialLevel === element.level) {
      selectedCondition.financialLevel = element.name
    }
  })
}

function paymentSearch() {
  if (notEmpty(paymentNameFilter.value)) {
    page.paymentRecords = page.originPaymentRecords.filter(x => {
      const words = paymentNameFilter.value.toLowerCase().trim().split(/\s+/)
      for (let i = 0; i < words.length; i++) {
        const w = words[i]
        if (
          (x.name && x.name.toLowerCase().indexOf(w) >= 0) ||
          (x.currencyName && x.currencyName.toLowerCase().indexOf(w) >= 0)
        ) {
          return true
        }
      }
      return false
    })
  } else {
    page.paymentRecords = page.originPaymentRecords
  }
}

function showDialog(type) {
  if (type === 'CREATE') {
    uiControl.dialogTitle = t('fields.add')
    if (ruleFormRef.value) {
      ruleFormRef.value.resetFields()
      ruleForm.id = null
    }
  } else {
    uiControl.dialogTitle = t('fields.edit')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function submit(value) {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  }
}

/**
 * 新增withdraw show
 */
function create() {
  console.log(ruleForm)
  ruleForm.financialLevel = searchCondition.financialLevel
  ruleForm.siteId = searchCondition.siteId
  ruleForm.way = searchCondition.way
  ruleFormRef.value.validate(async valid => {
    if (valid) {
      await createWithdrawShow(ruleForm)
      uiControl.dialogVisible = false
      await loadPayments()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

/**
 * 编辑withdraw show
 */
function edit() {
  ruleForm.financialLevel = searchCondition.financialLevel
  ruleForm.siteId = searchCondition.siteId
  ruleForm.way = searchCondition.way
  ruleFormRef.value.validate(async valid => {
    if (valid) {
      await updateWithdrawShow(ruleForm)
      uiControl.dialogVisible = false
      await loadPayments()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

function copyLevel() {
  if (copy.selectedLevel.length !== 0) {
    ruleForm.financialLevel = searchCondition.financialLevel
    ruleForm.siteId = searchCondition.siteId
    ruleForm.way = searchCondition.way
    ruleForm.selected = copy.selectedLevel.toString()
    var selectedString = "";
    for (let i = 0; i < copy.selectedLevel.length; i++) {
      if (i > 0) selectedString += ", ";
      selectedString += getFinancialLevelNameByLevel(copy.selectedLevel[i]);
    }
    ElMessageBox.confirm(t('message.confirmCopy') + getFinancialLevelNameByLevel(searchCondition.financialLevel) + t('message.confirmCopyTo') + selectedString + ' ?', t('fields.notice'), {
      confirmButtonText: t('fields.copy'),
      cancelButtonText: t('fields.cancel'),
      type: 'info'
    }).then(async () => {
      await copyWithdrawShow(ruleForm)
      uiControl.dialogVisible = false
      await loadPayments()
      ElMessage({ message: t('message.updateSuccess'), type: 'success' })
    })
  } else {
    ElMessage({ message: t('message.validateCopyFinancialLevel'), type: 'error' })
  }
}

function getFinancialLevelNameByLevel(selected) {
  var totallevel = page.financials
  for (let i = 0; i < totallevel.length; i++) {
    console.log(totallevel[i].level + "/" + selected)
    if (totallevel[i].level === selected) {
      return totallevel[i].name;
    }
  }
}

function updateFinancialToCopy() {
  copy.financials = []
  copy.selectedLevel = []
  var selected = searchCondition.financialLevel;
  var totallevel = page.financials
  for (let i = 0; i < totallevel.length; i++) {
    if (totallevel[i].level !== selected) {
      copy.financials.push(totallevel[i])
    }
  }
}

// 编辑
function editHandle(node, parentIdx, idx) {
  showDialog('EDIT')
  nextTick(() => {
    for (const key in node) {
      if (Object.keys(ruleForm).find(k => k === key)) {
        ruleForm[key] = node[key]
      }
    }
  })
  console.log(ruleForm)
  this.item = node
  this.uiControl.dialogVisible = true
}
async function deleteItem(item, index) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    if (item) {
      await deleteWithdrawShow([item.id])
    }
    await loadPayments()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}
async function loadPayments() {
  page.loading = true
  const { data: nodes } = await getWithdrawShow({
    financialLevel: searchCondition.financialLevel,
    siteId: searchCondition.siteId,
    way: searchCondition.way,
  })
  page.paymentShowNodes = nodes
  page.loading = false
  paymentSearch()
  uiControl.searchDialogVisible = false
  getSelectedSearchCondition()
  updateFinancialToCopy();
}

async function attachPhoto(event) {
  const files = event.target.files[0]
  const allowFileType = ['image/jpeg', 'image/png', 'image/gif']
  const dirWithdraw = 'withdraw'

  if (!allowFileType.find(ftype => ftype.includes(files.type))) {
    ElMessage({ message: t('message.invalidFileType'), type: 'error' })
  } else {
    var formData = new FormData()
    formData.append('files', files)
    formData.append('dir', dirWithdraw)
    formData.append('overwrite', false)
    const data = await uploadImage(formData)
    if (data.code === 0) {
      ruleForm.icon = data.data
    } else {
      ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
    }
  }
}

async function loadCurrency() {
  const { data: ret } = await getCurrencyNames()
  list.currencies = ret
}

async function loadSearchConditionSite() {
  const { data: ret } = await getSiteListSimple()
  page.sites = ret
  getSelectedSearchCondition()
  loadPayTypes()
}

async function loadSearchConditionFinancial() {
  const { data: financial } = await getFinancialLevels({
    siteId: searchCondition.siteId,
  })
  page.financials = financial
  getSelectedSearchCondition()
}

async function loadPayTypes() {
  const { data: payType } = await getActivePaymentTypes()
  list.payTypes = payType
  filterPayTypeByCurrency()
}

function filterPayTypeByCurrency() {
  const currentSite = page.sites.find(s => s.id === searchCondition.siteId)
  const currencyCodeList = currentSite.currency.split(',').map(currencyName => currencyName)
  list.siteCurrencyIds = [
    ...currencyCodeList.map(currencyName => {
      const currency = list.currencies.find(c => c.currencyCode.toUpperCase() === currencyName.toUpperCase())
      return currency ? currency.id : null;
    }).filter(Boolean)
  ]
  list.filteredPayTypes = list.payTypes.filter(payTypeByCurrencyID)
}

function payTypeByCurrencyID (record) {
  if (record.currencyIds) {
    const currencyIdsList = record.currencyIds.split(',')
    return currencyIdsList.filter(currencyId => list.siteCurrencyIds.includes(parseInt(currencyId))).length > 0
  }
}

function handleSiteNameCheckedChange() {
  loadSearchConditionFinancial()
  filterPayTypeByCurrency()
}

onMounted(() => {
  if (LOGIN_USER_SITEID.value != null) {
    searchCondition.siteId = LOGIN_USER_SITEID.value
  }
  loadCurrency()
  loadPayments()
  loadSearchConditionSite()
  loadSearchConditionFinancial()
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

.body-container {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;

  .display-area {
    width: 100%;
  }

  .payment-select {
    width: 100%;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}

.clearfix {
  margin-bottom: 10px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}

.search-card {
  margin-bottom: 10px;
}

.select-node-name {
  color: green;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.tag-group {
  margin: 20px 0;
  &__title {
    margin: 0 10px 0 0;
  }
}
.tag-group.minusmargin {
  margin-top: -30px;
}
$group-color: #ee734f;
$node-color: #309799;
// .container > .node {
//   .el-button--mini.add{
//     margin-top: 0;
//   }
// }
// .container > div > .node {
//   .el-button--mini.add{
//     margin-top: 20px;
//   }
// }
.container {
  margin: -20px;
}
.container > .node:first-of-type {
  margin-top: 0;
}
.node {
  margin-top: 20px;
  // color: #fff;
  // background-color: #000;
  // padding: 10px 0px;
  .el-button--mini.add {
    float: right;
  }
  .node-content {
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
    padding: 5px 0;
    justify-content: flex-start;
    // border-bottom: 1px solid #EEEEEE;
    // box-shadow: 15px 20px 64px -57px;
    box-shadow: 1px 10px 13px -14px rgba(0, 0, 0, 0.24);
    position: relative;
    width: 100%;
  }
  .title {
    min-width: 200px;
    margin: 20px 20px 0;
    float: left;
    font-size: 25px;
    font-weight: bold;
    &.root {
      display: none;
    }
  }
  .icons {
    text-align: right;
    display: flex;
    justify-content: flex-end;
  }
  .el-icon-edit,
  .el-icon-remove {
    padding: 5px;
  }
  .el-icon-edit {
    color: $node-color;
  }
  .el-icon-remove {
    color: $node-color;
  }
  .node-item,
  .node-group {
    box-sizing: border-box;
    position: relative;
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
    position: relative;
    z-index: 2;
    display: flex;
    align-content: flex-start;
    background: #e9f4f5;
    color: $node-color;
    img {
      width: 100%;
    }
    .node-text {
      font-size: 12px;
      padding: 10px 5px;
      max-width: 200px;
      .payment-node > div:first-child,
      .group-node {
        font-size: 14px;
        font-weight: bold;
        margin: 5px 0;
      }
    }
    .node-item-border {
      display: flex;
      align-items: center;
      border: 1px solid #fff;
      padding: 5px 20px;
      border-radius: 5px;
    }
    &.before-insert {
      padding-left: 50px;
    }
    &.after-insert {
      padding-right: 50px;
    }
    &.before-insert::after {
      content: '';
      position: absolute;
      left: 0px;
      top: 0px;
      bottom: 0px;
      width: 30%;
      background-color: rgba(0, 153, 255, 0.8);
    }

    &.after-insert::after {
      content: '';
      position: absolute;
      right: 0px;
      top: 0px;
      bottom: 0px;
      width: 30%;
      background-color: rgba(0, 153, 255, 0.8);
    }
  }
  .node-item {
    &.selected {
      border: 2px solid $node-color;
      background: #ade6eb;
    }
    &.dragging {
      filter: brightness(90%);
    }
  }
  .node-group {
    margin: 15px;
    color: $group-color;
    .el-icon-edit {
      color: $group-color;
    }
    .el-icon-remove {
      color: $group-color;
    }
    &.selected {
      border: none;
      background: none;
      transition: none;
      &:before,
      &:after {
        content: '';
        background: #d88200;
        border: 1px solid #ee734f;
        color: #ffffff;
        height: 100%;
        width: 100%;
        position: absolute;
        z-index: -2;
        transition: 0.5s;
        border-radius: 5px;
      }
      &:before {
        left: -6px;
        top: -6px;
        transform: rotate(-1.5deg);
        background: #ee734f;
      }
      &:after {
        left: 0px;
        top: 0px;
        background: #ffd2c6;
      }
    }
    &:before,
    &:after {
      content: '';
      background: #fdeeea;
      color: #ffffff;
      height: 100%;
      width: 100%;
      position: absolute;
      z-index: -2;
      transition: 0.5s;
      border: 1px solid #eee;
      border-radius: 5px;
      transition: none;
    }
    &:before {
      transform: rotate(0deg);
      left: 0px;
      top: 0px;
    }
    &:after {
      transform: rotate(0deg);
      right: 0;
      top: 0px;
    }
  }
}

.add {
  margin: 10px;
}
</style>
