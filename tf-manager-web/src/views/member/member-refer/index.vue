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
        <el-date-picker
          v-model="request.regTime"
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
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
          @focus="loadSites"
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
          @click="search()"
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
          <span class="role-span">{{ t('fields.referrerList') }}</span>
          <el-row />
          <span v-if="uiControl.referrer"> {{ t('fields.referrer') }} : {{ uiControl.referrer }}</span>
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
        <el-table-column v-if="request.siteId !== 11" prop="downlineMember" :label="t('fields.downlineMember')" width="180">
          <template
            #default="scope"
            v-if="hasPermission(['sys:member-refer:list'])"
          >
            <a v-if="scope.row.downlineMember > 0">
              <el-link type="primary" @click="reloadMembers(scope.row.loginName, scope.row.id)">{{ scope.row.downlineMember }}</el-link>
            </a>
            <span v-else>{{ scope.row.downlineMember }}</span>
          </template>
        </el-table-column>
        <el-table-column v-else prop="downlineMember" :label="t('fields.allDownlineMember')" width="180">
          <template
            #default="scope"
            v-if="hasPermission(['sys:member-refer:list'])"
          >
            <a v-if="scope.row.downlineMember > 0">
              <el-link type="primary" @click="reloadMembers(scope.row.loginName, scope.row.id)">{{ scope.row.downlineMember }}</el-link>
            </a>
            <span v-else>{{ scope.row.downlineMember }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="request.siteId === 11" prop="downlineDepositMember" :label="t('fields.downlineDepositMember')" width="180" />
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          width="180"
        >
          <template
            #default="scope"
            v-if="hasPermission(['sys:member:detail'])"
          >
            <router-link :to="`details/${scope.row.id}?site=${request.siteId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="vip" :label="t('fields.vipLevel')" width="100" />
        <el-table-column
          prop="balance"
          :label="t('fields.balance')"
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.balance, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="regTime"
          :label="t('fields.registerTime')"
          width="150"
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
          prop="lastLoginTime"
          :label="t('fields.lastLoginTime')"
          width="150"
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
import {
  getMemberReferParent
} from '../../../api/member-refer-event'
import { getSiteListSimple } from '../../../api/site'
import { hasPermission } from '../../../utils/util'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { useRouter } from "vue-router";
import { getShortcuts } from '@/utils/datetime'
import moment from "moment/moment";
import { formatInputTimeZone } from "@/utils/format-timeZone";

const router = useRouter()
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

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  referrer: null,
})

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
  memberRemark: null,
  regTime: null,
  referrerId: null,
})

function resetQuery() {
  request.loginName = null
  request.memberRemark = null
  request.siteId = site.value ? site.value.id : siteList.list[0].id
  request.regTime = null
  request.referrerId = null
  uiControl.referrer = null
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (key === 'regTime' && value) {
      query[key] = [...requestCopy.regTime]
    } else {
      if (value) {
        query[key] = value
      }
    }
  })
  timeZone = siteList.list.find(e => e.id === requestCopy.siteId).timeZone;
  if (request.regTime !== null) {
    if (request.regTime.length === 2) {
      query.regTime[0] = moment(query.regTime[0]).format(
        'YYYY-MM-DD 00:00:00'
      )
      query.regTime[0] = formatInputTimeZone(query.regTime[0], timeZone);
      query.regTime[1] = moment(query.regTime[1]).format(
        'YYYY-MM-DD 23:59:59'
      )
      query.regTime[1] = formatInputTimeZone(query.regTime[1], timeZone);
      query.regTime = query.regTime.join(',')
    }
  }
  return query
}

function search() {
  uiControl.referrer = null
  request.referrerId = null
  loadMembers()
}

async function reloadMembers(loginName, uplineId) {
  request.referrerId = uplineId
  request.loginName = null
  uiControl.referrer = loginName
  loadMembers()
}

async function loadMembers() {
  console.log("loadmembers")
  page.loading = true
  uiControl.searchDialogVisible = false
  const query = checkQuery()
  const result = await getMemberReferParent(query)

  page.pages = result.data.pages
  page.records = result.data.records
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone
  page.loading = false
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadMembers()
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

onMounted(async () => {
  await loadSites()
  if (router.currentRoute.value.query.id) {
    request.siteId = Number(router.currentRoute.value.query.site)
    request.referrerId = router.currentRoute.value.query.id
    uiControl.referrer = router.currentRoute.value.query.referrer
  } else {
    request.siteId = siteList.list[0].id
    if (LOGIN_USER_TYPE.value === TENANT.value) {
      site.value = siteList.list.find(
        s => s.siteName === store.state.user.siteName
      )
      request.siteId = site.value.id
    }
  }
  await loadMembers();
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

::v-deep(.el-table__row:not([class*='el-table__row--level-'])) {
  td:first-child {
    padding-left: 23px;
  }
}

.level-color {
  width: 30px;
  height: 30px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 5px;
}
</style>
