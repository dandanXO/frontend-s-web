<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.sportId"
          size="small"
          :placeholder="t('fields.sportType')"
          class="filter-item"
          style="width: 120px; margin-left: 10px"
        >
          <el-option
            v-for="item in uiControl.sport"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 120px; margin-left: 10px"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="request.matchName"
          size="small"
          style="width: 200px; margin-left: 10px"
          :placeholder="t('fields.name')"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadLiveMatchMars()"
        >{{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          @click="removeMatchMars()"
          :disabled="uiControl.removeBtn"
        >{{ t('fields.delete') }}</el-button>
      </div>
    </div>

    <el-dialog
      v-if="uiControl.dialogType === 'ADD_TO_LIVE'"
      v-model="uiControl.dialogVisible"
      :title="uiControl.dialogTitle"
      append-to-body
      width="580px"
    >
      <el-form
        ref="formLive"
        :model="formLive"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.match_id')" prop="match_id">
          {{ currentRow.match_id }}
        </el-form-item>
        <el-form-item :label="t('fields.sport_id')" prop="sport_id">
          {{ currentRow.sport_id }}
        </el-form-item>
        <el-form-item :label="t('fields.match_title')" prop="match_title">
          {{ currentRow.match_title }}
        </el-form-item>
        <el-form-item :label="t('fields.home_team')" prop="home_team">
          {{ currentRow.home_team }}
        </el-form-item>
        <el-form-item :label="t('fields.home_team_id')" prop="home_team_id">
          {{ currentRow.home_team_id }}
        </el-form-item>
        <el-form-item :label="t('fields.away_team')" prop="away_team">
          {{ currentRow.away_team }}
        </el-form-item>
        <el-form-item :label="t('fields.away_team_id')" prop="away_team_id">
          {{ currentRow.away_team_id }}
        </el-form-item>
        <el-form-item :label="t('fields.match_time')" prop="match_time">
          {{ currentRow.match_time }}
        </el-form-item>
        <el-form-item :label="t('fields.status')" prop="status">
          <!-- {{ currentRow.status }} -->
          <el-tag v-if="currentRow.status === 'live'" type="success">{{ t('status.marsMatch.ONGOING') }}</el-tag>
          <el-tag v-else-if="currentRow.status === 'past'" type="danger">{{ t('status.marsMatch.ENDED') }}</el-tag>
          <el-tag v-else-if="currentRow.status === 'cancel'" type="warning">{{ t('status.marsMatch.CANCEL') }}</el-tag>
          <el-tag v-else-if="currentRow.status === 'pending'" type="danger">{{ t('status.marsMatch.PENDING') }}</el-tag>
          <el-tag v-else-if="currentRow.status === 'upcoming'" type="warning">{{ t('status.marsMatch.NOT_STARTED') }}</el-tag>
          <el-tag v-else type="default">{{ t('status.marsMatch.OTHER') }}</el-tag>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="handleCopy">
            {{ t('fields.addToLive') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      @selection-change="handleSelectionChange"
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="matchId" :label="t('fields.id')" width="100" />
      <el-table-column prop="sportId" :label="t('fields.sportType')" width="100">
        <template #default="scope">
          <span>{{ getSportDisplayName(scope.row.sportId) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="nameZh" :label="t('fields.competitionNameZh')" width="250" />
      <el-table-column prop="nameEn" :label="t('fields.competitionNameEn')" width="250" />
      <el-table-column prop="homeTeamId" :label="t('fields.homeTeam')" width="250">
        <template #default="scope">
          <img v-if="scope.row.homeTeamLogo" :src="scope.row.homeTeamLogo" style="width: 24px; height: 24px; margin-right: 8px;">
          <span>{{ scope.row.homeTeamNameZh || scope.row.homeTeamNameEn }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="awayTeamId" :label="t('fields.awayTeam')" width="250">
        <template #default="scope">
          <img v-if="scope.row.awayTeamLogo" :src="scope.row.awayTeamLogo" style="width: 24px; height: 24px; margin-right: 8px;">
          <span>{{ scope.row.awayTeamNameZh || scope.row.awayTeamNameEn }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="matchTime" :label="t('fields.matchTime')" width="180">
        <template #default="scope">
          <span
            v-if="scope.row.matchTime !== null"
            v-formatter="{
              data: scope.row.matchTime,
              timeZone: timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="supplierStreamUrl" :label="t('fields.isCreateLiveUrl')" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.supplierStreamUrl !== null" type="success">{{ t('fields.yes') }}</el-tag>
          <el-tag v-else type="danger">{{ t('fields.no') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="t('fields.status')" width="100">
        <!-- <template #default="scope">
          <span>{{ getStatusDisplayName(scope.row.status) }}</span>
        </template> -->

        <template #default="scope">
          <el-tag v-if="scope.row.status === 'live'" type="success">{{ t('status.marsMatch.ONGOING') }}</el-tag>
          <el-tag v-else-if="scope.row.status === 'past'" type="danger">{{ t('status.marsMatch.ENDED') }}</el-tag>
          <el-tag v-else-if="scope.row.status === 'cancel'" type="warning">{{ t('status.marsMatch.CANCEL') }}</el-tag>
          <el-tag v-else-if="scope.row.status === 'pending'" type="danger">{{ t('status.marsMatch.PENDING') }}</el-tag>
          <el-tag v-else-if="scope.row.status === 'upcoming'" type="warning">{{ t('status.marsMatch.NOT_STARTED') }}</el-tag>
          <el-tag v-else type="default">{{ t('status.marsMatch.OTHER') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.operate')" align="right" fixed="right">
        <template #default="scope">
          <el-button
            icon="el-icon-refresh"
            size="mini"
            type="success"
            @click="refreshLiveUrl(scope.row)"
          />
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="primary"
            @click="showDialog('ADD_TO_LIVE', scope.row)"
          >
            {{ t('fields.addToLive') }}
          </el-button>
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

import { onMounted, reactive, watch } from "vue";
import { getLiveMatchMars, addToLive, refreshToGetLiveUrl, deleteLiveMatchMars } from "../../../api/live-match-mars";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from "element-plus";

const { t } = useI18n();

const currentRow = reactive({});

const uiControl = reactive({
  dialogVisible: false,
  sport: [{ key: 1, displayName: "FOOTBALL", value: 1 }, { key: 2, displayName: 'BASKETBALL', value: 2 }],
  status: [
    { key: 'upcoming', displayName: t('status.marsMatch.NOT_STARTED'), value: 'upcoming' },
    { key: 'live', displayName: t('status.marsMatch.ONGOING'), value: 'live' },
    { key: 'past', displayName: t('status.marsMatch.ENDED'), value: 'past' },
    { key: 'pending', displayName: t('status.marsMatch.PENDING'), value: 'pending' },
    { key: 'cancel', displayName: t('status.marsMatch.CANCEL'), value: 'cancel' }
  ]
});

const formLive = reactive({
  match_id: null,
  sport_id: null,
  match_title: null,
  home_team: null,
  home_team_id: null,
  away_team: null,
  away_team_id: null,
  match_time: null,
  status: null,
});

const formLivePost = reactive({
  matchId: null,
  sportId: null,
  status: null,
  title: null,
});

const request = reactive({
  current: 1,
  size: 30,
  sportId: null,
  status: null,
  matchName: null
});

const page = reactive({
  records: [],
  pages: 0,
  loading: false
});

async function handleCopy() {
  const ret = await addToLive(formLivePost);
  if (ret.code === 0) {
    ElMessage.success(t('fields.copySuccess'));
    uiControl.dialogVisible = false;
  } else {
    ElMessage.error(t('fields.copyFailed'));
  }
}

async function refreshLiveUrl(row) {
  const ret = await refreshToGetLiveUrl(row.id);

  if (ret.code === 0) {
    ElMessage.success(t('fields.success'));
  } else {
    ElMessage.error(t('fields.failed'));
  }
}

function showDialog(type, row) {
  uiControl.dialogTitle = t('fields.addToLive')
  Object.assign(currentRow, row); // Store the row data
  currentRow.match_id = formLive.match_id = row.matchId; // Note: matchId (from row) → match_id (in currentRow)
  currentRow.sport_id = formLive.sport_id = row.sportId;
  currentRow.match_title = formLive.match_title = row.nameZh || row.nameEn;
  currentRow.home_team = formLive.home_team = row.homeTeamNameZh || row.homeTeamNameEn;
  currentRow.home_team_id = formLive.home_team_id = row.homeTeamId;
  currentRow.away_team = formLive.away_team = row.awayTeamNameZh || row.awayTeamNameEn;
  currentRow.away_team_id = formLive.away_team_id = row.awayTeamId;
  currentRow.match_time = formLive.match_time = formatTime(row.matchTime);
  currentRow.status = formLive.status = row.status; // This works because names match
  switch (currentRow.status) {
    case 'upcoming':
      formLivePost.status = 1;
      break;
    case 'live':
      formLivePost.status = 2;
      break;
    case 'past':
      formLivePost.status = 3;
      break;
    case 'pending':
      formLivePost.status = 15;
      break;
    case 'cancel':
      formLivePost.status = 12;
      break;
    default:
      formLivePost.status = 1;
      break;
  }

  formLivePost.matchId = currentRow.match_id;
  formLivePost.sportId = currentRow.sport_id;
  formLivePost.title = currentRow.match_title;

  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

let choseMatchMars = []

function handleSelectionChange(val) {
  choseMatchMars = val;
  if (choseMatchMars.length === 0) {
    uiControl.removeBtn = true;
  } else if (choseMatchMars.length === 1) {
    uiControl.removeBtn = false;
  } else {
    uiControl.removeBtn = false;
  }
  console.log("choseMatchMars", choseMatchMars)
}

function removeMatchMars(matchMars) {
  console.log("matchMars", matchMars)
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    await deleteLiveMatchMars(choseMatchMars.map(a => a.id));
    await loadLiveMatchMars()
    ElMessage({ message: t('message.deleteSuccess'), type: "success" });
  });
}

function resetQuery() {
  request.sportId = null
  request.status = null
  request.matchName = null
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadLiveMatchMars()
  }
}

function getSportDisplayName(sportId) {
  const found = uiControl.sport.find(item => item.key === sportId);
  return found ? found.displayName : sportId;
}

function formatTime(ts) {
  if (!ts) return '-'
  const d = new Date(ts)
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

async function loadLiveMatchMars() {
  const { data: ret } = await getLiveMatchMars(request);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

// Reset currentRow when dialog closes
watch(() => uiControl.dialogVisible, (visible) => {
  if (!visible) Object.assign(currentRow, {});
});

onMounted(async () => {
  loadLiveMatchMars();
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
