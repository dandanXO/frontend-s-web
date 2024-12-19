<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.privilegeName"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.privilegeName')"
        />
        <el-input
          v-model="request.code"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.taskCode')"
        />
        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.taskName')"
        />
        <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.state')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="t('taskProgressStatus.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadTaskProgress"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
    </div>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="loginName" :label="t('fields.loginName')" width="150" />
      <el-table-column prop="sequence" :label="t('fields.sequence')" width="120" />
      <el-table-column prop="privilegeName" :label="t('fields.privilegeName')" width="200">
        <template #default="scope">
          <span v-if="scope.row.privilegeName">{{ scope.row.privilegeName }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="taskName" :label="t('fields.taskName')" width="200" />
      <el-table-column prop="taskCode" :label="t('fields.taskCode')" width="200" />
      <el-table-column prop="status" :label="t('fields.state')" width="200">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'ONGOING'" size="mini" type="warning">{{ t('taskProgressStatus.' + scope.row.status) }}</el-tag>
          <el-tag v-else-if="scope.row.status === 'COMPLETED'" size="mini" type="success">{{ t('taskProgressStatus.' + scope.row.status) }}</el-tag>
          <el-tag v-else size="mini" type="danger">{{ t('taskProgressStatus.' + scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="taskRules" :label="t('fields.taskRules')" width="300">
        <template #default="scope">
          <div v-if="scope.row.taskRules && scope.row.taskRules.length < 50">
            {{ scope.row.taskRules }}
          </div>
          <div v-else-if="scope.row.taskRules">
            <span style="cursor: pointer; color: dark;" @click="openModal(t('fields.taskRules'), scope.row.taskRules)">{{ scope.row.taskRules.substr(0,50) + "..." }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('fields.createTime')">
        <template #default="scope">
          <span
            v-if="scope.row.createTime"
            v-formatter="{data: scope.row.createTime, timeZone: scope.row.timeZone, type: 'date'}"
          />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" :label="t('fields.createBy')" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')">
        <template #default="scope">
          <span
            v-if="scope.row.updateTime"
            v-formatter="{data: scope.row.updateTime, timeZone: scope.row.timeZone, type: 'date'}"
          />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')">
        <template #default="scope">
          <span v-if="scope.row.updateBy">{{ scope.row.updateBy }}</span>
          <span v-else>-</span>
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
    <el-dialog
      v-model="uiControl.rulesDialogVisible"
      :title="uiControl.rulesDialogTitle"
      width="580px"
    >
      {{ uiControl.rulesDialogContent }}
    </el-dialog>
  </div>
</template>

<script setup>

import { computed, onMounted, reactive, ref } from "vue";
import { getMemberTaskProgress } from "@/api/task-progress";
import { getSiteListSimple } from "@/api/site";
import { useI18n } from "vue-i18n";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";

const store = useStore();
const { t } = useI18n();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const siteList = reactive({
  list: []
});

const uiControl = reactive({
  status: [
    { key: 1, displayName: "ONGOING", value: "ONGOING" },
    { key: 2, displayName: "COMPLETED", value: "COMPLETED" },
    { key: 3, displayName: "EXPIRED", value: "EXPIRED" }
  ],
  rulesDialogVisible: false,
  rulesDialogTitle: null,
  rulesDialogContent: null
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const request = reactive({
  size: 30,
  current: 1,
  status: null,
  siteId: null,
  loginName: null,
  taskName: null,
  taskCode: null
});

function resetQuery() {
  request.status = null;
  request.siteId = store.state.user.siteId
  request.loginName = null;
  request.taskName = null;
  request.taskCode = null;
}

async function loadTaskProgress() {
  page.loading = true;
  const { data: ret } = await getMemberTaskProgress(request);
  page.pages = ret.pages;
  ret.records.forEach(data => {
    data.timeZone = store.state.user.sites.find(e => e.id === data.siteId) !== undefined
      ? store.state.user.sites.find(e => e.id === data.siteId).timeZone
      : null
  });
  page.records = ret.records;
  page.loading = false;
}

function changePage(page) {
  request.current = page;
  loadTaskProgress();
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

function openModal(title, content) {
  uiControl.rulesDialogVisible = true
  uiControl.rulesDialogTitle = title
  uiControl.rulesDialogContent = content
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    request.siteId = store.state.user.siteId
  }
  await loadTaskProgress();
});

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
</style>
