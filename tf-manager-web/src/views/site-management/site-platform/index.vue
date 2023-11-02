<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 200px"
          @focus="loadSites"
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.platformId"
          size="small"
          :placeholder="t('fields.platform')"
          class="filter-item"
          style="width: 200px; margin-left: 5px"
          @focus="loadPlatforms"
        >
          <el-option
            v-for="item in platforms.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadSitePlatform"
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
      v-loading="page.loading"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      @selection-change="handleSelectionChange"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="siteName" :label="t('fields.siteName')" min-width="200" />
      <el-table-column prop="platformName" :label="t('fields.platformName')" min-width="200" />
      <el-table-column prop="status" :label="t('fields.status')" min-width="300">
        <template #default="scope">
          <el-radio-group
            v-model="scope.row.status"
            size="mini"
            style="width: 300px"
            @change="updateState(scope.row.id, scope.row.status)"
          >
            <el-radio-button label="OPEN">OPEN</el-radio-button>
            <el-radio-button label="CLOSE">CLOSE</el-radio-button>
            <el-radio-button label="TEST">TEST</el-radio-button>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" min-width="200" />
      <el-table-column
        prop="updateTime"
        :label="t('fields.updateTime')"
        align="center"
        min-width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <span
            v-if="scope.row.updateTime !== null"
            v-formatter="{
              data: scope.row.updateTime,
              formatter: 'YYYY/MM/DD HH:mm:ss',
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
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  getSitePlatformList,
  updateStatus
} from '../../../api/site-platform'
import { getSiteListSimple } from '../../../api/site'
import { getPlatformNames } from '../../../api/platform'
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})
const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
  platformId: null,
})

const sites = reactive({
  list: [],
})

const platforms = reactive({
  list: [],
})

function resetQuery() {
  request.siteId = site.value ? site.value.id : null
  request.platformId = null
}

async function loadSitePlatform() {
  page.loading = true
  const { data: ret } = await getSitePlatformList(request)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

async function loadPlatforms() {
  const { data: ret } = await getPlatformNames()
  platforms.list = ret
}

function changePage(page) {
  request.current = page
  loadSitePlatform()
}

async function updateState(id, status) {
  await updateStatus(id, status);
  await loadSitePlatform();
}

onMounted(async() => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  await loadSitePlatform()
  await loadPlatforms()
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

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>
