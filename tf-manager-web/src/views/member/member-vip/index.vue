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
          <el-button
            size="mini"
            type="primary"
            v-permission="['sys:member-vip:list']"
            @click="requestExportExcel"
          >{{ t('fields.requestExportToExcel') }}
          </el-button>
          <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
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
import { getMemberVipExport } from "../../../api/member-vip";
import { useI18n } from "vue-i18n";
import { getSiteListSimple } from "../../../api/site";
import moment from "moment/moment";
import { useStore } from "@/store";

const { t } = useI18n();
const store = useStore()
const uiControl = reactive({
  messageVisible: false,
});

// const page = reactive({
//   pages: 0,
//   records: [],
//   colors: [
//     { color: '#f56c6c', percentage: 30 },
//     { color: '#e6a23c', percentage: 70 },
//     { color: '#5cb87a', percentage: 100 }
//   ],
// });

// const exportPercentage = ref(0);
//
// const EXPORT_HEADER = ['Login Name', 'VIP Level'];

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

function checkQuery() {
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
  return query;
}

async function requestExportExcel() {
  const query = checkQuery();
  query.requestBy = store.state.user.name;
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const { data: ret } = await getMemberVipExport(query);
  if (ret) {
    uiControl.messageVisible = true;
  }
}

// async function loadMemberVip() {
//   page.progressBarVisible = true;
//   const requestCopy = { ...request };
//   const query = {};
//   Object.entries(requestCopy).forEach(([key, value]) => {
//     if (value) {
//       query[key] = value;
//     }
//   });
//   if (query.loginName !== null) {
//     query.loginName = query.loginName.replaceAll('\n', ',');
//   }
//   query.current = 1;
//   const { data: ret } = await getMemberVip(query);
//   const exportData = [EXPORT_HEADER];
//   const maxLength = [];
//
//   pushRecordToData(ret.records, exportData);
//   exportPercentage.value = Math.round(ret.current / (ret.pages + 1) * 100);
//   query.current = ret.current;
//
//   while (query.current < ret.pages) {
//     query.current += 1;
//     const { data: ret } = await getMemberVip(query);
//     pushRecordToData(ret.records, exportData);
//     exportPercentage.value = Math.round(ret.current / (ret.pages + 1) * 100);
//   }
//   const ws = XLSX.utils.aoa_to_sheet(exportData);
//   exportData.map(data => {
//     Object.keys(data).map(key => {
//       const value = data[key];
//
//       maxLength[key] = typeof value === 'number'
//         ? (maxLength[key] >= 10 ? maxLength[key] : 10)
//         : (maxLength[key] >= value.length + 2 ? maxLength[key] : value.length + 2);
//     });
//   });
//   const wsCols = maxLength.map(w => { return { width: w } });
//   ws['!cols'] = wsCols;
//   const wb = XLSX.utils.book_new();
//   wb.SheetNames.push('Member_VIP');
//   wb.Sheets.Member_VIP = ws;
//   XLSX.writeFile(wb, "member_vip.xlsx");
//   exportPercentage.value = 100;
// }
//
// function pushRecordToData(records, exportData) {
//   records.forEach(item => {
//     delete item.id;
//     delete item.vipId;
//     delete item.vipLevel;
//   })
//   const data = records.map(record => Object.values(record).map(item => item !== 0 && (!item || item === '') ? '-' : item));
//   exportData.push(...data);
// }

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
