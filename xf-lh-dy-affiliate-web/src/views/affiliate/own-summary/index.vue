<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <div>
          <el-date-picker
            v-model="request.recordTime"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            size="small"
            type="daterange"
            range-separator=":"
            :start-placeholder="t('fields.startDate')"
            :end-placeholder="t('fields.endDate')"
            style="width: 300px; margin-left: 10px"
            :shortcuts="shortcuts"
            :disabled-date="disabledDate"
            :editable="false"
            :clearable="false"
          />
          <el-button
            style="margin-left: 20px"
            icon="el-icon-search"
            size="mini"
            type="success"
            @click="loadRecord()"
          >
            {{ t('fields.search') }}
          </el-button>
          <el-button size="mini" @click="resetQuery()">
            {{ t('fields.reset') }}
          </el-button>
        </div>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <div class="display-container">
        <el-row>
          <el-col :span="12">
            {{ t('fields.newUsers') }}
          </el-col>
          <el-col :span="12">
            {{ data.registerMemberCount }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            {{ t('fields.betMembers') }}
          </el-col>
          <el-col :span="12">
            {{ data.betMemberCount }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            {{ t('fields.firstDepositUsers') }}
          </el-col>
          <el-col :span="12">
            {{ data.ftdMemberCount }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            {{ t('fields.depositUsers') }}
          </el-col>
          <el-col :span="12">
            {{ data.depositMemberCount }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            {{ t('fields.transferUsers') }}
          </el-col>
          <el-col :span="12">
            {{ data.affiliateTransferMemberCount }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            {{ t('fields.profit') }}
          </el-col>
          <el-col :span="12">
            $
            <span
              v-formatter="{data: data.profit, type: 'money'}"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            {{ t('fields.bet') }}
          </el-col>
          <el-col :span="12">
            $
            <span
              v-formatter="{data: data.bet, type: 'money'}"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            {{ t('fields.amountOfFirstDeposit') }}
          </el-col>
          <el-col :span="12">
            $
            <span
              v-formatter="{data: data.ftdAmount, type: 'money'}"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            {{ t('fields.depositAmount') }}
          </el-col>
          <el-col :span="12">
            $
            <span
              v-formatter="{data: data.depositAmount, type: 'money'}"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            {{ t('fields.transferAmount') }}
          </el-col>
          <el-col :span="12">
            $
            <span
              v-formatter="{data: data.affiliateTransferAmount, type: 'money'}"
            />
          </el-col>
        </el-row>
      </div>
    </el-card>

  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import moment from 'moment'
import { dashboardSummary } from '@/api/affiliate-summary'
import { useStore } from '@/store'

const store = useStore()
const { t } = useI18n()

const defaultStartDate = convertDate(new Date())
const defaultEndDate = convertDate(new Date())

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

const request = reactive({
  recordTime: [defaultStartDate, defaultEndDate],
})

const data = reactive({
  registerMemberCount: 0,
  betMemberCount: 0,
  ftdMemberCount: 0,
  depositMemberCount: 0,
  affiliateTransferMemberCount: 0,
  profit: 0,
  bet: 0,
  ftdAmount: 0,
  depositAmount: 0,
  affiliateTransferAmount: 0,
})

function disabledDate(time) {
  return time.getTime() > new Date().getTime()
}

function resetQuery() {
  request.recordTime = [defaultStartDate, defaultEndDate]
}

async function loadRecord() {
  const query = checkQuery()
  const { data: ret } = await dashboardSummary(
    store.state.user.id,
    query
  )
  if (ret) {
    Object.entries(ret).forEach(([key, value]) => {
      if (value) {
        data[key] = value
      } else {
        data[key] = 0
      }
    })
  } else {
    data.registerMemberCount = 0
    data.betMemberCount = 0
    data.ftdMemberCount = 0
    data.depositMemberCount = 0
    data.affiliateTransferMemberCount = 0
    data.profit = 0
    data.bet = 0
    data.ftdAmount = 0
    data.depositAmount = 0
    data.affiliateTransferAmount = 0
  }
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = query.recordTime.join(',')
    }
  }
  return query
}

onMounted(() => {
  request.siteId = store.state.user.siteId;
  loadRecord()
})
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  float: left;
  width: 100%;
  display: block;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.btn-group {
  margin-top: 15px;
  display: inline-flex;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
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

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}

.summary-container {
  display: table;
  table-layout: fixed;
  width: inherit;
  border-collapse: separate;
  border-spacing: 10px;
}

.display-container {
  margin: 20px auto;
}
.display-container .el-row {
  padding: 15px 10px;
}

.display-container .el-row:nth-child(odd) {
  background-color: #F4F9FD;
}
</style>
