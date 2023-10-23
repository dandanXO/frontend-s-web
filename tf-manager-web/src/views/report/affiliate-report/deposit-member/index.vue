<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-button
          style="margin-left: 20px"
          icon="el-icon-back"
          size="mini"
          type="success"
          @click="back()"
        >
          {{ t('fields.back') }}
        </el-button>

        <el-button
          style="margin-left: 20px"
          icon="el-icon-refresh"
          size="mini"
          type="success"
          @click="refresh()"
        />
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
      <el-table-column prop="loginName" :label="t('fields.loginName')" width="120">
        <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
          <router-link :to="`/member/details/${scope.row.memberId}?site=${request.siteId}`">
            <el-link type="primary">{{ scope.row.loginName }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="depositAmount" :label="t('fields.depositAmount')" width="120">
        <template #default="scope">
          $
          <span
            v-formatter="{
              data: scope.row.depositAmount,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="depositCount" :label="t('fields.depositCount')" width="220" />
      <el-table-column prop="recordTime" :label="t('fields.recordTime')" width="150" />
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
import { getSiteListSimple } from '../../../../api/site'
import { useStore } from '../../../../store'
import { TENANT } from '../../../../store/modules/user/action-types'
import { hasPermission } from '../../../../utils/util'
import { useI18n } from "vue-i18n";
import { getAffiliateMemberDeposit } from '../../../../api/report-affiliate'

// eslint-disable-next-line
const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteList = reactive({
  list: [],
})
var date = new URL(location.href).searchParams.get('date')
var siteIdFromParam = new URL(location.href).searchParams.get('site')
var affiliateId = new URL(location.href).searchParams.get('affiliateId')

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const request = reactive({
  size: 30,
  current: 1,
  recordTime: date,
  siteId: siteIdFromParam,
  affiliateId: affiliateId
})

async function loadSummaryDepositMemberDetail() {
  page.loading = true
  const query = checkQuery();
  const { data: ret } = await getAffiliateMemberDeposit(query)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

function changePage(page) {
  request.current = page
  loadSummaryDepositMemberDetail()
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function back() {
  window.location.href = '/report/affiliate-report'
}

function refresh() {
  loadSummaryDepositMemberDetail()
}

onMounted(async () => {
  await loadSites()
  // tenant 只可以看到本身site的资料
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  } else {
    request.siteId = siteIdFromParam
  }

  await loadSummaryDepositMemberDetail()
})

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  return query
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}
</style>
