<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px"
          @focus="loadSites"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-date-picker
          v-model="request.createTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          class="input-small"
          style="margin-left: 5px;"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
        />
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px;margin-left: 5px"
          :placeholder="t('fields.loginName')"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadVipUpgradeList()"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 40px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.vipUpgradeList') }}</span>
        </div>
      </template>
      <el-table
        :data="page.records"
        ref="table"
        v-loading="page.loading"
        row-key="id"
        size="mini"
        :resizable="true"
        highlight-current-row
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
        >
          <template
            #default="scope"
            v-if="hasPermission(['sys:member:detail'])"
          >
            <router-link :to="`details/${scope.row.memberId}?site=${request.siteId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="beforeVipName" :label="t('fields.beforeVipLevel')" />
        <el-table-column prop="afterVipName" :label="t('fields.afterVipLevel')" />
        <el-table-column
          prop="createTime"
          :label="t('fields.createTime')"
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
      </el-table>
      <el-pagination
        class="pagination"
        @current-change="changePage"
        layout="prev, pager, next"
        :page-size="request.size"
        :page-count="page.pages"
        :current-page="request.current"
      />
    </el-card>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { getVipUpgradeList } from '@/api/vip-upgrade'
import { getSiteListSimple } from '@/api/site'
import { hasPermission } from '@/utils/util'
import { useStore } from '@/store'
import { TENANT } from '@/store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { getShortcuts } from '@/utils/datetime'
import moment from "moment/moment";
import { formatInputTimeZone } from "@/utils/format-timeZone";

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const table = ref(null)
const siteList = reactive({
  list: [],
})
const shortcuts = getShortcuts(t)
let timeZone = null

const date = new Date();
const defaultStartDate = convertStartDate(date);
const defaultEndDate = convertDate(date);

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD') + ' 23:59:59';
}

function convertStartDate(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
}

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const request = reactive({
  size: 30,
  current: 1,
  loginName: null,
  siteId: null,
  createTime: [defaultStartDate, defaultEndDate]
})

function resetQuery() {
  request.loginName = null
  request.siteId = site.value ? site.value.id : siteList.list[0].id
  request.createTime = [defaultStartDate, defaultEndDate]
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  timeZone = siteList.list.find(e => e.id === requestCopy.siteId).timeZone;
  if (request.createTime !== null) {
    if (request.createTime.length === 2) {
      query.createTime = JSON.parse(JSON.stringify(request.createTime))
      query.createTime[0] = formatInputTimeZone(
        query.createTime[0],
        timeZone,
        'start'
      )
      query.createTime[1] = formatInputTimeZone(
        query.createTime[1],
        timeZone,
        'end'
      )
      query.createTime = query.createTime.join(',')
    }
  }
  return query
}

async function loadVipUpgradeList() {
  page.loading = true
  const query = checkQuery()
  const result = await getVipUpgradeList(query)

  page.pages = result.data.pages
  page.records = result.data.records
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone
  page.loading = false
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadVipUpgradeList()
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    site.value = siteList.list[0];
    request.siteId = site.value.id;
  }
  await loadVipUpgradeList();
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
</style>
