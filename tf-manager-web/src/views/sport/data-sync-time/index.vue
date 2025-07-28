<template>
  <div>
    <el-row :gutter="10" align="left" style="margin-bottom: 20px">
      <el-col :span="6">
        <el-select v-model="filters.platformId" placeholder="选择平台" clearable style="width: 100%;">
          <el-option
            v-for="(platform, id) in sportPlatformMap"
            :key="id"
            :label="platform.name"
            :value="id"
          />
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select v-model="filters.sportId" placeholder="选择球种" clearable style="width: 100%;">
          <el-option
            v-for="(sport, id) in sportTypeMap"
            :key="id"
            :label="sport.name"
            :value="id"
          />
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select v-model="filters.marketId" placeholder="选择盘口" clearable style="width: 100%;">
          <el-option
            v-for="(market, id) in marketTypeMap"
            :key="id"
            :label="market.name"
            :value="id"
          />
        </el-select>
      </el-col>
    </el-row>

    <div style="margin-bottom: 10px; font-weight: bold;">
      页面最后刷新时间：{{ formattedRefreshTime }}
    </div>

    <el-table :data="filteredTableData" stripe border style="width: 100%">
      <el-table-column prop="platformName" label="平台" />
      <el-table-column prop="sportName" label="球种" />
      <el-table-column prop="marketName" label="盘口" />
      <el-table-column label="上次同步" :formatter="formatTimestampColumn" />
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { ElMessage } from "element-plus";
import { getAllSportPlatform, getAllSportDataSyncSuccessTimes, getAllTFMarketType, getAllTFSportType } from "@/api/sport-sync-time";

const pageRefreshTime = ref(null);

const formatTimestampColumn = (row) => {
  return formatDate(row.timestamp);
};

function formatDate(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
}

const formattedRefreshTime = computed(() => {
  return pageRefreshTime.value ? formatDate(pageRefreshTime.value) : '未刷新';
});

const sportPlatformMap = ref({});
const marketTypeMap = ref({});
const sportTypeMap = ref({});
const sportDataSyncTimes = ref({});

const filters = ref({
  platformId: null,
  sportId: null,
  marketId: null,
});

const tableData = computed(() => {
  return Object.entries(sportDataSyncTimes.value).map(([key, timestamp]) => {
    const [platformId, sportId, marketId] = key.split(':');
    return {
      platformId,
      sportId,
      marketId,
      platformName: sportPlatformMap.value[platformId]?.name || platformId,
      sportName: sportTypeMap.value[sportId]?.name || sportId,
      marketName: marketTypeMap.value[marketId]?.name || marketId,
      timestamp
    };
  });
});

const filteredTableData = computed(() => {
  return tableData.value.filter((item) => {
    return (
      (!filters.value.platformId || item.platformId === filters.value.platformId) &&
      (!filters.value.sportId || item.sportId === filters.value.sportId) &&
      (!filters.value.marketId || item.marketId === filters.value.marketId)
    );
  });
});

const refreshSyncData = async () => {
  const syncTimesRes = await getAllSportDataSyncSuccessTimes();
  sportDataSyncTimes.value = syncTimesRes?.code === 0 ? syncTimesRes.data : {};
  pageRefreshTime.value = Date.now();
  console.log('刷新体育同步时间成功')
}

let timer = null;

onMounted(async () => {
  try {
    const [platformRes, marketRes, sportRes] = await Promise.all([
      getAllSportPlatform(),
      getAllTFMarketType(),
      getAllTFSportType()
    ]);

    sportPlatformMap.value = Object.fromEntries(
      (platformRes?.code === 0 ? platformRes.data : []).map(item => [item.id, item])
    );

    marketTypeMap.value = Object.fromEntries(
      (marketRes?.code === 0 ? marketRes.data : []).map(item => [item.id, item])
    );

    sportTypeMap.value = Object.fromEntries(
      (sportRes?.code === 0 ? sportRes.data : []).map(item => [item.id, item])
    );

    await refreshSyncData();

    timer = setInterval(refreshSyncData, 5000);
  } catch (err) {
    ElMessage({
      message: `数据载入异常`,
      type: 'error',
    });
  }
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});
</script>

<style scoped lang="scss">

</style>
