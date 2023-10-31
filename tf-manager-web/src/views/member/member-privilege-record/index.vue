<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 250px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />

        <el-input
          v-model="request.memberName"
          size="small"
          style="width: 150px; margin-left: 5px"
          :placeholder="t('fields.memberName')"
        />

        <el-input
          v-model="request.privilegeName"
          size="small"
          style="width: 150px; margin-left: 5px"
          :placeholder="t('fields.privilegeName')"
        />

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
          @click="loadPrivilegeRecord()"
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
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="primary"
          v-permission="['sys:member-privilege:distribute']"
          @click="showPromo()"
        >
          {{ t('fields.distributePrivilege') }}
        </el-button>
      </div>
    </div>

    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
      :summary-method="getSummaries"
      show-summary
    >
      <el-table-column
        prop="memberName"
        :label="t('fields.memberName')"
        width="200"
      />
      <el-table-column
        prop="privilegeName"
        :label="t('fields.privilegeName')"
        width="300"
      />

      <el-table-column prop="amount" :label="t('fields.amount')" width="200">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.amount,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="recordTime"
        :label="t('fields.recordTime')"
        width="200"
      >
        <template #default="scope">
          <span v-if="scope.row.recordTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.recordTime !== null"
            v-formatter="{
              data: scope.row.recordTime,
              timeZone: siteTimeZone.timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="privilegeType"
        :label="t('fields.privilegeType')"
        width="120"
      />
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
  <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="580px">
    <el-form ref="formRef" :model="form" :rules="formRules" :inline="true" size="small" label-width="150px">
      <el-row>
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 100px;"
            default-first-option
            @focus="loadSites"
            @change="changeSite"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.privilegeName')" prop="privilegeId">
          <el-select
            v-model="form.privilegeId"
            size="small"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @focus="loadPrivilegeInfos"
            @change="selectPrivilege"
          >
            <el-option
              v-for="item in privilegeInfoList.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :label="t('fields.amount')" prop="amount">
          <el-input v-model="form.amount" style="width: 350px;" :disabled="uiControl.promoAmountInput" />
          <br>
          <span style="margin-left: 10px" v-if="selectedPrivilege !== null && selectedPrivilege.bonusMax !== null && selectedPrivilege.bonusMax !== 0 && selectedPrivilege.bonusType !== 'FIXED'">
            {{ t('fields.maxBonus') }} : $ <span v-formatter="{data: selectedPrivilege.bonusMax,type: 'money'}" /></span>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :label="t('fields.turnoverMultiple')" prop="rollover">
          <el-input v-model="form.rollover" style="width: 350px;" disabled />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :label="t('fields.loginName')" prop="loginName">
          <el-input type="textarea" v-model="form.loginName" :rows="6" style="width: 350px; margin-top: 5px;" :placeholder="t('fields.loginNameSeparateComma')" />
        </el-form-item>
      </el-row>
      <span class="dialog-footer">
        <el-button @click="uiControl.dialogVisible=false">{{ t('fields.cancel') }}</el-button>
        <el-button type="primary" @click="distributePromo">{{ t('fields.confirm') }}</el-button>
      </span>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import {
  getPrivilegeRecord,
  getTotalPrivilegeAmount,
} from '../../../api/report-privilege-record'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { getShortcuts } from '@/utils/datetime'
import { hasPermission } from '../../../utils/util'
import { required } from '../../../utils/validate'
import { ElMessage } from 'element-plus'
import { getActivePrivilegeInfoBySiteId } from '../../../api/privilege-info'
import { distributePrivilege } from '../../../api/member-privilege'

const { t } = useI18n()
const startDate = new Date()
startDate.setDate(startDate.getDate())
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())
const siteTimeZone = reactive({
  timeZone: null,
})

const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const formRef = ref(null);
const privilegeInfoList = reactive({
  list: []
});
const siteList = reactive({
  list: [],
})
const selectedPrivilege = ref(null);

const uiControl = reactive({
  dialogTitle: t('fields.distributePrivilege'),
  dialogVisible: false,
  dialogType: "DISTRIBUTE",
  promoAmountInput: true
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  total: 0,
  totalAmount: 0,
})

const request = reactive({
  size: 30,
  current: 1,
  memberName: null,
  privilegeName: null,
  recordTime: [defaultStartDate, defaultEndDate],
  siteId: null,
})

const form = reactive({
  siteId: null,
  privilegeId: null,
  amount: null,
  rollover: null,
  loginName: []
})

const formRules = reactive({
  privilegeId: [required(t('message.validatePrivilegeRequired'))],
  amount: [required(t('message.validateAmountRequired'))],
  loginName: [required(t('message.validateLoginNameRequired'))]
});

const shortcuts = getShortcuts(t)
function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function disabledDate(time) {
  return (
    time.getTime() <=
      moment(new Date())
        .subtract(1, 'weeks')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

function resetQuery() {
  request.memberName = null
  request.privilegeName = null
  request.recordTime = [defaultStartDate, defaultEndDate]
  request.siteId = site.value ? site.value.id : siteList.list[0].id
}

async function loadPrivilegeRecord() {
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

  const { data: ret } = await getPrivilegeRecord(query)

  page.pages = ret.pages
  page.records = patchRecord(ret.records)
  page.total = ret.total
  if (page.records.length !== 0) {
    const { data: amount } = await getTotalPrivilegeAmount(query)
    page.totalAmount = amount
  } else {
    page.totalAmount = 0
  }

  var siteSelected = siteList.list.find(e => e.id === request.siteId)
  siteTimeZone.timeZone = siteSelected.timeZone;

  page.loading = false
}

function patchRecord(records) {
  if (records.length > 0) {
    records.forEach((item, index) => {
      if (item.privilegeAlias !== null) {
        item.privilegeName = item.privilegeAlias;
      }
    })
  }
  return records;
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function getSummaries(param) {
  if (hasPermission(['sys:report:privilege:record:total'])) {
    const { columns } = param
    var sums = []

    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = t('fields.noOfPrivilegeClaimed') + '   ' + page.total
      } else if (index === 1) {
        sums[index] = sums[index] =
          t('fields.totalPrivilegeClaimAmount') +
          '   $' +
          page.totalAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
      }
    })
    return sums
  } else {
    return '-'
  }
}

function changePage(page) {
  request.current = page
  loadPrivilegeRecord()
}

async function showPromo() {
  form.siteId = request.siteId;
  await changeSite(form.siteId);
  if (privilegeInfoList.list.length !== 0) {
    uiControl.dialogTitle = t('fields.distributePrivilege');
    uiControl.dialogVisible = true;
    form.privilegeId = privilegeInfoList.list[0].id;
    form.loginName = [];
    selectPrivilege(privilegeInfoList.list[0].id);
  } else {
    ElMessage({ message: t('message.noAvailablePrivilege'), type: "error" });
  }
}

function selectPrivilege(val) {
  privilegeInfoList.list.forEach(privilege => {
    if (privilege.id === val) {
      form.rollover = privilege.rollover;
      if (privilege.bonusType === "FIXED") {
        form.amount = privilege.bonusAmount;
        uiControl.promoAmountInput = true;
      } else {
        form.amount = null;
        uiControl.promoAmountInput = false;
      }
      selectedPrivilege.value = privilege;
    }
  })
}

function distributePromo() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await distributePrivilege(form);
      form.loginName = [];
      form.privilegeId = privilegeInfoList.list[0].id;
      selectPrivilege(privilegeInfoList.list[0].id);
      ElMessage({ message: t('message.promoDistributionSuccess'), type: "success" });
      uiControl.dialogVisible = false;
      await loadPrivilegeRecord()
    }
  });
}

async function loadPrivilegeInfos() {
  const { data: privilegeInfo } = await getActivePrivilegeInfoBySiteId(form.siteId);
  privilegeInfoList.list = privilegeInfo;
}

async function changeSite(siteId) {
  await loadPrivilegeInfos(siteId);
  if (privilegeInfoList.list.length !== 0) {
    form.privilegeId = privilegeInfoList.list[0].id;
    selectPrivilege(privilegeInfoList.list[0].id);
  } else {
    form.privilegeId = null
  }
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
  await loadPrivilegeRecord()
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
