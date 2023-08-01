<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.cardTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 200px;margin-left:5px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />

        <el-input
          v-model="request.realName"
          size="small"
          style="width: 120px;margin-left:5px"
          :placeholder="t('fields.realName')"
        />

        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 120px;margin-left:5px"
          :placeholder="t('fields.loginName')"
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

        <el-select
          v-model="request.bindType"
          size="small"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in bindType.list"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="request.cardType"
          size="small"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in cardType.list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-input
          v-model="request.cardNo"
          size="small"
          style="width: 200px;margin-left:5px"
          :placeholder="t('fields.cardNumber')"
        />
      </div>

      <div
        class="header-container"
        style="margin-top: 10px;margin-left:20px"
      />

      <div class="header-container">
        <el-button
          style="margin-left: 5px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadBankCardHistory()"
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

    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      height="500"
      :empty-text="t('fields.noData')"
    >
      <el-table-column
        prop="loginName"
        :label="t('fields.loginName')"
        width="120"
      >
        <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
          <router-link :to="`/member/details/${scope.row.memberId}?site=${request.siteId}`">
            <el-link type="primary">{{ scope.row.loginName }}</el-link>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column
        prop="realName"
        :label="t('fields.realName')"
        width="120"
      />

      <el-table-column
        prop="cardNo"
        :label="t('fields.cardNumber')"
        width="170"
      />

      <el-table-column
        prop="cardTime"
        :label="t('fields.cardTime')"
        width="170"
      />

      <el-table-column prop="level" :label="t('fields.level')" width="80" />

      <el-table-column
        prop="action"
        :label="t('fields.action')"
        align="center"
        min-width="100"
      >
        <template #default="scope">
          <span
            style="font-size: small;margin-top: 10px;"
            v-if="scope.row.action === 'REMOVE'"
          >
            {{ t('fields.bindTypeRemove') }}
          </span>

          <span
            style="font-size: small;margin-top: 10px;"
            v-if="scope.row.action === 'BIND'"
          >
            {{ t('fields.bindTypeNew') }}
          </span>
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
import { computed, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import { getBankCardHistory } from '../../../api/bank-card-history'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { hasPermission } from '../../../utils/util'
import { getShortcuts } from "@/utils/datetime";

const { t } = useI18n()
const startDate = new Date()
startDate.setDate(startDate.getDate())
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())

const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)

const siteList = reactive({
  list: [],
})
const bindType = reactive({
  list: [
    { label: t('fields.bindTypeAll'), value: '0' },
    { label: t('fields.bindTypeNew'), value: 'BIND' },
    { label: t('fields.bindTypeRemove'), value: 'REMOVE' },
  ],
})
const cardType = reactive({
  list: [
    { label: t('fields.cardTypeAll'), value: '0' },
    { label: t('fields.cardTypeBank'), value: 'BANK' },
    { label: t('fields.cardTypeWallet'), value: 'EWALLET' },
    { label: t('fields.cardTypeCrypto'), value: 'CRYPTO' },
  ],
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const request = reactive({
  size: 30,
  current: 1,
  realName: null,
  cardTime: [defaultStartDate, defaultEndDate],
  siteId: null,
  cardNo: null,
  loginName: null,
  bindType: null,
  cardType: null,
})

const shortcuts = getShortcuts(t);
function disabledDate(time) {
  return (
    time.getTime() <=
      moment(new Date())
        .subtract(4, 'weeks')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function resetQuery() {
  request.loginName = null
  request.cardTime = [defaultStartDate, defaultEndDate]
  request.siteId = site.value ? site.value : null
  request.cardNo = null
  request.bindType = bindType.list[0].value
  request.cardType = cardType.list[0].value
  request.realName = null
}

async function loadBankCardHistory() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.cardTime !== null) {
    if (request.cardTime.length === 2) {
      query.cardTime = request.cardTime.join(',')
    }
  }

  const { data: ret } = await getBankCardHistory(query)

  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

function changePage(page) {
  request.current = page
  loadBankCardHistory()
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
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

  request.bindType = bindType.list[0].value
  request.cardType = cardType.list[0].value

  await loadBankCardHistory()
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
