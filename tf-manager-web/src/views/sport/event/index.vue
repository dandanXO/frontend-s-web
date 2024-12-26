<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.supplierName"
          size="small"
          :placeholder="t('fields.platform')"
          class="filter-item"
          default-first-option
        >
          <el-option
            v-for="item in uiControl.supplier"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>

        <el-select
          v-model="request.sportType"
          size="small"
          :placeholder="t('fields.sportType')"
          class="filter-item"
          style="width: 120px;"
        >
          <el-option
            v-for="item in gameTypes.list"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>

        <el-input
          v-model="request.eventName"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.eventName')"
        />

        <el-input
          v-model="request.competitionName"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.tfCompetitionName')"
        />

        <!-- 事件状态选择 -->
        <el-select
          clearable
          v-model="request.eventStatus"
          size="small"
          :placeholder="t('fields.tfEventStatusName')"
          style="width: 200px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.eventStatus"
            :key="item"
            :label="item.display"
            :value="item.name"
          />
        </el-select>

        <!-- 创建时间选择 -->
        <el-date-picker
          v-model="request.createTime"
          format="DD/MM/YYYY HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
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

        <!-- 搜索按钮 -->
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadPlatform">
          {{ t('fields.search') }}
        </el-button>

        <!-- 重置按钮 -->
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group" :hidden="true">
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog('CREATE')">
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>
    <el-dialog v-model="uiControl.dialogVisible" width="80%">
      <template #title>
        {{ tfHomeTeamName }} vs {{ tfAwayTeamName }}
      </template>
      <div v-for="marketLine in tfMarketLines" :key="marketLine.BetTypeId" class="market-section">
        <span class="bet-type">{{ translateBetType(marketLine.BetTypeId, marketLine.WagerSelections || '') }}</span>
        <span class="period-name">{{ marketLine.PeriodName }}</span>
        <table class="market-table">
          <thead>
            <tr>
              <th>{{ t('fields.selection') }}</th>
              <th>{{ t('fields.odds') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="selection in marketLine.WagerSelections" :key="selection.SelectionId">
              <td class="selection-name">
                {{ translateSelectionName(selection.SelectionName, selection.Specifiers) }}
                {{ selection.Handicap || '' }}
              </td>
              <td class="selection-odds">{{ selection.OddsList[0]?.OddsValues.A }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-table :data="page.records" v-loading="page.loading" ref="table" row-key="id" size="small" highlight-current-row>
      <el-table-column prop="_id" :label="t('fields.id')" width="200" />
      <el-table-column prop="tfSportName" :label="t('fields.sportType')" width="200" />
      <el-table-column prop="tfCompetitionName" :label="t('fields.tfCompetitionName')" width="200" />
      <el-table-column prop="tfEventName" :label="t('fields.eventName')" width="200" />
      <el-table-column prop="startTime" :label="t('fields.startTime')" width="200" />
      <el-table-column prop="endTime" :label="t('fields.endTime')" width="200" />
      <el-table-column prop="tfEventStatusName" :label="t('fields.tfEventStatusName')" width="200" />
      <el-table-column :label="t('fields.operate')" align="right" fixed="right">
        <template #default="scope" :hidden="true">
          <el-button icon="el-icon-plus" size="mini" @click="showDialog(scope.row._id)" />
        </template>
      </el-table-column>
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

import { onMounted, reactive, ref } from "vue";
import { getSportTypes } from "../../../api/sport";
import { useI18n } from "vue-i18n";
import { useStore } from "@/store";
import { getSiteTimeZoneById } from "@/api/site";
import { getShortcuts, convertDateToStart, convertDateToEnd, disabledDate } from '@/utils/datetime';
import { getEvents } from "../../../api/sport-event";

const { t } = useI18n();
const shortcuts = getShortcuts(t);
const tfMarketLines = ref([]);
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true,
  dialogLoading: false,
  supplier: [
    { name: 'IM', display: 'IM' },
    { name: 'IM', display: 'FB' },
  ],
  eventStatus: [
    { name: '1', display: t('fields.active') },
    { name: '2', display: t('fields.inactive') },
  ],
});
const page = reactive({
  pages: 0,
  records: [],
  loading: false
});
const request = reactive({
  size: 30,
  current: 1,
  orderBy: "_id",
  supplierName: null,
  sportType: null,
  siteId: null,
  eventStatus: null,
  eventName: null,
  competitionName: null,
  createTime: [convertDateToStart(new Date()), convertDateToEnd(new Date())],
});

const gameTypes = reactive({
  list: [],
})

const timezone = ref(null);

const tfHomeTeamName = ref('');
const tfAwayTeamName = ref('');

function resetQuery() {
  request.sportType = null;
  request.supplierName = null;
  request.sportType = null;
  request.siteId = null;
  request.eventStatus = null;
  request.eventName = null;
  request.competitionName = null;
  request.createTime = [];
}

async function loadPlatform() {
  page.loading = true;
  const { data: ret } = await getEvents(request);
  ret.records.forEach(record => {
    if (!record.tfEventDateTimestamp) {
      return;
    }
    record.startTime = formatTimestamp(record.tfEventDateTimestamp);

    if (record.tfEventEndTimestamp != null) {
      record.endTime = formatTimestamp(record.tfEventEndTimestamp);
    }
  });
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

function changePage(page) {
  request.current = page;
  loadPlatform();
}

function showDialog(id) {
  const record = getRecordById(id);
  tfHomeTeamName.value = record.tfHomeTeamName;
  tfAwayTeamName.value = record.tfAwayTeamName;
  tfMarketLines.value = record.tfMarketLines;
  uiControl.dialogVisible = true;
}

function getRecordById(id) {
  return page.records.find(record => record._id === id);
}

function translateBetType(betTypeId, wagerSelections = []) {
  const key = `fields.betType_${betTypeId}`;
  const combinedSpecifiers = wagerSelections
    .map((selection) => selection.Specifiers || '')
    .filter((specifier) => specifier)
    .join('&');

  const specifierValues = parseSpecifiers(combinedSpecifiers);

  return t(key, specifierValues);
}

function translateSelectionName(selectionName, specifiers = '') {
  if (!selectionName.includes('{')) return selectionName;

  const params = parseSpecifiers(specifiers);
  return selectionName.replace(/\{(\w+)}/g, (_, p1) => params[p1] || `{${p1}}`);
}

function parseSpecifiers(specifiers) {
  const result = {};
  if (!specifiers) return result;

  specifiers.split('&').forEach((pair) => {
    const [key, value] = pair.split('=');

    result[key] = value;
  });

  return result;
}

async function loadGameTypes() {
  const { data: ret } = await getSportTypes()
  gameTypes.list = ret
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const full = date.toLocaleString('en-US', {
    timeZone: timezone.value,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  return full.replace(',', '');
}

onMounted(() => {
  const store = useStore()
  const { data: timeZone } = getSiteTimeZoneById(
    store.state.user.siteId
  )
  timezone.value = timeZone
  loadGameTypes();
  loadPlatform();
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

.market-section {
  margin-bottom: 20px;
}

.market-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.market-table th {
  text-align: left;
  background-color: #f5f5f5;
  padding: 10px;
  border-bottom: 2px solid #ddd;
}

.market-table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.selection-name {
  color: orange;
}

.selection-odds {
  color: black;
}

.bet-type {
  font-weight: bold;
  color: #000;
}

.period-name {
  font-weight: normal;
  color: #FF8C00;
  margin-left: 8px;
}
</style>
