<template>
  <div class="roles-main">
    <el-button
      v-permission="['sys:member:update:withdraw-card']"
      icon="el-icon-plus"
      size="mini"
      type="primary"
      @click="showDialog"
    >
      {{ t('fields.addCriditCard') }}
    </el-button>
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.memberBankCard') }}</span>
        </div>
      </template>
      <el-table
        :data="memberBankCardPage.records"
        ref="table"
        row-key="id"
        size="small"
        highlight-current-row
        v-loading="memberBankCardPage.loading"
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          :label="t('fields.sn')"
          type="index"
          align="center"
          min-width="280"
        />
        <el-table-column
          prop="bankName"
          :label="t('fields.bankName')"
          align="center"
          min-width="180"
        />
        <el-table-column
          prop="cardNumber"
          :label="t('fields.cardNumber')"
          align="center"
          min-width="180"
        />
        <el-table-column
          prop="cardAddress"
          :label="t('fields.cardAddress')"
          align="center"
          min-width="180"
        />
        <el-table-column
          prop="cardAccount"
          :label="t('fields.cardAccount')"
          align="center"
          min-width="180"
        />
        <el-table-column
          prop="createTime"
          :label="t('fields.createTime')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.createTime === null">-</span>
            <span
              v-if="scope.row.createTime !== null"
              v-formatter="{
                data: scope.row.createTime,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.operate')" align="center">
          <template
            #default="scope"
            v-if="hasPermission(['sys:member:unbindbankcard'])"
          >
            <el-button
              ref="unbindBtnsRef"
              size="mini"
              type="danger"
              @click="toUnbind(scope.row)"
              @keydown.enter.prevent
            >
              {{ t('fields.unbind') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @current-change="changeMemberBankPage"
        layout="prev, pager, next"
        :page-size="memberBankCardRequest.size"
        :page-count="memberBankCardPage.pages"
        :current-page="memberBankCardRequest.current"
      />
    </el-card>

    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="memberBankLogRequest.operationTime"
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
        <el-button
          style="margin-left: 10px"
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="loadMemberBankLog()"
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
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.memberBankCardRecord') }}</span>
        </div>
      </template>
      <el-table
        :data="memberBankLogPage.records"
        ref="table"
        row-key="id"
        size="small"
        highlight-current-row
        v-loading="memberBankLogPage.loading"
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          :label="t('fields.sn')"
          type="index"
          align="center"
          min-width="280"
        />
        <el-table-column
          prop="bankName"
          :label="t('fields.bankName')"
          align="center"
          min-width="180"
        />
        <el-table-column
          prop="cardNumber"
          :label="t('fields.cardNumber')"
          align="center"
          min-width="180"
        />
        <el-table-column
          prop="cardAddress"
          :label="t('fields.cardAddress')"
          align="center"
          min-width="180"
        />
        <el-table-column
          prop="cardAccount"
          :label="t('fields.cardAccount')"
          align="center"
          min-width="180"
        />
        <el-table-column
          prop="type"
          :label="t('fields.type')"
          align="center"
          min-width="180"
        />
        <el-table-column
          prop="operationTime"
          :label="t('fields.operationTime')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.operationTime === null">-</span>
            <span
              v-if="scope.row.operationTime !== null"
              v-formatter="{
                data: scope.row.operationTime,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="operator"
          :label="t('fields.operator')"
          align="center"
          min-width="180"
        />
      </el-table>
      <el-pagination
        class="pagination"
        @current-change="changeMemberBankLogPage"
        layout="prev, pager, next"
        :page-size="memberBankLogRequest.size"
        :page-count="memberBankLogPage.pages"
        :current-page="memberBankLogRequest.current"
      />
    </el-card>

    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="bankCardForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.bankName')" prop="bankId">
          <el-select
            v-model="form.bankId"
            size="small"
            :placeholder="t('fields.bankName')"
            class="filter-item"
            style="width: 350px"
          >
            <el-option
              v-for="item in withdrawCardList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              @click="form.currencyId = item.currencyIds"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.cardNumber')" prop="cardNumber">
          <el-input
            type="text"
            v-model="form.cardNumber"
            style="width: 350px;"
          />
        </el-form-item>
        <el-form-item :label="t('fields.cardAccount')" prop="cardAccount">
          <el-input v-model="form.cardAccount" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.cardAddress')" prop="cardAddress">
          <el-input v-model="form.cardAddress" style="width: 350px" />
        </el-form-item>
        <div class="dialog-footer" style="display: flex; justify-content: flex-end;">
          <el-button @click="closeAddBandCardDialog">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="confirmAddBandCardDialog">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, defineProps, reactive, ref } from 'vue'
import moment from 'moment'
import {
  getMemberBank,
  getMemberBankLog,
  unbindBankCard,
  getMemberWithdrawCard,
  addMemberBankCard
} from '../../../../../api/member'
import { useI18n } from 'vue-i18n'
import { getShortcuts } from '@/utils/datetime'
import { formatInputTimeZone } from '@/utils/format-timeZone'
import { hasPermission } from '../../../../../utils/util'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
import { required } from '../../../../../utils/validate'
const props = defineProps({
  mbrId: {
    type: String,
    required: true,
  },
  timeZone: {
    type: String,
    required: true,
  },
})

const { t } = useI18n()
const shortcuts = getShortcuts(t)
const route = useRoute()

const startDate = new Date()
startDate.setDate(startDate.getDate() - 2)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())

const memberBankCardRequest = reactive({
  size: 5,
  current: 1,
  orderBy: 'createTime',
  sortType: 'DESC',
})

const memberBankLogRequest = reactive({
  size: 10,
  current: 1,
  operationTime: [defaultStartDate, defaultEndDate],
  orderBy: 'operationTime',
  sortType: 'DESC',
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: t('fields.addBankCard'),
})

const bankCardForm = ref(null)
const form = reactive({
  bankId: '',
  cardNumber: '',
  cardAccount: '',
  cardAddress: '',
  currencyId: '',
})

function resetQuery() {
  memberBankLogRequest.operationTime = [defaultStartDate, defaultEndDate]
}

const memberBankCardPage = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const memberBankLogPage = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const withdrawCardList = ref([])

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

async function loadMemberBank() {
  memberBankCardPage.loading = true
  const requestCopy = { ...memberBankCardRequest }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  query.memberId = props.mbrId
  const { data: ret } = await getMemberBank(props.mbrId, query)
  memberBankCardPage.pages = ret.pages
  memberBankCardPage.records = ret.records
  memberBankCardPage.loading = false
}

async function loadMemberBankLog() {
  memberBankLogPage.loading = true
  const requestCopy = { ...memberBankLogRequest }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (memberBankLogRequest.operationTime !== null) {
    if (memberBankLogRequest.operationTime.length === 2) {
      query.operationTime = JSON.parse(
        JSON.stringify(memberBankLogRequest.operationTime)
      )
      query.operationTime[0] = formatInputTimeZone(
        query.operationTime[0],
        props.timeZone,
        'start'
      )
      query.operationTime[1] = formatInputTimeZone(
        query.operationTime[1],
        props.timeZone,
        'end'
      )
      query.operationTime = query.operationTime.join(',')
    }
  }
  query.memberId = props.mbrId
  const { data: ret } = await getMemberBankLog(props.mbrId, query)
  memberBankLogPage.pages = ret.pages
  memberBankLogPage.records = ret.records
  memberBankLogPage.loading = false
}

async function loadWithdrawCard() {
  const { data } = await getMemberWithdrawCard(props.mbrId, { siteId: route.query.site });
  withdrawCardList.value = data
}

function changeMemberBankPage(page) {
  if (memberBankCardRequest.current >= 1) {
    memberBankCardRequest.current = page
    loadMemberBank()
  }
}

function changeMemberBankLogPage(page) {
  if (memberBankLogRequest.current >= 1) {
    memberBankLogRequest.current = page
    loadMemberBankLog()
  }
}

async function toUnbind(bankCard) {
  ElMessageBox.confirm(t('message.confirmUnbind'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await unbindBankCard(bankCard.id)
    await loadMemberBank()
    ElMessage({ message: t('message.unbindSuccess'), type: 'success' })
  })
}

const formRules = reactive({
  bankId: [
    required(t('message.validateBankRequired')),
  ],
  cardNumber: [
    required(t('message.validateCardNumberRequired')),
  ],
  cardAccount: [
    required(t('message.validateCardAccountRequired')),
  ],
})

function showDialog() {
  if (bankCardForm.value) {
    bankCardForm.value.resetFields()
  }
  uiControl.dialogVisible = true
}

function closeAddBandCardDialog() {
  uiControl.dialogVisible = false
}

async function confirmAddBandCardDialog() {
  const payload = {
    ...form,
    siteId: Number(route.query.site),
    cardNumber: Number(form.cardNumber),
  }

  bankCardForm.value.validate(async valid => {
    if (valid) {
      const response = await addMemberBankCard(props.mbrId, payload)

      if (response.code === 0) {
        uiControl.dialogVisible = false
        ElMessage({ message: t('message.addSuccess'), type: 'success' })
        loadMemberBank()
      }
    }
  })
}

onMounted(() => {
  loadMemberBank()
  loadWithdrawCard()
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
  display: flex;
}

.search {
  display: flex;
  justify-content: flex-start;
}
</style>
