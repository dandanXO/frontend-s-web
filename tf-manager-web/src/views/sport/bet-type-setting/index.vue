<template>
  <div class="bet-type-switch">
    <div class="filter-section">
      <el-select
        v-model="filters.platformId"
        size="small"
        :placeholder="t('fields.platform')"
        class="filter-item"
        clearable
      >
        <el-option
          v-for="platform in uiControl.platform"
          :key="platform.id"
          :label="platform.name"
          :value="platform.id"
        />
      </el-select>

      <el-select
        v-model="filters.sportType"
        size="small"
        :placeholder="t('fields.sportType')"
        class="filter-item"
        clearable
      >
        <el-option
          v-for="sport in sports.list"
          :key="sport"
          :label="sport"
          :value="sport"
        />
      </el-select>

      <el-button
        type="primary"
        icon="el-icon-search"
        @click="loadBetTypes"
      >
        {{ t('fields.search') }}
      </el-button>
      <el-button
        icon="el-icon-refresh"
        @click="resetFilters"
      >
        {{ t('fields.reset') }}
      </el-button>
    </div>

    <el-table
      :data="betTypes"
      border
      stripe
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="tfBetTypeId" :label="t('fields.betTypeId')" width="100" />
      <el-table-column prop="description" :label="t('fields.betTypeName')" />
      <el-table-column prop="status" :label="t('fields.status')" width="120">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="true"
            :inactive-value="false"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getBetTypeSettings, updateBetTypeStatus, getSportTypes } from "@/api/sport-event";
import { ElMessage } from 'element-plus';
// import { getSiteListSimple } from '@/api/site';
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const betTypes = ref([]);
const loading = ref(false);

const filters = reactive({
  platformId: null,
  sportType: null,
});

// const platforms = reactive({ list: [] });
const sports = reactive({ list: [] });
const uiControl = reactive({
  platform: [
    { name: 'IM', display: 'IM', id: 1 }
  ]
});

// async function loadPlatforms() {
//   const { data } = await getSiteListSimple();
//   platforms.list = data;
// }

async function loadSportTypes() {
  const { data } = await getSportTypes();
  sports.list = data;
}

async function loadBetTypes() {
  loading.value = true;
  const { data } = await getBetTypeSettings({
    platformId: filters.platformId,
    tfSportType: filters.sportType,
  });
  betTypes.value = data;
  loading.value = false;
}

function resetFilters() {
  filters.platformId = null;
  filters.sportType = null;
  betTypes.value = [];
}

async function handleStatusChange(row) {
  console.log(row)
  const query = {
    platformId: row.platformId,
    tfSportId: row.tfSportId,
    tfBetTypeId: row.tfBetTypeId,
    status: row.status
  };

  await updateBetTypeStatus(query);
  ElMessage.success(t('message.updateSuccess'));
}

onMounted(() => {
  // loadPlatforms();
  loadSportTypes();
});
</script>
<style scoped>
.bet-type-switch {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
</style>
