<template>
  <div class="roles-main">
    <div class="header-container" style="margin-bottom: 40px">
      <div class="search">

        <el-date-picker
          v-model="request.date"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="date"
          :placeholder="t('fields.recordTime')"
          :editable="false"
          style="padding-bottom: 10px; width: 300px;"
        />

        <el-select
          v-model="request.privilegeId"
          size="small"
          :placeholder="t('fields.privilege')"
          class="filter-item"
          style="padding-bottom: 10px; width: 300px;"
        >
          <el-option
            v-for="item in requestPriviList.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>

        <div class="btn-group" v-permission="['sys:member-privilege-record:export']">
          <el-button
            size="mini"
            type="primary"
            @click="requestExportExcel"
          >{{ t('fields.requestExportToExcel') }}
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
    </div>
  </div>
  <el-dialog :title="t('fields.exportToExcel')" v-model="uiControl.messageVisible" append-to-body width="500px"
             :close-on-click-modal="false" :close-on-press-escape="false"
  >
    <span>{{ t('message.requestExportToExcelDone1') }}</span>
    <router-link :to="`/site-management/download-manager`">
      <el-link type="primary">
        {{ t('menu.DownloadManager') }}
      </el-link>
    </router-link>
    <span>{{ t('message.requestExportToExcelDone2') }}</span>
  </el-dialog>
</template>

<script setup>

import { onMounted, reactive } from "vue";
import { useI18n } from "vue-i18n";
import moment from "moment/moment";
import { useStore } from "@/store";
import { getActivePrivilegeInfoBySiteId } from "../../../api/privilege-info";
import { getMemberPrivilegeExport } from "../../../api/member-privilege";

const { t } = useI18n();
const store = useStore()
const uiControl = reactive({
  messageVisible: false,
});

const defaultDate = convertDate(new Date());

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

const request = reactive({
  siteId: store.state.user.siteId,
  privilegeId: null,
  date: defaultDate
});

const requestPriviList = reactive({
  list: []
});

async function loadPrivilegeInfos(siteId) {
  const { data: privilegeInfo } = await getActivePrivilegeInfoBySiteId(siteId)
  requestPriviList.list = privilegeInfo
}

function resetQuery() {
  request.siteId = store.state.user.siteId
  request.privilegeId = null
  request.date = defaultDate
}

function checkQuery() {
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  return query;
}

async function requestExportExcel() {
  const query = checkQuery();
  query.requestBy = store.state.user.name;
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const { data: ret } = await getMemberPrivilegeExport(query);
  if (ret) {
    uiControl.messageVisible = true;
  }
}

onMounted(async() => {
  request.siteId = store.state.user.siteId
  await loadPrivilegeInfos(request.siteId)
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
