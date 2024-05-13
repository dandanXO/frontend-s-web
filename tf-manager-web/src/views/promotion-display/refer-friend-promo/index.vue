<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
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
          v-model="request.regTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="margin-left: 5px; width: 280px"
          :editable="false"
          :clearable="false"
        />
        <el-input
          v-model="request.loginName"
          style="margin-left: 5px; width: 200px;"
          size="small"
          :placeholder="t('fields.loginName')"
        />
        <el-input
          v-model="request.referrerName"
          style="margin-left: 5px; width: 200px;"
          size="small"
          :placeholder="t('fields.referrer')"
        />
        <el-button
          style="margin-left: 10px"
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="loadReferFriendRecords()"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.referFriendRecord') }}</span>
        </div>
      </template>
      <el-table :data="page.records" ref="table"
                row-key="id"
                size="small"
                highlight-current-row
                v-loading="page.loading"
                :empty-text="t('fields.noData')"
      >
        <el-table-column prop="referrerLoginName" :label="t('fields.referrer')" align="center" min-width="100">
          <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
            <router-link :to="`/member/details/${scope.row.referrerId}?site=${request.siteId}`">
              <el-link type="primary">{{ scope.row.referrerLoginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="referrerBet" :label="t('fields.bet')" align="center" min-width="100">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.referrerBet,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="referrerVipLevel" :label="t('fields.vipLevel')" align="center" min-width="120" />
        <el-table-column prop="referredLoginName" :label="t('fields.loginName')" align="center" min-width="120">
          <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
            <router-link :to="`/member/details/${scope.row.referredId}?site=${request.siteId}`">
              <el-link type="primary">{{ scope.row.referredLoginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="regTime" :label="t('fields.regTime')" align="center" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.regTime === null">-</span>
            <span
              v-if="scope.row.regTime !== null"
              v-formatter="{data: scope.row.regTime, timeZone: timeZone, type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="referredDeposit" :label="t('fields.depositAmount')" align="center" min-width="100">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.referredDeposit,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="referredBet" :label="t('fields.bet')" align="center" min-width="100">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.referredBet,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.operate')"
          align="right"
          v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:refer-friend-promo:distribute'])"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.hasClaimed" type="success" size="mini">{{ t('fields.distributed') }}</el-tag>
            <el-tag v-else-if="scope.row.isBlacklisted" type="danger" size="mini">{{ t('fields.blacklisted') }}</el-tag>
            <el-button
              v-else-if="scope.row.eligibility"
              size="mini"
              type="success"
              v-permission="['sys:refer-friend-promo:distribute']"
              @click="distributeRefer(scope.row)"
            >{{ t('fields.distributePrivilege') }}</el-button>
            <el-tag v-else-if="!scope.row.eligibility" type="warning" size="mini">{{ t('fields.ineligible') }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        :total="page.total"
        :page-sizes="[20, 50, 100, 150, 200]"
        @current-change="changepage"
        layout="total,sizes,prev, pager, next"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @size-change="loadReferFriendRecords()"
      />
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { hasPermission, hasRole } from '@/utils/util'
import moment from 'moment';
import { useI18n } from "vue-i18n";
import { getSiteListSimple } from '@/api/site';
import { useStore } from '@/store';
import { TENANT } from '@/store/modules/user/action-types';
import { distribute, getReferFriendPromo } from '@/api/refer-friend-promo';
import { ElMessage, ElMessageBox } from 'element-plus';
import { formatInputTimeZone } from "@/utils/format-timeZone"

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteList = reactive({
  list: []
});
let timeZone = null;

const defaultDate = convertDate(new Date());

const request = reactive({
  size: 20,
  current: 1,
  regTime: [defaultDate, defaultDate],
  siteId: null,
  loginName: null,
  referrerName: null
});

function resetQuery() {
  request.regTime = [defaultDate, defaultDate];
  request.siteId = siteList.list[0].id;
  request.loginName = null;
  request.referrerName = null;
}

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
  request.siteId = siteList.list[0].id;
};

function checkQuery() {
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone;
  if (request.regTime !== null) {
    if (request.regTime.length === 2) {
      query.regTime = JSON.parse(JSON.stringify(request.regTime));
      query.regTime[0] = formatInputTimeZone(query.regTime[0], timeZone, 'start');
      query.regTime[1] = formatInputTimeZone(query.regTime[1], timeZone, 'end');
      query.regTime = query.regTime.join(',')
    }
  }
  return query;
}

async function loadReferFriendRecords() {
  page.loading = true;
  const query = checkQuery();
  const { data: ret } = await getReferFriendPromo(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;

  page.loading = false;
}

function changepage(page) {
  request.current = page;
  loadReferFriendRecords();
}

function distributeRefer(row) {
  ElMessageBox.confirm(
    t('message.confirmRefer'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    const item = {};
    item.siteId = request.siteId;
    item.referrerId = row.referrerId;
    item.referredId = row.referredId;
    await distribute(item);
    await loadReferFriendRecords();
    ElMessage({ message: t('message.referSuccess'), type: "success" });
  });
}

onMounted(async() => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
}

.search {
  float: left;
  width: 100%;
  display: block;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
