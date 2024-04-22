<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.createTime"
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
        <el-input
          v-model="request.summonerName"
          style="width: 200px; margin-left: 10px"
          size="small"
          maxlength="50"
          :placeholder="t('fields.summoner')"
        />
        <el-input
          v-model="request.summonName"
          style="width: 200px; margin-left: 10px"
          size="small"
          maxlength="50"
          :placeholder="t('fields.memberSummon')"
        />
        <el-select
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            :label="t('fields.fail')"
            value="0"
          />
          <el-option
            :label="t('fields.success')"
            value="1"
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
            v-for="item in sites.list"
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
          @click="loadRecord"
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
      size="small"
      :data="page.records"
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column
        prop="summonerName"
        :label="t('fields.summoner')"
      >
        <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
          <router-link
            :to="`/member/details/${scope.row.summonerId}?site=${request.siteId}`"
          >
            <el-link type="primary">{{ scope.row.summonerName }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="summonName"
        :label="t('fields.memberSummon')"
      >
        <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
          <router-link
            :to="`/member/details/${scope.row.summonId}?site=${request.siteId}`"
          >
            <el-link type="primary">{{ scope.row.summonName }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        :label="t('fields.status')"
      >
        <template #default="scope">
          <span v-if="scope.row.status===true">
            {{ t('fields.success') }}
          </span>
          <span v-else>
            {{ t('fields.fail') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="failReason"
        :label="t('fields.failReason')"
      >
        <template #default="scope">
          <div v-if="scope.row.status===false">
            <span v-for="(item, index) in scope.row.failReasonList" :key="item">
              {{ t(`summonFailReason.${item}`) }}{{ index+1 === scope.row.failReasonList.length ? "" : "; " }}
            </span>
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        :label="t('fields.createTime')"
      >
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{
              data: scope.row.createTime,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="page.total"
      :page-sizes="[20, 50, 100, 150]"
      layout="total,sizes,prev, pager, next"
      style="margin-top: 10px"
      v-model:page-size="request.size"
      v-model:page-count="page.pages"
      v-model:current-page="request.current"
      @current-change="loadRecord"
      @size-change="loadRecord"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import moment from 'moment'
import { listMemberSummon } from '../../../../api/member-summon'
import { useI18n } from 'vue-i18n'
import { hasPermission } from '../../../../utils/util'
import { getShortcuts } from '@/utils/datetime'
import { getSiteListSimple } from '../../../../api/site'
import { useStore } from '../../../../store'
import { TENANT } from '../../../../store/modules/user/action-types'

const { t } = useI18n()
const shortcuts = getShortcuts(t)

const startDate = new Date()
startDate.setDate(startDate.getDate() - 2)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())
const site = ref(null)
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)

const sites = reactive({
  list: [],
})

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
})

const request = reactive({
  size: 20,
  current: 1,
  createTime: [defaultStartDate, defaultEndDate],
  siteId: null,
  summonerName: null,
  summonName: null,
  status: null,
})

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

function resetQuery() {
  request.createTime = [defaultStartDate, defaultEndDate]
  request.siteId = site.value ? site.value.id : sites.list[0].id
  request.summonerName = null
  request.summonName = null
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.createTime !== null) {
    if (request.createTime.length === 2) {
      query.createTime = JSON.parse(JSON.stringify(request.createTime))
      query.createTime = query.createTime.join(',')
    }
  }

  return query
}

async function loadRecord() {
  page.loading = true
  const query = checkQuery()
  const { data: ret } = await listMemberSummon(query)
  page.pages = ret.pages
  page.records = ret.records
  if (page.records !== null) {
    for (var i = 0; i < page.records.length; i++) {
      page.records[i].failReasonList = ["-"]
      if (page.records[i].failReason !== null && page.records[i].failReason.includes(",")) {
        page.records[i].failReasonList = page.records[i].failReason.split(",")
      } else {
        page.records[i].failReasonList[0] = page.records[i].failReason;
      }
    }
  }
  console.log(page.records)
  page.total = ret.total
  page.loading = false
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

onMounted(async () => {
  await loadSites()
  request.siteId = sites.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName)
    request.siteId = site.value.id
  }
  await loadRecord()
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

.el-pagination {
  display: inline-block;
}

.table-footer {
  margin-top: 15px;
  margin-right: 20px;
  float: right;
  font-size: small;
}
</style>
