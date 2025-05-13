<template>
  <div class="monitor-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.eventTime"
          type="datetimerange"
          :placeholder="t('fields.timeranges')"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="filter-item"
          style="margin-right: 10px;"
        />
        <el-button type="primary" icon="el-icon-search" size="small" @click="loadMonitor">
          {{ t('fields.search') }}
        </el-button>
        <el-button type="warning" icon="el-icon-refresh" size="small" @click="resetQuery">
          {{ t('fields.reset') }}
        </el-button>
      </div>
    </div>

    <el-table :data="dataList" row-key="eventId" size="small" class="monitor-table">
      <el-table-column type="expand">
        <template #default="scope">
          <el-table :data="scope.row.monitors" border size="small">
            <el-table-column :label="t('fields.streamTag')" width="120">
              <template #default="{row}">
                {{ tagMap[row.tag] || row.tag || '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="streamName" :label="t('fields.streamName')" width="200" />
            <el-table-column prop="score" :label="t('fields.streamScore')" width="100" />
            <el-table-column prop="name" :label="t('fields.name')" width="100" />
            <el-table-column prop="roomTitle" :label="t('fields.roomTitle')" width="200" />
            <el-table-column :label="t('fields.createTime')" width="180">
              <template #default="{row}">
                {{ formatTimestamp(row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column :label="t('fields.screenShot')">
              <template #default="{row}">
                <el-image
                  v-if="row.screenShot"
                  :src="row.screenShot.startsWith('http') ? row.screenShot : promoDir + row.screenShot"
                  fit="contain"
                  style="height: 50px; aspect-ratio: 1/1; cursor: pointer;"
                  class="preview"
                  :preview-src-list="[row.screenShot.startsWith('http') ? row.screenShot : promoDir + row.screenShot]"
                />
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column prop="eventId" :label="t('fields.eventId')" width="120" />
      <el-table-column prop="title" :label="t('fields.title')" />
      <el-table-column
        prop="sportId"
        :label="t('fields.sportType')"
        width="120"
        :formatter="(_, __, value) => sportMap[value] || '-'"
      />
      <el-table-column prop="liveStatus" :label="t('fields.status')" width="100" />
    </el-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { getLiveMonitorList } from '@/api/sport-live-monitor';
import moment from 'moment';
import { useSessionStorage } from '@vueuse/core';

const { t } = useI18n();

const promoDir = useSessionStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE).value;

const request = reactive({
  eventTime: []
});

const sportMap = {
  1: '足球',
  2: '篮球',
  3: 'LOL',
  4: 'CSGO',
  5: 'DOTA2'
};

const tagMap = {
  streamer: '主播流',
  source: '原厂流',
  cdn: '原厂cdn流'
};

const dataList = ref([]);
let intervalTimer = null;

function resetQuery() {
  request.eventTime = [];
  dataList.value = [];
}

function convertStartDate(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
}

function convertEndDate(date) {
  return moment(date).endOf('day').format('YYYY-MM-DD HH:mm:ss');
}

function formatTimestamp(value) {
  return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '-';
}

async function loadMonitor() {
  try {
    const time = request.eventTime || [];
    const payload = {
      eventTime: [convertStartDate(time[0]), convertEndDate(time[1])]
    };
    const { data } = await getLiveMonitorList(payload);
    dataList.value = data || [];
  } catch (e) {
    ElMessage.error(t('message.loadFailed'));
  }
}

onMounted(() => {
  const now = new Date();
  request.eventTime = [now, now];
  loadMonitor();
  intervalTimer = setInterval(() => {
    loadMonitor();
  }, 30000);
});

onUnmounted(() => {
  clearInterval(intervalTimer);
});
</script>

<style scoped>
.monitor-main {
  padding: 10px;
}

.header-container {
  margin-bottom: 15px;
}

.search {
  display: flex;
  align-items: center;
}

.monitor-table {
  width: 100%;
}
</style>
