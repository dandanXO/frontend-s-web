<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
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
        <el-date-picker
          v-model="request.sendTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="margin-left: 5px; width: 250px"
        />
        <el-select
          v-model="request.type"
          :placeholder="t('fields.type')"
          style="width: 150px; margin-left: 5px;"
          size="small"
          default-first-option
        >
          <el-option
            v-for="item in uiControl.searchType"
            :key="item.key"
            :label="t('messageType.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="request.memberName"
          size="small"
          style="margin-left: 5px; width: 150px;"
          :placeholder="t('fields.memberName')"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadMessage"
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
      @selection-change="handleSelectionChange"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="siteName" :label="t('fields.site')" />
      <el-table-column prop="type" :label="t('fields.type')">
        <template #default="scope">
          <span v-if="scope.row.type === null">-</span>
          <span v-else>{{ t('messageType.' + scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" :label="t('fields.title')" />
      <el-table-column prop="memberName" :label="t('fields.memberName')" />
      <el-table-column prop="content" :label="t('fields.content')" />
      <el-table-column prop="sendTime" :label="t('fields.sendTime')">
        <template #default="scope">
          <span v-if="scope.row.sendTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.sendTime !== null"
            v-formatter="{
              data: scope.row.sendTime,
              timeZone: scope.row.timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-pagination
    class="pagination"
    @current-change="changePage"
    layout="prev, pager, next"
    :page-size="request.size"
    :page-count="page.pages"
    :current-page="request.current"
  />
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { getSiteListSimple } from '../../../../api/site'
import {
  getMemberMessage,
} from '../../../../api/site-pm'
import { getVipList } from '../../../../api/vip'
import { useStore } from '../../../../store';
import { useI18n } from "vue-i18n";
import { TENANT } from '../../../../store/modules/user/action-types';

const store = useStore();
const { t } = useI18n();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const siteList = reactive({
  list: []
});

const uiControl = reactive({
  dialogVisible: false,
  removeBtn: true,
  receiptInputVisible: false,
  receiveType: [
    { typeName: 'All', value: 'ALL' },
    { typeName: 'Specific Recipient', value: 'MULTIPLE' },
    { typeName: 'Specific VIP', value: 'VIP' },
  ],
  size: null,
  importDialogVisible: false,
  type: [
    { key: 1, displayName: 'NOTIFICATION', value: 'NOTIFICATION' },
    { key: 2, displayName: 'ACTIVITY', value: 'ACTIVITY' },
    { key: 3, displayName: 'ANNOUNCEMENT', value: 'ANNOUNCEMENT' }
  ],
  searchType: [
    { key: 1, displayName: 'NOTIFICATION', value: 'NOTIFICATION' },
    { key: 2, displayName: 'ACTIVITY', value: 'ACTIVITY' },
    { key: 3, displayName: 'ANNOUNCEMENT', value: 'ANNOUNCEMENT' },
    { key: 4, displayName: 'PAYMENT', value: 'PAYMENT' }
  ]
})

const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
  sendTime: [],
  type: null,
  memberName: null,
})

function resetQuery() {
  request.sendTime = [];
  request.type = null;
  request.siteId = site.value ? site.value.id : siteList.list[0].id
  request.memberName = null;
}

const list = reactive({
  vips: [],
  members: [],
  sites: [],
})

let chooseMessage = []
function handleSelectionChange(val) {
  chooseMessage = val
  if (chooseMessage.length === 0) {
    uiControl.removeBtn = true
  } else if (chooseMessage.length === 1) {
    uiControl.removeBtn = false
  } else {
    uiControl.removeBtn = false
  }
}

const page = reactive({
  pages: 0,
  records: [],
})

async function loadMessage() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.sendTime.length === 2) {
    query.sendTime = request.sendTime.join(',')
  }
  const { data: ret } = await getMemberMessage(query)
  page.pages = ret.pages
  ret.records.forEach(data => {
    data.timeZone = store.state.user.sites.find(e => e.siteName === data.siteName) !== undefined
      ? store.state.user.sites.find(e => e.siteName === data.siteName).timeZone
      : null
  });
  page.records = ret.records
}

async function loadVipNameList() {
  const { data: ret } = await getVipList()
  // ret.forEach(function (entry) {
  //   var singleObj = {};
  //   singleObj.key = entry.id;
  //   singleObj.displayName = entry.name
  //   singleObj.value = entry.name;
  //   list.vips.push(singleObj);
  // });
  list.vips = ret
}

async function loadSites() {
  list.sites = []
  const { data: ret } = await getSiteListSimple()
  siteList.list = ret;
  ret.forEach(function (entry) {
    var singleObj = {}
    singleObj.key = entry.id
    singleObj.displayName = entry.siteName
    singleObj.value = entry.id
    list.sites.push(singleObj)
  })
}

onMounted(async() => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    request.siteId = siteList.list[0].id;
  }
  await loadMessage()
  await loadVipNameList()
})

function changePage(page) {
  request.current = page
  loadMessage()
}
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

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
.input-tag-wrapper {
  position: relative;
  font-size: 14px;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  outline: none;
  padding: 0 10px 0 5px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  margin-bottom: 16px;
}

.el-tag {
  margin-right: 4px;
}

.tag-input {
  background: transparent;
  border: none !important;
  font-size: 14px;
  height: 40px;
  outline: none;
  padding-left: 0;
  width: 100px;
}

.el-input-tag--mini .tag-input {
  height: 28px;
  line-height: 28px;
}

.el-input-tag--small .tag-input {
  height: 32px;
  line-height: 32px;
}

.el-input-tag--medium .tag-input {
  height: 36px;
  line-height: 36px;
}

::v-deep .el-autocomplete input {
  /* input { */
  /* background-color: red!important;  调试用的样式 */
  outline: none !important;
  border: none !important;
}
</style>
