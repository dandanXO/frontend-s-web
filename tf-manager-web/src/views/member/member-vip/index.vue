<template>
  <div class="roles-main">
    <div class="header-container" style="margin-bottom: 40px">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 250px;"
          default-first-option
          @focus="loadSites"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-input type="textarea" v-model="request.loginName" :rows="4" style="width: 400px; margin-top: 5px;" :placeholder="t('fields.loginName')" />
        <div class="btn-group">
          <el-button icon="el-icon-search" size="mini" type="success" @click="loadMemberVip">
            {{ t('fields.search') }}
          </el-button>
          <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
            {{ t('fields.reset') }}
          </el-button>
        </div>
      </div>
    </div>
    <el-table
      :data="page.records"
      v-loading="page.loading"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      style="width: 100%;margin: 20px;"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="loginName" :label="t('fields.loginName')" min-width="250" />
      <el-table-column prop="vipName" :label="t('fields.vipLevel')" min-width="250" />
    </el-table>
    <el-pagination class="pagination"
                   @current-change="changePage"
                   layout="prev, pager, next"
                   :page-size="request.size"
                   :page-count="page.pages"
                   :current-page="request.current"
    />
  </div>
</template>

<script setup>

import { onMounted, reactive } from "vue";
import { getMemberVip } from "../../../api/member-vip";
import { useI18n } from "vue-i18n";
import { getSiteListSimple } from "../../../api/site";

const { t } = useI18n();
const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const request = reactive({
  size: 30,
  current: 1,
  loginName: null,
  siteId: 0
});

const siteList = reactive({
  list: []
});

function resetQuery() {
  request.loginName = null;
  request.siteId = siteList.list[0].id;
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

async function loadMemberVip() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (query.loginName !== null) {
    query.loginName = query.loginName.replaceAll('\n', ',');
  }
  console.log(query.loginName)
  const { data: ret } = await getMemberVip(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

function changePage(page) {
  request.current = page;
  loadMemberVip();
}

onMounted(async() => {
  await loadSites();
  request.siteId = siteList.list[0].id
});

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: grid;
  justify-content: flex-start;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

.btn-group {
  margin-top: 15px;
}

</style>
