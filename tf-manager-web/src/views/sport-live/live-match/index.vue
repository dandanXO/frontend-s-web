<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.sportId"
          size="small"
          :placeholder="t('fields.sportType')"
          class="filter-item"
          style="width: 120px;"
        >
          <el-option
            v-for="item in uiControl.sport"
            :key="item.name"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="request.liveStatus"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 120px;"
        >
          <el-option
            v-for="item in uiControl.liveStatus"
            :key="item.name"
            :label="item.display"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="request.title"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.matchTitle')"
        />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadMatch">
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
    <el-table :data="page.records" v-loading="page.loading" row-key="matchId" size="small" highlight-current-row :empty-text="t('fields.noData')">
      <el-table-column prop="matchId" label="ID" width="100" />
      <el-table-column :label="t('fields.sportType')" width="100">
        <template #default="scope">
          {{ getSportDisplayName(scope.row.sportId) }}
        </template>
      </el-table-column>
      <el-table-column prop="competitionNameZh" :label="t('fields.competitionNameZh')" width="250" />
      <el-table-column prop="competitionNameEn" :label="t('fields.competitionNameEn')" width="250" />
      <el-table-column :label="t('fields.homeTeam')" width="180">
        <template #default="scope">
          <img v-if="scope.row.home.icon" :src="scope.row.home.icon" style="width: 24px; height: 24px; margin-right: 8px;">
          <span>{{ scope.row.home.nameZh || scope.row.home.nameEn }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.awayTeam')" width="180">
        <template #default="scope">
          <img v-if="scope.row.away.icon" :src="scope.row.away.icon" style="width: 24px; height: 24px; margin-right: 8px;">
          <span>{{ scope.row.away.nameZh || scope.row.away.nameEn }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="matchTime" :label="t('fields.matchTime')" width="180">
        <template #default="scope">
          {{ formatTime(scope.row.matchTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="isCreateLiveUrl" :label="t('fields.isCreateLiveUrl')" width="100">
        <template #default="scope">
          <el-tag v-if="hasStreamId(scope.row)" type="success">{{ t('fields.yes') }}</el-tag>
          <el-tag v-else type="danger">{{ t('fields.no') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="statusId" :label="t('fields.status')" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.statusId === 0" type="danger">{{ t('status.namiMatch.GAME_EXCEPTION') }}</el-tag>
          <el-tag v-else-if="scope.row.statusId === 1" type="warning">{{ t('status.namiMatch.ONGOING') }}</el-tag>
          <el-tag v-else-if="scope.row.statusId === 2" type="success">{{ t('status.namiMatch.ENDED') }}</el-tag>
          <el-tag v-else-if="scope.row.statusId === 3" type="danger">{{ t('status.namiMatch.CANCEL') }}</el-tag>
          <el-tag v-else-if="scope.row.statusId === 11" type="danger">{{ t('status.namiMatch.INTERRUPTED') }}</el-tag>
          <el-tag v-else-if="scope.row.statusId === 12" type="warning">{{ t('status.namiMatch.CANCEL') }}</el-tag>
          <el-tag v-else-if="scope.row.statusId === 13" type="danger">{{ t('status.namiMatch.DELAYED') }}</el-tag>
          <el-tag v-else-if="scope.row.statusId === 14" type="danger">{{ t('status.namiMatch.ABANDONED') }}</el-tag>
          <el-tag v-else-if="scope.row.statusId === 15" type="danger">{{ t('status.namiMatch.PENDING') }}</el-tag>
          <el-tag v-else type="default">{{ getLiveStatusDisplayName(scope.row.statusId) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.operate')" align="right" fixed="right">
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="primary"
            @click="showDialog(scope.row)"
          >
            {{ t('fields.edit') }}
          </el-button>
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
    <el-dialog
      v-model="dialogVisible"
      :title="t('fields.copyToLive')"
      width="400px"
    >
      <div v-if="currentRow" class="match-info-list">
        <div class="match-info-row">
          <span class="label">ID：</span>
          <span class="value">{{ currentRow.matchId }}</span>
        </div>
        <div class="match-info-row">
          <span class="label">{{ t('fields.sportType') }}：</span>
          <span class="value">{{ getSportDisplayName(currentRow.sportId) }}</span>
        </div>
        <div class="match-info-row">
          <span class="label">{{ t('fields.matchTitle') }}：</span>
          <span class="value">{{ currentRow.title || currentRow.competitionNameZh }}</span>
        </div>
        <div class="match-info-row">
          <span class="label">{{ t('fields.homeTeam') }}：</span>
          <span class="value">{{ currentRow.home?.nameZh || currentRow.home?.nameEn }}</span>
        </div>
        <div class="match-info-row">
          <span class="label">{{ t('fields.homeTeam') }}ID：</span>
          <span class="value">{{ currentRow.home?.namiId }}</span>
        </div>
        <div class="match-info-row">
          <span class="label">{{ t('fields.awayTeam') }}：</span>
          <span class="value">{{ currentRow.away?.nameZh || currentRow.away?.nameEn }}</span>
        </div>
        <div class="match-info-row">
          <span class="label">{{ t('fields.awayTeam') }}ID：</span>
          <span class="value">{{ currentRow.away?.namiId }}</span>
        </div>
        <div class="match-info-row">
          <span class="label">{{ t('fields.matchTime') }}：</span>
          <span class="value">{{ formatTime(currentRow.matchTime) }}</span>
        </div>
        <div class="match-info-row">
          <span class="label">{{ t('fields.status') }}：</span>
          <el-tag v-if="currentRow.statusId === 0" type="danger">{{ t('status.namiMatch.GAME_EXCEPTION') }}</el-tag>
          <el-tag v-else-if="currentRow.statusId === 1" type="warning">{{ t('status.namiMatch.ONGOING') }}</el-tag>
          <el-tag v-else-if="currentRow.statusId === 2" type="success">{{ t('status.namiMatch.ENDED') }}</el-tag>
          <el-tag v-else-if="currentRow.statusId === 3" type="danger">{{ t('status.namiMatch.CANCEL') }}</el-tag>
          <el-tag v-else-if="currentRow.statusId === 11" type="danger">{{ t('status.namiMatch.INTERRUPTED') }}</el-tag>
          <el-tag v-else-if="currentRow.statusId === 12" type="warning">{{ t('status.namiMatch.CANCEL') }}</el-tag>
          <el-tag v-else-if="currentRow.statusId === 13" type="danger">{{ t('status.namiMatch.DELAYED') }}</el-tag>
          <el-tag v-else-if="currentRow.statusId === 14" type="danger">{{ t('status.namiMatch.ABANDONED') }}</el-tag>
          <el-tag v-else-if="currentRow.statusId === 15" type="danger">{{ t('status.namiMatch.PENDING') }}</el-tag>
          <el-tag v-else type="default">{{ getLiveStatusDisplayName(currentRow.statusId) }}</el-tag>
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('fields.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="handleCopy"
          :disabled="!canCopy"
        >{{ t('fields.confirmCopy') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { getSportLiveMatch, copySportLiveMatch } from "@/api/sport-live-match";
import { ElMessage } from "element-plus";

export default defineComponent({
  setup() {
    const { t } = useI18n();
    const uiControl = reactive({
      sport: [
        { name: 'FOOTBALL', display: '足球', id: 1 },
        { name: 'BASKETBALL', display: '篮球', id: 2 },
        { name: 'LOL', display: 'LOL', id: 3 },
        { name: 'CSGO', display: 'CSGO', id: 4 },
        { name: 'DOTA2', display: 'DOTA2', id: 5 },
        { name: 'KOG', display: '王者荣耀', id: 6 },
      ],
      // 0:比赛异常, 说明：暂未判断具体原因的异常比赛，建议隐藏处理, 1:未开赛, 2:进行中, 3:完场, 11:中断, 12:取消, 13:延期, 14:腰斩, 15:待定
      liveStatus: [
        { name: '0', display: t('status.namiMatch.GAME_EXCEPTION'), id: 0 },
        { name: '1', display: t('status.namiMatch.NOT_STARTED'), id: 1 },
        { name: '2', display: t('status.namiMatch.ONGOING'), id: 2 },
        { name: '3', display: t('status.namiMatch.ENDED'), id: 3 },
        { name: '11', display: t('status.namiMatch.INTERRUPTED'), id: 11 },
        { name: '12', display: t('status.namiMatch.CANCEL'), id: 12 },
        { name: '13', display: t('status.namiMatch.DELAYED'), id: 13 },
        { name: '14', display: t('status.namiMatch.ABANDONED'), id: 14 },
        { name: '15', display: t('status.namiMatch.PENDING'), id: 15 },
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
      sportId: null,
      liveStatus: null,
      title: null
    });
    const dialogVisible = ref(false);
    const currentRow = ref(null);

    const canCopy = computed(() => {
      return currentRow.value && (currentRow.value.streamId);
    });

    function formatTime(ts) {
      if (!ts) return '-'
      const d = new Date(ts)
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
    }

    function resetQuery() {
      request.sportId = null;
      request.title = null;
      request.liveStatus = null;
    }

    async function loadMatch() {
      page.loading = true;
      const res = await getSportLiveMatch({ sportId: request.sportId, status: request.liveStatus, title: request.title });
      page.records = res.data || [];
      page.loading = false;
    }

    function changePage(pageNum) {
      request.current = pageNum;
      loadMatch();
    }

    function showDialog(row) {
      currentRow.value = row;
      dialogVisible.value = true;
    }

    async function handleCopy() {
      // 調用 API
      const res = await copySportLiveMatch({ matchId: currentRow.value.matchId });
      if (res.code === 0) {
        ElMessage.success('複製成功');
        dialogVisible.value = false;
      } else {
        ElMessage.error('複製失敗');
      }
    }

    // 根據 sportId 取得運動 display 名稱
    function getSportDisplayName(sportId) {
      const found = uiControl.sport.find(item => item.id === sportId);
      return found ? found.display : sportId;
    }

    function getLiveStatusDisplayName(statusId) {
      const found = uiControl.liveStatus.find(item => item.id === statusId);
      return found ? found.display : statusId;
    }

    function hasStreamId(row) {
      // 判斷 streamId 是否有值且非空
      return !!(row && row.streamId);
    }

    onMounted(() => {
      loadMatch();
    });

    return {
      t,
      uiControl,
      page,
      request,
      formatTime,
      loadMatch,
      resetQuery,
      changePage,
      dialogVisible,
      currentRow,
      showDialog,
      handleCopy,
      getSportDisplayName,
      getLiveStatusDisplayName,
      canCopy,
      hasStreamId,
    };
  }
});
</script>

<style scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: flex;
  justify-content: flex-start;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.match-info-list {
  margin-bottom: 10px;
}
.match-info-row {
  display: flex;
  margin-bottom: 4px;
}
.match-info-row .label {
  min-width: 90px;
  color: #888;
  text-align: right;
  flex-shrink: 0;
}
.match-info-row .value {
  flex: 1;
  padding-left: 8px;
  word-break: break-all;
}
</style>
