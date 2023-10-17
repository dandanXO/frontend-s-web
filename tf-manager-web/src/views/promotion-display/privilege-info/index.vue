<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.name')"
        />
        <el-input
          v-model="request.code"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.code')"
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
          @click="loadPrivilegeInfo"
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
          v-permission="['sys:privilege:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
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
        ref="privilegeInfoForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.name')" prop="name">
          <el-input v-model="form.name" style="width: 450px" maxlength="100" />
        </el-form-item>
        <el-form-item :label="t('fields.alias')" prop="alias">
          <el-input v-model="form.alias" style="width: 450px" maxlength="100" />
        </el-form-item>
        <el-form-item :label="t('fields.code')" prop="code">
          <el-input v-model="form.code" style="width: 450px" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 450px"
            default-first-option
            @focus="loadSites"
            @change="getVipBySiteId"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-row>
          <el-col>
            <el-form-item :label="t('fields.startTime')" prop="startTime">
              <el-date-picker
                type="date"
                value-format="YYYY-MM-DD"
                v-model="form.startTime"
                style="width: 145px"
                :disabled-date="disabledStartDate"
              />
            </el-form-item>
            <el-form-item :label="t('fields.endTime')" prop="endTime">
              <el-date-picker
                type="date"
                value-format="YYYY-MM-DD"
                v-model="form.endTime"
                style="width: 145px"
                :disabled-date="disabledEndDate"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="t('fields.frequency')" prop="frequency">
          <el-select
            v-model="form.frequency"
            style="width: 250px"
            filterable
            default-first-option
          >
            <el-option
              v-for="f in uiControl.frequency"
              :key="f.key"
              :label="f.displayName"
              :value="f.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.bonusType')" prop="bonusType">
          <el-radio-group v-model="form.bonusType">
            <el-radio
              v-for="b in uiControl.bonusType"
              :key="b.key"
              :label="b.value"
            >
              {{ b.displayName }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col>
            <el-form-item :label="t('fields.bonusAmount')" prop="bonusAmount">
              <span v-if="form.bonusType === 'FIXED'">
                $
                <el-input-number
                  v-model="form.bonusAmount"
                  style="width: 135px"
                  :min="1"
                  :max="999999999999999"
                  :controls="false"
                  @keypress="restrictInput($event)"
                />
              </span>
              <span v-if="form.bonusType === 'RATIO'">
                <el-input
                  v-model="form.bonusAmountRatio"
                  style="width: 135px"
                  :maxlength="uiControl.bonusAmountRatioMax"
                  @keypress="restrictDecimalInput($event)"
                />
                %
              </span>
            </el-form-item>
            <el-form-item :label="t('fields.rollover')" prop="rollover">
              <el-input-number
                v-model="form.rollover"
                style="width: 145px"
                :min="1"
                :max="100"
                :controls="false"
                @keypress="restrictInput($event)"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item :label="t('fields.slotRollover')" prop="slotRollover">
              <el-input-number
                v-model="form.slotRollover"
                style="width: 145px"
                :min="0"
                :max="100"
                :controls="false"
                @keypress="restrictInput($event)"
              />
            </el-form-item>
            <el-form-item :label="t('fields.sportsRollover')" prop="sportsRollover">
              <el-input-number
                v-model="form.sportsRollover"
                style="width: 145px"
                :min="0"
                :max="100"
                :controls="false"
                @keypress="restrictInput($event)"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item :label="t('fields.liveRollover')" prop="liveRollover">
              <el-input-number
                v-model="form.liveRollover"
                style="width: 145px"
                :min="0"
                :max="100"
                :controls="false"
                @keypress="restrictInput($event)"
              />
            </el-form-item>
            <el-form-item :label="t('fields.minBalance')" prop="minBalance">
              <el-input-number
                v-model="form.minBalance"
                style="width: 145px"
                :min="0"
                :controls="false"
                @keypress="restrictInput($event)"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item :label="t('fields.minDeposit')" prop="depositMin">
              $
              <el-input-number
                v-model="form.depositMin"
                style="width: 135px"
                :min="1"
                :controls="false"
                @keypress="restrictInput($event)"
              />
            </el-form-item>
            <el-form-item :label="t('fields.maxBonus')" prop="bonusMax">
              $
              <el-input-number
                v-model="form.bonusMax"
                style="width: 135px"
                :controls="false"
                @keypress="restrictInput($event)"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="t('fields.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="c in uiControl.status"
              :label="c.value"
              :key="c.key"
              v-model="form.status"
            >
              {{ c.displayName }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="VIP" prop="vips">
          <el-checkbox-group
            v-model="selectedVIPs.vipChecked"
            @change="handleCheckedChange('VIP')"
            style="width: 300px"
          >
            <el-checkbox v-for="v in vipList.list" :label="v.id" :key="v.id">
              {{ v.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="t('fields.paymentType')" prop="payTypes">
          <el-checkbox-group
            v-model="selectedPayTypes.payTypeChecked"
            @change="handleCheckedChange('PAYTYPE')"
          >
            <el-checkbox
              v-for="p in paymentTypeList.list"
              :label="p.code"
              :key="p.id"
            >
              {{ p.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="t('fields.triggerType')" prop="triggerType">
          <el-select
            v-model="form.triggerType"
            style="width: 450px"
            filterable
            default-first-option
            @change="onChange($event)"
          >
            <el-option
              v-for="tt in uiControl.triggerType"
              :key="tt.key"
              :label="tt.displayName"
              :value="tt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.pgroup')" prop="pgroup" v-if="uiControl.pgroup">
          <el-input v-model="form.pgroup" style="width: 450px" maxlength="100" />
        </el-form-item>
        <el-form-item :label="t('fields.param')" prop="param">
          <el-input
            type="textarea"
            v-model="form.param"
            :rows="20"
            style="width: 350px; white-space: pre-line"
            placeholder="{'abc':'xyz'}"
            @change="json"
          />
        </el-form-item>
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input
            type="textarea"
            v-model="form.remark"
            :rows="6"
            style="width: 350px;"
            maxlength="500"
            show-word-limit
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
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="name" :label="t('fields.name')" width="200" />
      <el-table-column prop="alias" :label="t('fields.alias')" width="200" />
      <el-table-column prop="bonusType" :label="t('fields.bonusType')" width="150">
        <template #default="scope">
          <span v-for="b in uiControl.bonusType" :key="b.key">
            <span v-if="scope.row.bonusType === b.value">
              {{ b.displayName }}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="bonusAmount" :label="t('fields.bonusAmount')" width="150">
        <template #default="scope">
          <span v-if="scope.row.bonusType === 'FIXED'">
            $
            <!-- eslint-disable -->
            <span
              v-formatter="{ data: scope.row.bonusAmount, type: 'money' }"
            />
          </span>
          <span v-if="scope.row.bonusType === 'RATIO'">
            {{ scope.row.bonusAmount * 100 }} %
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="frequency" :label="t('fields.frequency')" width="150">
        <template #default="scope">
          <span v-for="f in uiControl.frequency" :key="f.key">
            <span v-if="scope.row.frequency === f.value">
              {{ f.displayName }}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="t('fields.status')" width="150">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'OPEN'" type="success">
            {{ scope.row.status }}
          </el-tag>
          <el-tag v-if="scope.row.status === 'CLOSE'" type="danger">
            {{ scope.row.status }}
          </el-tag>
          <el-tag v-if="scope.row.status === 'TEST'">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="site" :label="t('fields.site')" width="120" />
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" />
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        v-if="hasPermission(['sys:privilege:update'])"
      >
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
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import { required } from '../../../utils/validate'
import { ElMessage } from 'element-plus'
import {
  createPrivilegeInfo,
  updatePrivilegeInfo,
  getPrivilegeInfo,
} from '../../../api/privilege-info'
import { getVipList } from '../../../api/vip'
import { getActivePaymentTypes } from '../../../api/payment-type'
import { getSiteListSimple } from '../../../api/site'
import { hasPermission } from '../../../utils/util'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const privilegeInfoForm = ref(null)
const siteList = reactive({
  list: [],
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  frequency: [
    { key: 1, displayName: 'Everytime', value: 'EVERYTIME' },
    { key: 2, displayName: 'Daily', value: 'DAILY' },
    { key: 3, displayName: 'Weekly', value: 'WEEKLY' },
    { key: 4, displayName: 'Monthly', value: 'MONTHLY' },
    { key: 5, displayName: 'Yearly', value: 'YEARLY' },
    { key: 6, displayName: 'Only Once', value: 'ONLYONE' },
  ],
  bonusType: [
    { key: 1, displayName: 'Fixed', value: 'FIXED' },
    { key: 2, displayName: 'Ratio', value: 'RATIO' },
  ],
  triggerType: [
    { key: 1, displayName: 'Deposit', value: 'DEPOSITBONUSES' },
    { key: 2, displayName: 'Manual', value: 'MANUAL' },
    { key: 3, displayName: 'Free', value: 'FREE' },
    { key: 4, displayName: 'Other', value: 'OTHER' },
    { key: 5, displayName: 'Time', value: 'TIME' },
    { key: 6, displayName: 'Multiple', value: 'MULTIPLE' },
    { key: 7, displayName: 'PGroup', value: 'PGROUP' },
  ],
  status: [
    { key: 1, displayName: 'Open', value: 'OPEN' },
    { key: 2, displayName: 'Close', value: 'CLOSE' },
    { key: 3, displayName: 'Test', value: 'TEST' },
  ],
  bonusAmountRatioMax: 15,
  pgroup: false,
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
  code: null,
  status: null,
  siteId: null,
})

const form = reactive({
  id: null,
  name: null,
  code: null,
  status: 'OPEN',
  frequency: null,
  startTime: null,
  endTime: null,
  rollover: null,
  slotRollover: null,
  sportsRollover: null,
  liveRollover: null,
  minBalance: null,
  bonusType: null,
  bonusAmount: null,
  bonusAmountRatio: null,
  triggerType: null,
  vips: null,
  payTypes: null,
  depositMin: null,
  bonusMax: null,
  siteId: null,
  param: null,
  remark: null,
  pgroup: null,
})

const formRules = reactive({
  name: [required(t('message.validateNameRequired'))],
  code: [required(t('message.validateCodeRequired'))],
  status: [required(t('message.validateStatusRequired'))],
  frequency: [required(t('message.validateFrequencyRequired'))],
  startTime: [required(t('message.validateStartTimeRequired'))],
  endTime: [required(t('message.validateEndTimeRequired'))],
  rollover: [required(t('message.validateRolloverRequired'))],
  bonusType: [required(t('message.validateBonusTypeRequired'))],
  bonusAmount: [required(t('message.validateBonusAmountRequired'))],
  bonusAmountRatio: [required(t('message.validateBonusAmountRatioRequired'))],
  triggerType: [required(t('message.validateTriggerTypeRequired'))],
  vips: [required(t('message.validateVIPRequired'))],
  payTypes: [required(t('message.validatePayTypeRequired'))],
  depositMin: [required(t('message.validateMinDepositRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
})

const vipList = reactive({
  list: [],
})
const paymentTypeList = reactive({
  list: [],
})

const selectedVIPs = reactive({ vipChecked: [] })
const selectedPayTypes = reactive({ payTypeChecked: [] })

function disabledStartDate(time) {
  if (form.endTime !== null) {
    const changedDate = form.endTime.replace(/(..)\/(..)\/(....)/, '$3-$2-$1')
    var date = new Date(changedDate)
    return (
      time.getTime() <= moment(Date.now()).subtract(1, 'days') ||
      time.getTime() >= moment(date).subtract(1, 'days')
    )
  }
  return time.getTime() <= moment(Date.now()).subtract(1, 'days')
}

function disabledEndDate(time) {
  if (form.startTime !== null) {
    const changedDate = form.startTime.replace(/(..)\/(..)\/(....)/, '$3-$2-$1')
    var date = new Date(changedDate)
    return time.getTime() <= date.getTime()
  }
  return time.getTime() <= Date.now()
}

function resetQuery() {
  request.name = null
  request.code = null
  request.status = null
  request.siteId = site.value ? site.value.id : null
}

function handleCheckedChange(type) {
  if (type === 'VIP') {
    form.vips = JSON.stringify(selectedVIPs.vipChecked.join(','))
  } else if (type === 'PAYTYPE') {
    form.payTypes = JSON.stringify(selectedPayTypes.payTypeChecked.join(','))
  }
}

async function getVipBySiteId(siteId) {
  await loadVips()
  vipList.list = vipList.list.filter(vip => vip.siteId === siteId)
}

async function loadPrivilegeInfo() {
  page.loading = true
  const { data: ret } = await getPrivilegeInfo(request)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

async function loadVips() {
  const { data: vip } = await getVipList()
  vipList.list = vip
}

async function loadActivePaymentType() {
  const { data: type } = await getActivePaymentTypes()
  paymentTypeList.list = type
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function changePage(page) {
  request.current = page
  loadPrivilegeInfo()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (privilegeInfoForm.value) {
      privilegeInfoForm.value.resetFields()
      selectedVIPs.vipChecked = []
      selectedPayTypes.payTypeChecked = []
    }
    form.frequency = uiControl.frequency[0].value
    form.bonusType = uiControl.bonusType[0].value
    form.triggerType = uiControl.triggerType[0].value
    form.siteId = siteList.list[0].id
    getVipBySiteId(form.siteId)
    uiControl.pgroup = false;
    uiControl.dialogTitle = t('fields.addPrivilegeInfo')
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editPrivilegeInfo')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

async function showEdit(privilegeInfo) {
  selectedVIPs.vipChecked = []
  selectedPayTypes.payTypeChecked = []
  showDialog('EDIT')
  await getVipBySiteId(privilegeInfo.siteId)
  await nextTick(() => {
    for (const key in privilegeInfo) {
      if (Object.keys(form).find(k => k === key)) {
        if (key === 'startTime' || key === 'endTime') {
          form[key] = String(privilegeInfo[key]).slice(0, 10)
        } else if (
          privilegeInfo.bonusType === 'RATIO' &&
          key === 'bonusAmount'
        ) {
          form.bonusAmountRatio = privilegeInfo[key] * 100
          form.bonusAmount = 1
        } else if (
          privilegeInfo.bonusType === 'FIXED' &&
          key === 'bonusAmount'
        ) {
          form[key] = privilegeInfo[key]
          form.bonusAmountRatio = 1
        } else {
          form[key] = privilegeInfo[key]
        }
      }
    }

    if (privilegeInfo.triggerType === 'PGROUP') {
      uiControl.pgroup = true;
    } else {
      uiControl.pgroup = false;
    }

    const vipArr = JSON.parse(JSON.stringify(form.vips)).split(',')
    vipArr.forEach(element => {
      selectedVIPs.vipChecked.push(parseInt(element))
    })

    const payTypeArr = JSON.parse(JSON.stringify(form.payTypes)).split(',')
    payTypeArr.forEach(element => {
      selectedPayTypes.payTypeChecked.push(element)
    })
  })
}

/**
 * 新增公告
 */
function create() {
  privilegeInfoForm.value.validate(async valid => {
    if (valid) {
      if (form.bonusType === 'RATIO') {
        form.bonusAmount = form.bonusAmountRatio / 100
      }
      form.vips = form.vips.replace(/['"]+/g, '')
      form.payTypes = form.payTypes.replace(/['"]+/g, '')
      await createPrivilegeInfo(form)
      uiControl.dialogVisible = false
      await loadPrivilegeInfo()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

/**
 * 编辑公告
 */
function edit() {
  privilegeInfoForm.value.validate(async valid => {
    if (valid) {
      if (form.bonusType === 'RATIO') {
        form.bonusAmount = form.bonusAmountRatio / 100
      }
      form.vips = form.vips.replace(/['"]+/g, '')
      form.payTypes = form.payTypes.replace(/['"]+/g, '')
      await updatePrivilegeInfo(form)
      uiControl.dialogVisible = false
      await loadPrivilegeInfo()
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

function restrictInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
}

function restrictDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (
    (charCode < 48 || charCode > 57) &&
    charCode !== 46 &&
    form.bonusAmountRatio.toString().indexOf('.') > -1
  ) {
    event.preventDefault()
  }

  if (
    form.bonusAmountRatio !== null &&
    form.bonusAmountRatio.toString().indexOf('.') > -1
  ) {
    if (form.bonusAmountRatio.split('.')[1].length > 1) {
      event.preventDefault()
    }
    uiControl.bonusAmountRatioMax = 16
  } else {
    uiControl.bonusAmountRatioMax = 15
  }
}

function json() {
  if (form.param) {
    nextTick(() => {
      form.param = JSON.stringify(JSON.parse(form.param), null, '\t')
    })
  }
}

function onChange(e) {
  if (e === 'PGROUP') {
    uiControl.pgroup = true;
  } else {
    uiControl.pgroup = false;
  }
}

onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  await loadPrivilegeInfo()
  await loadActivePaymentType()
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
