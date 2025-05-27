<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px;"
          :placeholder="t('fields.loginName')"
        />
        <el-input
          v-model="request.email"
          size="small"
          style="width: 200px; margin-left: 5px;"
          :placeholder="t('fields.email')"
        />
        <el-input
          v-model="request.telephone"
          size="small"
          style="width: 200px; margin-left: 5px;"
          :placeholder="t('fields.telephone')"
        />
        <el-input
          v-model="request.lastLoginIp"
          size="small"
          style="width: 200px; margin-left: 5px;"
          :placeholder="t('fields.lastLoginIp')"
        />
        <!-- <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 100px;margin-left: 5px"
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
        </el-select> -->
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadMembers()"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-search"
          size="mini"
          type="primary"
          v-permission="['sys:member:list:advanced']"
          @click="showAdvancedSearchDialog()"
        >
          {{ t('fields.advancedSearch') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:member:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          v-permission="['sys:member:promo']"
          @click="showPromo()"
          :disabled="uiControl.promoBtn"
        >
          {{ t('fields.distributePrivilege') }}
        </el-button>
        <el-button
          size="mini"
          type="primary"
          v-permission="['sys:member:export']"
          @click="requestExportExcel"
        >
          {{ t('fields.requestExportToExcel') }}
        </el-button>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 40px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.memberList') }}</span>
        </div>
      </template>
      <el-dialog
        :title="t('fields.exportToExcel')"
        v-model="uiControl.messageVisible"
        append-to-body
        width="500px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
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
        :title="uiControl.searchDialogTitle"
        v-model="uiControl.searchDialogVisible"
        append-to-body
        width="1000px"
      >
        <el-form
          ref="advancedSearchForm"
          :model="request"
          :inline="true"
          size="small"
          label-width="150px"
        >
          <el-form-item :label="t('fields.realName')" prop="realName">
            <el-input
              v-model="request.realName"
              style="width: 300px;"
              maxlength="50"
            />
          </el-form-item>
          <el-form-item
            :label="
              isThai(request.siteId)
                ? t('fields.englishName')
                : t('fields.nickName')
            "
            prop="name2"
          >
            <el-input
              v-model="request.name2"
              style="width: 300px;"
              maxlength="50"
            />
          </el-form-item>
          <el-form-item :label="t('fields.email')" prop="email">
            <el-input
              v-model="request.email"
              style="width: 300px;"
              maxlength="50"
            />
          </el-form-item>
          <el-form-item :label="t('fields.telephone')" prop="telephone">
            <el-input
              v-model="request.telephone"
              style="width: 300px;"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item :label="t('fields.referrerCode')" prop="referrerCode">
            <el-input
              v-model="request.referrerCode"
              style="width: 300px;"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item :label="t('fields.affiliateCode')" prop="affiliateCode">
            <el-input
              v-model="request.affiliateCode"
              style="width: 300px;"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item :label="t('fields.lastLoginIp')" prop="lastLoginIp">
            <el-input
              v-model="request.lastLoginIp"
              style="width: 300px;"
              maxlength="50"
            />
          </el-form-item>
          <el-form-item :label="t('fields.registerIp')" prop="regIp">
            <el-input
              v-model="request.regIp"
              style="width: 300px;"
              maxlength="50"
            />
          </el-form-item>
          <el-form-item :label="t('fields.vipLevel')" prop="vipId">
            <el-select
              v-model="request.vipId"
              size="small"
              :placeholder="t('message.selectSiteFirst')"
              class="filter-item"
              style="width: 300px;"
              default-first-option
            >
              <el-option
                v-for="item in vipList.list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('fields.riskLevel')" prop="riskId">
            <el-select
              v-model="request.riskId"
              size="small"
              :placeholder="t('message.selectSiteFirst')"
              class="filter-item"
              style="width: 300px;"
              default-first-option
            >
              <el-option
                v-for="item in riskList.list"
                :key="item.id"
                :label="item.levelName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('fields.financialLevel')" prop="financialId">
            <el-select
              v-model="request.financialId"
              size="small"
              :placeholder="t('message.selectSiteFirst')"
              class="filter-item"
              style="width: 300px;"
              default-first-option
            >
              <el-option
                v-for="item in financialList.list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('fields.totalDeposit')" prop="totalDeposit">
            <el-input
              v-model="request.totalDeposit1"
              style="width: 140px; margin-right: 5px;"
              maxlength="10"
            />
            -
            <el-input
              v-model="request.totalDeposit2"
              style="width: 140px; margin-left: 5px;"
              maxlength="10"
            />
          </el-form-item>
          <el-form-item :label="t('fields.totalWithdraw')" prop="totalWithdraw">
            <el-input
              v-model="request.totalWithdraw1"
              style="width: 140px; margin-right: 5px;"
              maxlength="10"
            />
            -
            <el-input
              v-model="request.totalWithdraw2"
              style="width: 140px; margin-left: 5px;"
              maxlength="10"
            />
          </el-form-item>
          <el-form-item :label="t('fields.status')" prop="status">
            <el-radio-group v-model="request.status" style="width: 300px;">
              <el-radio
                v-for="s in uiControl.memberState"
                :key="s.key"
                :label="s.value"
                size="small"
              >
                {{ s.displayName }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="t('fields.birthday')" prop="birthday">
            <el-date-picker
              v-model="request.birthday"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              size="small"
              type="daterange"
              range-separator=":"
              :start-placeholder="t('fields.startDate')"
              :end-placeholder="t('fields.endDate')"
              style="width: 300px"
              :disabled-date="disabledBirthdayDate"
              @calendar-change="birthdayCalendarChange"
              @blur="birthdayBlur"
              :editable="false"
            />
          </el-form-item>
          <el-form-item :label="t('fields.registerTime')" prop="regTime">
            <el-date-picker
              v-model="request.regTime"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              size="small"
              type="daterange"
              range-separator=":"
              :start-placeholder="t('fields.startDate')"
              :end-placeholder="t('fields.endDate')"
              style="width: 300px"
              :disabled-date="disabledRegTimeDate"
              @calendar-change="regTimeCalendarChange"
              @blur="regTimeBlur"
              :editable="false"
            />
          </el-form-item>
          <el-form-item :label="t('fields.accurate')" prop="accurate">
            <el-checkbox v-model="request.accurateLoginName" size="large" />
            {{ t('fields.loginName') }}
            <el-checkbox
              v-model="request.accurateRealName"
              size="large"
              style="margin-left:20px"
            />
            {{ t('fields.realName') }}
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="resetQuery()">
              {{ t('fields.cancel') }}
            </el-button>
            <el-button type="primary" @click="loadMembers()">
              {{ t('fields.search') }}
            </el-button>
          </div>
        </el-form>
      </el-dialog>
      <el-dialog
        :title="uiControl.dialogTitle"
        v-model="uiControl.dialogVisible"
        append-to-body
        width="580px"
      >
        <el-form
          ref="memberForm"
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
              style="width: 350px;"
              default-first-option
              @focus="loadSites"
            >
              <el-option
                v-for="item in siteList.list"
                :key="item.id"
                :label="item.siteName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('fields.affiliateCode')" prop="affiliateCode">
            <el-input
              v-model="form.affiliateCode"
              style="width: 350px;"
              maxlength="11"
            />
          </el-form-item>
          <el-form-item :label="t('fields.loginName')" prop="loginName">
            <el-input
              v-model="form.loginName"
              style="width: 350px;"
              maxlength="11"
            />
          </el-form-item>
          <el-form-item :label="t('fields.password')" prop="password">
            <el-input
              v-model="form.password"
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
              v-model="form.reEnterPassword"
              type="password"
              style="width: 350px;"
              maxlength="11"
            />
          </el-form-item>
          <el-form-item :label="t('fields.memberType')" prop="memberType">
            <el-radio-group v-model="form.memberType" style="width: 300px;">
              <el-radio
                v-for="m in uiControl.memberType"
                :key="m.key"
                :label="m.value"
                size="small"
              >
                {{ m.displayName }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="t('fields.telephone')" prop="telephone">
            <el-input
              v-model="form.telephone"
              style="width: 350px;"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item :label="t('fields.email')" prop="email">
            <el-input
              v-model="form.email"
              style="width: 350px;"
              maxlength="50"
            />
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="uiControl.dialogVisible = false">
              {{ t('fields.cancel') }}
            </el-button>
            <el-button type="primary" @click="addMember">
              {{ t('fields.confirm') }}
            </el-button>
          </div>
        </el-form>
      </el-dialog>
      <el-dialog
        :title="uiControl.promoDialogTitle"
        v-model="uiControl.promoDialogVisible"
        append-to-body
        width="580px"
      >
        <el-form
          ref="promotionForm"
          :model="promoForm"
          :rules="promoFormRules"
          :inline="true"
          size="small"
          label-width="150px"
        >
          <el-form-item :label="t('fields.privilegeName')" prop="privilegeId">
            <el-select
              v-model="promoForm.privilegeId"
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
          <el-form-item :label="t('fields.amount')" prop="amount">
            <el-input
              v-model="promoForm.amount"
              style="width: 350px;"
              :disabled="uiControl.promoAmountInput"
            />
          </el-form-item>
          <el-form-item :label="t('fields.turnoverMultiple')" prop="rollover">
            <el-input
              v-model="promoForm.rollover"
              style="width: 350px;"
              :disabled="uiControl.promoAmountInput"
            />
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="uiControl.promoDialogVisible = false">
              {{ t('fields.cancel') }}
            </el-button>
            <el-button type="primary" @click="distributePromo">
              {{ t('fields.confirm') }}
            </el-button>
          </div>
        </el-form>
      </el-dialog>
      <el-table
        :data="page.records"
        ref="table"
        v-loading="page.loading"
        row-key="id"
        size="mini"
        :resizable="true"
        highlight-current-row
        @selection-change="handleSelectionChange"
        :empty-text="t('fields.noData')"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          width="140"
        >
          <template
            #default="scope"
            v-if="hasPermission(['sys:member:detail'])"
          >
            <router-link
              :to="`details/${scope.row.id}?site=${scope.row.siteId}`"
            >
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="vipName" :label="t('menu.VIP')" width="50" />
        <el-table-column
          prop="realName"
          :label="t('fields.realName')"
          width="150"
        >
          <template #default="scope">
            <span v-if="scope.row.realName === null">-</span>
            <span v-if="scope.row.realName !== null">
              {{ scope.row.realName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="affiliateCode"
          :label="t('fields.affiliateCode')"
          width="100"
        >
          <template #default="scope">
            <span v-if="scope.row.affiliateCode === null">-</span>
            <span v-if="scope.row.affiliateCode !== null">
              {{ scope.row.affiliateCode }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="balance"
          :label="t('fields.balance')"
          width="110"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.balance, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="regTime"
          :label="t('fields.registerTime')"
          width="90"
        >
          <template #default="scope">
            <span v-if="scope.row.regTime === null">-</span>
            <span
              v-if="scope.row.regTime !== null"
              v-formatter="{
                data: scope.row.regTime,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="totalDeposit"
          :label="t('fields.totalDeposit')"
          width="110"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.totalDeposit, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="totalWithdraw"
          :label="t('fields.totalWithdraw')"
          width="110"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.totalWithdraw, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="financialLevel"
          :label="t('fields.financialLevel')"
        >
          <template #default="scope">
            <span v-if="scope.row.financialLevel === null">-</span>
            <span v-if="scope.row.financialLevel !== null">
              {{ scope.row.financialLevel }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="riskLevel" :label="t('fields.riskLevel')">
          <template #default="scope">
            <span v-if="scope.row.riskLevel === null">-</span>
            <span v-if="scope.row.riskLevel !== null">
              {{ scope.row.riskLevel }}
              <span
                class="level-color"
                :style="{backgroundColor: scope.row.riskLevelColor}"
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('fields.status')" width="100">
          <template #default="scope">
            <el-tag
              v-if="scope.row.status === 'NORMAL'"
              type="success"
              size="mini"
            >
              {{ scope.row.status }}
            </el-tag>
            <el-tag
              v-if="scope.row.status === 'FROZEN'"
              type="danger"
              size="mini"
            >
              {{ scope.row.status }}
            </el-tag>
            <el-tag v-if="scope.row.status === null" type="info" size="mini">
              -
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="memberType"
          :label="t('fields.memberType')"
          width="100"
        >
          <template #default="scope">
            <el-tag
              v-if="scope.row.memberType === 'NORMAL'"
              type="success"
              size="mini"
            >
              {{ scope.row.memberType }}
            </el-tag>
            <el-tag
              v-if="scope.row.memberType === 'TEST'"
              type="primary"
              size="mini"
            >
              {{ scope.row.memberType }}
            </el-tag>
            <el-tag
              v-if="scope.row.memberType === 'OUTSIDE'"
              type="warning"
              size="mini"
            >
              {{ scope.row.memberType }}
            </el-tag>
            <el-tag
              v-if="scope.row.memberType === null"
              type="info"
              size="mini"
            >
              -
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="site" :label="t('fields.site')" width="100">
          <template #default="scope">
            <span v-if="scope.row.site === null">-</span>
            <span v-if="scope.row.site !== null">{{ scope.row.site }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastLoginTime"
          :label="t('fields.lastLogin')"
          width="90"
        >
          <template #default="scope">
            <span v-if="scope.row.lastLoginTime === null">-</span>
            <span
              v-if="scope.row.lastLoginTime !== null"
              v-formatter="{
                data: scope.row.lastLoginTime,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @current-change="changePage"
        layout="prev, next"
        :page-size="request.size"
        :page-count="page.pages"
        :current-page="request.current"
      />
    </el-card>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
// import * as XLSX from 'xlsx';
import moment from 'moment'
import { ElMessage } from 'element-plus'
import { email, required, size } from '../../../utils/validate'
import {
  getMembers,
  registerMember,
  distributePromotion,
  requestExportSiteMember,
} from '../../../api/member'
import { getVipList } from '../../../api/vip'
import { selectList } from '../../../api/risk-level'
import { getFinancialLevels } from '../../../api/financial-level'
import { getActivePrivilegeInfoBySiteId } from '../../../api/privilege-info'
import { getSiteListSimple } from '../../../api/site'
import { hasPermission } from '../../../utils/util'
import { selectIpLabelAll } from '../../../api/ip-label'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { AppActionTypes } from '@/store/modules/app/action-types'
import { useI18n } from 'vue-i18n'
// import { isKorea, isThai } from '@/utils/site'
import { isThai } from '@/utils/site'

const { t } = useI18n()
const store = useStore()
// const LOGIN_USER_SITEID = computed(() => store.state.user.siteId)
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const memberForm = ref(null)
const advancedSearchForm = ref(null)
const promotionForm = ref(null)
const table = ref(null)
const vipList = reactive({
  list: [],
})
const riskList = reactive({
  list: [],
})
const financialList = reactive({
  list: [],
})
const privilegeInfoList = reactive({
  list: [],
})
const siteList = reactive({
  list: [],
})

let timeZone = null
let chooseMembers = []

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  searchDialogVisible: false,
  messageVisible: false,
  searchDialogTitle: t('fields.advancedSearch'),
  promoDialogVisible: false,
  promoDialogTitle: t('fields.distributePrivilege'),
  memberState: [
    { key: 1, displayName: 'ALL', value: null },
    { key: 2, displayName: 'NORMAL', value: 'NORMAL' },
    { key: 3, displayName: 'FROZEN', value: 'FROZEN' },
  ],
  promoBtn: true,
  promoAmountInput: true,
  colors: [
    { color: '#f56c6c', percentage: 30 },
    { color: '#e6a23c', percentage: 70 },
    { color: '#5cb87a', percentage: 100 },
  ],
  memberType: [
    { key: 1, displayName: 'NORMAL', value: 'NORMAL' },
    { key: 2, displayName: 'TEST', value: 'TEST' },
    { key: 3, displayName: 'OUTSIDE', value: 'OUTSIDE' },
  ],
})

let selectedBirthdayStartDate = ''
let selectedRegTimeStartDate = ''

// const exportPercentage = ref(0);
//
// const EXPORT_HEADER = ['ID', 'Login Name', 'Registration Time', 'Balance', 'Total Deposit', 'Total Withdrawal', 'Last Login Time', 'Status', 'Site'];

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const request = reactive({
  size: 30,
  current: 1,
  loginName: null,
  realName: null,
  name2: null,
  email: null,
  telephone: null,
  referrerCode: null,
  affiliateCode: null,
  lastLoginIp: null,
  regIp: null,
  vipId: null,
  riskId: null,
  financialId: null,
  totalDeposit1: null,
  totalDeposit2: null,
  totalWithdraw1: null,
  totalWithdraw2: null,
  status: null,
  siteId: null,
  birthday: [],
  regTime: [],
  accurateLoginName: false,
  accurateRealName: false,
})

const form = reactive({
  id: null,
  loginName: null,
  password: null,
  reEnterPassword: null,
  telephone: null,
  email: null,
  siteId: null,
  affiliateCode: null,
  memberType: null,
})

const promoForm = reactive({
  id: null,
  memberIds: null,
  memberId: null,
  privilegeId: null,
  amount: null,
  rollover: null,
  recordTime: null,
  siteId: null,
})

const validatePassword = (rule, value, callback) => {
  if (value !== '' && form.reEnterPassword !== '') {
    memberForm.value.validateField('reEnterPassword')
  }
  callback()
}

const validateReEnterPassword = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error(t('message.twoPasswordNotMatch')))
  }
  callback()
}

const formRules = reactive({
  loginName: [
    required(t('message.validateLoginNameRequired')),
    size(6, 12, t('message.validateLoginNameSize')),
    {
      required: true,
      pattern: /^[a-zA-Z0-9_][a-zA-Z0-9_]*$/,
      message: t('message.validateLoginNameNoSpecialCharacter'),
      trigger: 'blur',
    },
  ],
  password: [
    required(t('message.validatePasswordRequired')),
    size(6, 12, t('message.validatePasswordSize')),
    { validator: validatePassword, trigger: 'blur' },
  ],
  reEnterPassword: [
    required(t('message.validateReenterPasswordRequired')),
    { validator: validateReEnterPassword, trigger: 'blur' },
  ],
  memberType: [required(t('message.validateMemberTypeRequired'))],
  telephone: [required(t('message.validateTelephoneRequired'))],
  email: [email(t('message.validateEmailFormat'))],
  siteId: [required(t('message.validateSiteRequired'))],
})

const promoFormRules = reactive({
  name: [required(t('message.validatePrivilegeRequired'))],
  bonusAmount: [required(t('message.validateBonusAmountRequired'))],
})

function disabledBirthdayDate(time) {
  if (selectedBirthdayStartDate) {
    return (
      time.getTime() <=
        moment(selectedBirthdayStartDate)
          .subtract(90, 'days')
          .format('x') ||
      time.getTime() >=
        moment(selectedBirthdayStartDate)
          .add(90, 'days')
          .format('x')
    )
  }
}

function birthdayCalendarChange(arr) {
  selectedBirthdayStartDate = arr[0]
}

function birthdayBlur() {
  selectedBirthdayStartDate = null
}

function disabledRegTimeDate(time) {
  if (selectedRegTimeStartDate) {
    return (
      time.getTime() <=
        moment(selectedRegTimeStartDate)
          .subtract(90, 'days')
          .format('x') ||
      time.getTime() >=
        moment(selectedRegTimeStartDate)
          .add(90, 'days')
          .format('x')
    )
  }
}

function regTimeCalendarChange(arr) {
  selectedRegTimeStartDate = arr[0]
}

function regTimeBlur() {
  selectedRegTimeStartDate = null
}

function resetQuery() {
  request.loginName = null
  request.realName = null
  request.email = null
  request.telephone = null
  request.lastLoginIp = null
  request.regIp = null
  request.vipId = null
  request.riskId = null
  request.financialId = null
  request.totalDeposit1 = null
  request.totalDeposit2 = null
  request.totalWithdraw1 = null
  request.totalWithdraw2 = null
  request.status = null
  request.siteId = store.state.user.siteId
  request.birthday = []
  request.regTime = []
  request.accurateLoginName = false
  request.accurateRealName = false
  uiControl.searchDialogVisible = false
}

function handleSelectionChange(val) {
  chooseMembers = val
  if (chooseMembers.length === 0) {
    uiControl.promoBtn = true
  } else {
    uiControl.promoBtn = false
  }
}

function selectPrivilege(val) {
  privilegeInfoList.list.forEach(privilege => {
    if (privilege.id === val) {
      promoForm.rollover = privilege.rollover
      if (privilege.bonusType === 'FIXED') {
        promoForm.amount = privilege.bonusAmount
        uiControl.promoAmountInput = true
      } else {
        promoForm.amount = null
        uiControl.promoAmountInput = false
      }
    }
  })
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.regTime.length === 2) {
    query.regTime = request.regTime.join(',')
  }
  if (request.birthday.length === 2) {
    query.birthday = request.birthday.join(',')
  }
  return query
}

async function loadMembers() {
  if (!request.siteId) {
    console.warn('Site ID is null. Aborting loadMembers.')
    return
  }
  page.loading = true
  uiControl.searchDialogVisible = false
  const query = checkQuery()
  const { data: ret } = await getMembers(query)
  page.pages = ret.pages
  page.records = ret.records
  if (page.records.length / request.size < 1 || page.records.length === 0) {
    page.pages = request.current
  }
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone
  page.loading = false
  table.value.clearSelection()
}

async function requestExportExcel() {
  const query = checkQuery()
  query.requestBy = store.state.user.name
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  const { data: ret } = await requestExportSiteMember(query)
  if (ret) {
    uiControl.messageVisible = true
  }
}

// async function exportExcel() {
//   uiControl.progressBarVisible = true;
//   const query = checkQuery();
//   query.current = 1;
//   const { data: ret } = await getMembers(query);
//   const exportData = [EXPORT_HEADER];
//   const maxLength = [];
//
//   pushRecordToData(ret.records, exportData);
//   exportPercentage.value = Math.round(ret.current / (ret.pages + 1) * 100);
//   query.current = ret.current;
//
//   while (query.current < ret.pages) {
//     query.current += 1;
//     const { data: ret } = await getMembers(query);
//     pushRecordToData(ret.records, exportData);
//     exportPercentage.value = Math.round(ret.current / (ret.pages + 1) * 100);
//   }
//   const ws = XLSX.utils.aoa_to_sheet(exportData);
//   exportData.map(data => {
//     Object.keys(data).map(key => {
//       const value = data[key];
//
//       maxLength[key] = typeof value === 'number'
//         ? (maxLength[key] >= 10 ? maxLength[key] : 10)
//         : (maxLength[key] >= value.length + 2 ? maxLength[key] : value.length + 2);
//     });
//   });
//   const wsCols = maxLength.map(w => { return { width: w } });
//   ws['!cols'] = wsCols;
//   const wb = XLSX.utils.book_new();
//   wb.SheetNames.push('Member_List');
//   wb.Sheets.Member_List = ws;
//   XLSX.writeFile(wb, "member_list.xlsx");
//   exportPercentage.value = 100;
// }

// function pushRecordToData(records, exportData) {
//   records.forEach(item => {
//     delete item.downlineAffiliate;
//     delete item.downlineMember;
//   })
//   const data = records.map(record => Object.values(record).map(item => !item || item === '' ? '-' : item));
//   exportData.push(...data);
// }

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadMembers()
  }
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (memberForm.value) {
      memberForm.value.resetFields()
    }
    form.siteId = siteList.list[0].id
    uiControl.dialogTitle = t('fields.addMember')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showPromo() {
  if (privilegeInfoList.list.length !== 0) {
    uiControl.promoDialogTitle = t('fields.distributePrivilege')
    uiControl.promoDialogVisible = true
    promoForm.privilegeId = privilegeInfoList.list[0].id
    selectPrivilege(privilegeInfoList.list[0].id)
  } else {
    ElMessage({ message: t('message.noAvailablePrivilege'), type: 'error' })
  }
}

function showAdvancedSearchDialog() {
  uiControl.searchDialogTitle = t('fields.advancedSearch')
  uiControl.searchDialogVisible = true
}

function addMember() {
  memberForm.value.validate(async valid => {
    if (valid) {
      await registerMember(form)
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.registerSuccess'), type: 'success' })
      if (page.records.length !== 0) {
        await loadMembers()
      }
    }
  })
}

function distributePromo() {
  promotionForm.value.validate(async valid => {
    if (valid) {
      promoForm.memberIds = chooseMembers.map(m => m.id).join(',')
      await distributePromotion(promoForm)
      loadMembers()
      uiControl.promoDialogVisible = false
      ElMessage({
        message: t('message.promoDistributionSuccess'),
        type: 'success',
      })
    }
  })
}

async function loadVips() {
  const { data: vip } = await getVipList()
  vipList.list = vip
}

async function loadRiskLevels(siteId) {
  const { data: risk } = await selectList({ siteId: siteId })
  riskList.list = risk
}

async function loadFinancialLevels(siteId) {
  const { data: financial } = await getFinancialLevels({ siteId: siteId })
  financialList.list = financial
}

async function loadPrivilegeInfos() {
  const siteId = request.siteId
  const { data: privilegeInfo } = await getActivePrivilegeInfoBySiteId(siteId)
  privilegeInfoList.list = privilegeInfo
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function changeSite(siteId) {
  await loadVips()
  vipList.list = vipList.list.filter(vip => vip.siteId === siteId)
  promoForm.siteId = siteId
  await loadRiskLevels(siteId)
  await loadFinancialLevels(siteId)
}

async function setIpLabels() {
  const { data: labels } = await selectIpLabelAll()
  store.dispatch(AppActionTypes.ACTION_SET_IP_LABELS, labels)
}

onMounted(async () => {
  await loadSites()
  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  await changeSite(request.siteId)
  await loadPrivilegeInfos()
  await setIpLabels()
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

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}

.level-color {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 5px;
}
</style>
