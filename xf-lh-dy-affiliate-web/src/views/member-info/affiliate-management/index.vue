<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('fields.downlineAffiliate') }}</span>
        </div>
      </template>
      <div class="inputs-wrap">
        <el-form @submit.prevent inline="true">
          <el-form-item :label="t('fields.registerTime') + ' :'">
            <el-date-picker
              v-model="request.regTime"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              size="normal"
              class="input-small"
              type="daterange"
              range-separator=":"
              :start-placeholder="t('fields.startDate')"
              :end-placeholder="t('fields.endDate')"
              :shortcuts="shortcuts"
              :disabled-date="disabledDate"
              :editable="false"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item :label="t('fields.loginName') + ' :'">
            <el-input
              class="input-small"
              v-model="request.loginName"
              maxlength="50"
              :placeholder="t('fields.loginName')"
              size="normal"
            />
          </el-form-item>
          <el-form-item>
            <div class="grp-btn">
              <el-button
                icon="el-icon-search"
                type="primary"
                @click="search()"
                size="normal"
              >
                {{ $t('fields.search') }}
              </el-button>
              <el-button size="normal" type="primary" plain @click="resetQuery()">
                {{ $t('fields.reset') }}
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-group">
        <el-button
          v-if="affiliateLevel !== 'AFFILIATE'"
          icon="el-icon-plus"
          size="normal"
          type="primary"
          @click="showDialog('CREATE')"
        >
          {{ $t('fields.add') }}
        </el-button>
      </div>
      <el-breadcrumb separator=" > " class="breadcrumb">
        <el-breadcrumb-item
          v-for="item in breadcrumbNameList"
          :key="item.id"
          @click="breadcrumbSearch(item.id, item.name)"
        >
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <table style="width: 98%; margin: 0 auto;" cellpadding="0" cellspacing="0" border="0" class="custom-table">
        <thead>
          <tr>
            <th>{{ t('fields.loginName') }}</th>
            <th>{{ t('fields.affiliateCode') }}</th>
            <th>{{ t('fields.affiliateLevel') }}</th>
            <th>{{ t('fields.commission') }}</th>
            <th>{{ t('fields.totalDownlineMember') }}</th>
            <th>{{ t('fields.totalDownlineAffiliate') }}</th>
            <th>{{ t('fields.affiliateStatus') }}</th>
            <th>{{ t('fields.site') }}</th>
            <th>{{ t('fields.balance') }}</th>
            <th>{{ t('fields.registerTime') }}</th>
            <th>{{ t('fields.totalDeposit') }}</th>
            <th>{{ t('fields.totalWithdraw') }}</th>
            <th>{{ t('fields.operate') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in page.records" :key="record.id">
            <td>
              <el-link type="primary" @click="searchDownline(record.id, record.loginName)">
                {{ record.loginName }}
              </el-link>
            </td>
            <td>
              <span v-if="record.affiliateCode === null">-</span>
              <span v-if="record.affiliateCode !== null">{{ record.affiliateCode }}</span>
            </td>
            <td>
              <span v-if="record.affiliateLevel === null">-</span>
              <span v-if="record.affiliateLevel !== null">{{ t('affiliate.level.' + record.affiliateLevel) }}</span>
            </td>
            <td>
              <span v-if="record.commission === null">0 %</span>
              <span v-if="record.commission !== null">{{ record.commission * 100 }} %</span>
            </td>
            <td>
              <span v-if="record.downlineMember === null">-</span>
              <span v-if="record.downlineMember !== null">{{ record.downlineMember }}</span>
            </td>
            <td>
              <span v-if="record.downlineAffiliate === null">-</span>
              <span v-if="record.downlineAffiliate !== null">{{ record.downlineAffiliate }}</span>
            </td>
            <td>
              <el-tag v-if="record.affiliateStatus === 'APPLY'" size="normal">{{ t('affiliate.status.' + record.affiliateStatus) }}</el-tag>
              <el-tag v-if="record.affiliateStatus === 'NORMAL'" type="success" size="normal">{{ t('affiliate.status.' + record.affiliateStatus) }}</el-tag>
              <el-tag v-if="record.affiliateStatus === 'DISABLE'" type="danger" size="normal">{{ t('affiliate.status.' + record.affiliateStatus) }}</el-tag>
              <el-tag v-if="record.affiliateStatus === null" type="info" size="normal">-</el-tag>
            </td>
            <td>{{ record.site }}</td>
            <td>$<span v-formatter="{data: record.balance, type: 'money'}" /></td>
            <td>
              <span v-if="record.regTime === null">-</span>
              <span v-if="record.regTime !== null" v-formatter="{data: record.regTime, formatter: 'YYYY/MM/DD HH:mm:ss', type: 'date'}" />
            </td>
            <td>$<span v-formatter="{data: record.totalDeposit, type: 'money'}" /></td>
            <td>$<span v-formatter="{data: record.totalWithdraw, type: 'money'}" /></td>
            <td>
              <el-button icon="el-icon-edit" size="normal" type="success" :disabled="breadcrumbNameList.length > 1" @click="showEdit(record)" />
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="page.records.length === 0">
        <emptyComp />
      </div>
      <el-pagination
        class="pagination"
        @current-change="changePage"
        layout="prev, pager, next"
        :page-size="request.size"
        :page-count="page.pages"
        :current-page="request.current"
      />
    </el-card>

    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        v-if="uiControl.dialogType === 'CREATE'"
        ref="createForm"
        :model="cForm"
        :rules="cFormRules"
        :inline="true"
        size="normal"
        label-width="150px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="cForm.siteId"
            size="normal"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            :disabled="true"
          >
            <el-option :key="site.id" :label="site.siteCode" :value="site.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.affiliateCode')" prop="affiliateCode">
          <el-input
            v-model="cForm.affiliateCode"
            style="width: 350px;"
            maxlength="11"
            :disabled="true"
          />
        </el-form-item>
        <!-- <el-form-item :label="t('fields.affiliateLevel')" prop="affiliateLevel">
            <el-select
              v-model="cForm.affiliateLevel"
              size="normal"
              :placeholder="t('fields.affiliateLevel')"
              class="filter-item"
              style="width: 350px"
            >
              <el-option
                v-for="item in uiControl.affiliateLevel"
                :key="item.key"
                :label="item.displayName"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
        <el-form-item :label="t('fields.loginName')" prop="loginName">
          <el-input
            v-model="cForm.loginName"
            style="width: 350px;"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item :label="t('fields.password')" prop="password">
          <el-input
            v-model="cForm.password"
            type="password"
            style="width: 350px;"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item
          :label="t('fields.reenterPassword')"
          prop="reEnterPassword"
        >
          <el-input
            v-model="cForm.reEnterPassword"
            type="password"
            style="width: 350px;"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item :label="t('fields.telephone')" prop="telephone">
          <el-input
            v-model="cForm.telephone"
            style="width: 350px;"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item :label="t('fields.commission')" prop="commission">
          <el-input
            v-model="cForm.commission"
            style="width: 350px;"
            :maxlength="uiControl.commissionMax"
            @keypress="restrictCommissionDecimalInput($event)"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ $t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="addAffiliate">
            {{ $t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>

      <el-form
        v-if="uiControl.dialogType === 'EDIT'"
        ref="editForm"
        :model="eForm"
        :rules="eFormRules"
        :inline="true"
        size="normal"
        label-width="200px"
      >
        <el-form-item :label="t('fields.loginName')" prop="loginName">
          <el-input
            v-model="eForm.loginName"
            style="width: 250px"
            maxlength="50"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item :label="t('fields.affiliateCode')" prop="affiliateCode">
          <el-input
            v-model="eForm.affiliateCode"
            style="width: 250px"
            maxlength="50"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item :label="t('fields.commissionRate')" prop="commission">
          <el-input
            v-model="eForm.commission"
            style="width: 250px"
            :maxlength="uiControl.commissionMax"
            @keypress="restrictCommissionDecimalInput($event)"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ $t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="editAffiliate()">
            {{ $t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { useStore } from '@/store'
import moment from 'moment'
import {
  getAffiliateDownline,
  regsterAffiliate,
  editAffiliateCommission,
  getAffiliateInfo,
} from '../../../api/affiliate'
import { getSite } from '../../../api/site'
import { required, size } from '../../../utils/validate'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import emptyComp from '@/components/empty'

const store = useStore()
const { t } = useI18n()
const createForm = ref(null)
const editForm = ref(null)
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: '',
  commissionMax: 2,
  revenueMax: 2,
  affiliateLevel: [
    { key: 1, displayName: 'AFFILIATE', value: 'AFFILIATE' },
    { key: 2, displayName: 'SUPER AFFILIATE', value: 'SUPER_AFFILIATE' },
    { key: 3, displayName: 'MASTER AFFILIATE', value: 'MASTER_AFFILIATE' },
    { key: 4, displayName: 'CHIEF AFFILIATE', value: 'CHIEF_AFFILIATE' },
  ],
})
const affiliateLevel = ref(null)

const site = ref(null)
const affInfo = ref(null)
const startDate = new Date()
const defaultStartDate = convertDate(
  startDate.setTime(
    moment(startDate)
      .startOf('month')
      .format('x')
  )
)
const defaultEndDate = convertDate(new Date())
const checkId = ref(null)
const breadcrumbNameList = ref([])

const shortcuts = [
  {
    text: t('fields.today'),
    value: () => {
      const end = new Date()
      const start = new Date()
      return [start, end]
    },
  },
  {
    text: t('fields.yesterday'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'days')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'days')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.thisWeek'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('isoWeek')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.lastWeek'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'weeks')
          .startOf('isoWeek')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'weeks')
          .endOf('isoWeek')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.thisMonth'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.lastMonth'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'months')
          .startOf('month')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'months')
          .endOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
]

const request = reactive({
  regTime: [defaultStartDate, defaultEndDate],
  loginName: null,
  size: 20,
  current: 1,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const cForm = reactive({
  id: null,
  loginName: null,
  password: null,
  reEnterPassword: null,
  telephone: null,
  siteId: null,
  affiliateLevel: null,
  affiliateCode: null,
  commission: 0,
})

const eForm = reactive({
  id: null,
  loginName: null,
  affiliateCode: null,
  commission: null,
})

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function disabledDate(time) {
  return time.getTime() > new Date().getTime()
}

const validatePassword = (rule, value, callback) => {
  if (value !== '' && cForm.reEnterPassword !== '') {
    createForm.value.validateField('reEnterPassword')
  }
  callback()
}

const validateReEnterPassword = (rule, value, callback) => {
  if (value !== cForm.password) {
    callback(new Error(t('message.twoPasswordNotMatch')))
  }
  callback()
}

const validateCommission = (rule, value, callback) => {
  if (
    value !== '' &&
    (cForm.commission < 0 ||
      cForm.commission > 1 ||
      eForm.commission < 0 ||
      eForm.commission > 1)
  ) {
    callback(new Error(t('message.validateCommission')))
  }
  callback()
}

const cFormRules = reactive({
  // affiliateLevel: [required(t('message.requiredAffiliateLevel'))],
  loginName: [
    required(t('message.requiredLoginName')),
    size(6, 12, t('message.length6To12')),
  ],
  password: [
    required(t('message.requiredPassword')),
    size(6, 12, t('message.length6To12')),
    { validator: validatePassword, trigger: 'blur' },
  ],
  reEnterPassword: [
    required(t('message.reenterPassword')),
    { validator: validateReEnterPassword, trigger: 'blur' },
  ],
  telephone: [required(t('message.requiredTelephone'))],
  commission: [
    required(t('message.requiredCommission')),
    { validator: validateCommission, trigger: 'blur' },
  ],
})

const eFormRules = reactive({
  commission: [
    required(t('message.requiredCommission')),
    { validator: validateCommission, trigger: 'blur' },
  ],
})

function restrictCommissionDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if ((charCode < 48 || charCode > 57) && charCode !== 46) {
    event.preventDefault()
  }

  if (
    (eForm.commission !== null &&
      eForm.commission.toString().indexOf('.') > -1) ||
    (cForm.commission !== null && cForm.commission.toString().indexOf('.') > -1)
  ) {
    if (charCode === 46) {
      event.preventDefault()
    }
    uiControl.commissionMax = 4
  } else if (eForm.commission === '1' || cForm.commission === '1') {
    uiControl.commissionMax = 1
  } else {
    uiControl.commissionMax = 2
  }
}

function resetQuery() {
  request.regTime = [defaultStartDate, defaultEndDate]
  request.loginName = null
}

async function loadDownlineAffiliates() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  if (checkId.value === store.state.user.id) {
    Object.entries(requestCopy).forEach(([key, value]) => {
      if (value) {
        query[key] = value
      }
    })
  }
  if (request.regTime !== null) {
    if (request.regTime.length === 2) {
      query.regTime = request.regTime.join(',')
    }
  }
  query.siteId = site.value.id
  query.memberTypes = 'AFFILIATE'
  const { data: ret } = await getAffiliateDownline(checkId.value, query)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadDownlineAffiliates()
  }
}

function showDialog(type) {
  if (createForm.value) {
    createForm.value.resetFields()
  }
  if (editForm.value) {
    editForm.value.resetFields()
  }
  if (type === 'CREATE') {
    cForm.siteId = site.value.id
    cForm.affiliateCode = affInfo.value.affiliateCode
    uiControl.dialogTitle = t('fields.createAffiliate')
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editAffiliate')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(affiliate) {
  showDialog('EDIT')
  nextTick(() => {
    for (const key in affiliate) {
      if (Object.keys(eForm).find(k => k === key)) {
        eForm[key] = affiliate[key]
      }
    }
  })
}

async function addAffiliate() {
  createForm.value.validate(async valid => {
    if (valid) {
      await regsterAffiliate(cForm)
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
      await search()
    }
  })
}

async function editAffiliate() {
  editForm.value.validate(async valid => {
    if (valid) {
      const form = {}
      form.commission = eForm.commission
      form.siteId = store.state.user.siteId
      await editAffiliateCommission(eForm.id, form)
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
      await search()
    }
  })
}

async function loadSite() {
  const { data: s } = await getSite(store.state.user.siteId)
  site.value = s
}

async function loadAffiliateInfo() {
  const { data: a } = await getAffiliateInfo(store.state.user.id)
  affInfo.value = a
}

async function search() {
  checkId.value = store.state.user.id
  breadcrumbNameList.value = []
  const item = { id: checkId.value, name: store.state.user.name }
  breadcrumbNameList.value.push(item)
  await loadDownlineAffiliates()
}

async function searchDownline(id, name) {
  checkId.value = id
  const item = { id: id, name: name }
  breadcrumbNameList.value.push(item)
  await loadDownlineAffiliates()
}

function breadcrumbSearch(id, name) {
  const index = breadcrumbNameList.value.findIndex(b => b.id === id)
  breadcrumbNameList.value.splice(index)
  if (id === store.state.user.id) {
    search()
  } else {
    searchDownline(id, name)
  }
}

onMounted(async () => {
  affiliateLevel.value = store.state.user.affiliateLevel
  checkId.value = store.state.user.id
  const item = { id: checkId.value, name: store.state.user.name }
  breadcrumbNameList.value.push(item)
  await loadSite()
  await loadAffiliateInfo()
  await loadDownlineAffiliates()
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
  display: flex;
}

::v-deep(.el-table__row:not([class*='el-table__row--level-'])) {
  td:first-child {
    padding-left: 23px;
  }
}

.btn-group {
  margin-top: 15px;
  margin-left: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.box-card {
  ::v-deep(.el-card__body) {
    padding: 0;
  }
}

.breadcrumb {
  margin-left: 20px;
  margin-top: 25px;
  margin-bottom: 25px;
}

:deep(.el-breadcrumb__inner) {
  cursor: pointer !important;
  color: var(--el-color-primary) !important;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
  display: flex;
}

.box-card {
  ::v-deep(.el-card__body) {
    padding: 0;
  }
}

.inputs-wrap {
  margin: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  .input-small {
    width: 100%;
    max-width: 200px;
    &.el-range-editor--small.el-input__inner {
      max-width: 300px;
    }
  }
  .btn-grp {
    display: flex;
  }
}

@media (max-width: 768px) {
  .inputs-wrap {
    flex-direction: column;
    gap: 10px;
    .el-input--small {
      width: 100% !important;
      max-width: unset !important;
      margin: 0 !important;
      .el-button {
        margin: 0 !important;
      }
    }
    .input-small {
      max-width: unset;
      width: 100%;
      &.el-range-editor--small.el-input__inner {
        max-width: unset;
      }
    }
  }
}
</style>
