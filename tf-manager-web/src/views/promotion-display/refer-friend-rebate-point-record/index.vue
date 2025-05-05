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
          style="margin-left: 5px; width: 380px"
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
          @click="loadReferFriendRebatePointRecords()"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span"> {{ t('fields.referFriendRebatePointRecord') }}</span>
        </div>
      </template>
      <el-table :data="groupedRecords" ref="table"
                row-key="memberId"
                size="small"
                highlight-current-row
                v-loading="page.loading"
                :empty-text="t('fields.noData')"
                sortable
      >
        <el-table-column type="expand">
          <template #default="props">
            <el-table :data="props.row.children" size="small" border>
              <el-table-column prop="requirement" :label="t('fields.requirement')" align="center" min-width="180">
                <template #default="scope">
                  <span v-if="scope.row.requirement === null">-</span>
                  <span v-else>{{ t(`referRebatePoint.${scope.row.requirement}`) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="pts" :label="t('fields.pts')" align="center" min-width="180" />
              <el-table-column prop="createTime" :label="t('fields.createTime')" align="center" min-width="180">
                <template #default="scope">
                  <span v-if="scope.row.createTime === null">-</span>
                  <span
                    v-if="scope.row.createTime !== null"
                    v-formatter="{data: scope.row.createTime, timeZone: timeZone, type: 'date'}"
                  />
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="loginName" :label="t('fields.loginName')" align="center" min-width="180" :show-overflow-tooltip="true" class-name="no-expand-icon" />
        <el-table-column prop="referrerName" :label="t('fields.referrer')" align="center" min-width="180" :show-overflow-tooltip="true" />
        <el-table-column prop="registerTime" :label="t('fields.registerTime')" align="center" min-width="180">
          <template #default="scope">
            <span v-if="scope.row.registerTime === null">-</span>
            <span
              v-if="scope.row.registerTime !== null"
              v-formatter="{data: scope.row.registerTime, timeZone: timeZone, type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="rebateStatus" :label="t('fields.referFriendRebatePointStatus')" align="center" min-width="180" />
        <el-table-column prop="ptsRebateAmount" :label="t('fields.ptsRebateAmount')" align="center" min-width="180">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.ptsRebateAmount,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="ftdRebateAmount" :label="t('fields.ftdRebateAmount')" align="center" min-width="180">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.ftdRebateAmount,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="sumPts" :label="t('fields.sumPts')" align="center" min-width="180" />
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
        @size-change="loadReferFriendRebatePointRecords()"
      />
    </el-card>
  </div>

</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import moment from 'moment';
import { useI18n } from "vue-i18n";
import { getSiteListSimple } from '@/api/site';
import { useStore } from '@/store';
import { TENANT } from '@/store/modules/user/action-types';
import { getReferFriendRebatePointRecord } from '@/api/refer-friend-rebate-record';

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteList = reactive({
  list: []
});

const defaultDate = convertDate(new Date());

const request = reactive({
  size: 50,
  current: 1,
  createTime: [getStartOfDay(defaultDate), getEndOfDay(defaultDate)],
  siteId: null,
  loginName: null,
  referrerName: null
});

function resetQuery() {
  request.createTime = [getStartOfDay(defaultDate), getEndOfDay(defaultDate)];
  request.siteId = store.state.user.siteId;
  request.loginName = null;
  request.referrerName = null;
}

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
});

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

function getStartOfDay(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
}

function getEndOfDay(date) {
  return moment(date).endOf('day').format('YYYY-MM-DD HH:mm:ss');
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
  request.siteId = store.state.user.siteId
};

function checkQuery() {
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.createTime !== null) {
    if (request.createTime.length === 2) {
      query.createTime = [
        getStartOfDay(request.createTime[0]),
        getEndOfDay(request.createTime[1])
      ].join(",");
    }
  }
  return query;
}

async function loadReferFriendRebatePointRecords() {
  page.loading = true;
  const query = checkQuery();
  const { data: ret } = await getReferFriendRebatePointRecord(query);
  page.pages = ret.pages;
  page.records = ret.records;

  page.total = ret.total;
  page.loading = false;
  console.log("ret : ", page.records)
}

function changepage(page) {
  request.current = page;
  loadReferFriendRebatePointRecords();
}

const groupedRecords = computed(() => {
  const groups = {};
  page.records.forEach(record => {
    if (!groups[record.memberId]) {
      groups[record.memberId] = {
        memberId: record.memberId,
        loginName: record.loginName,
        referrerId: record.referrerId,
        referrerName: record.referrerName,
        registerTime: record.registerTime,
        rebateStatus: record.rebateStatus,
        ptsRebateAmount: record.ptsRebateAmount,
        ftdRebateAmount: record.ftdRebateAmount,
        sumPts: 0,
        children: []
      };
    }
    groups[record.memberId].children.push(record);
    groups[record.memberId].sumPts += record.pts;
  });
  return Object.values(groups);
});

onMounted(async() => {
  await loadSites();
  request.siteId = store.state.user.siteId
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

  :deep(.el-table__row) .no-expand-icon .el-table__expand-icon {
    display: none;
  }
  </style>
