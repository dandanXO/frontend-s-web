<template>
  <div class="top-competition-setting">
    <div class="filter-section">
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
      <el-input
        v-model="filters.name"
        size="small"
        :placeholder="t('fields.competitionName')"
        clearable
        class="filter-item"
      />
      <el-button type="primary" icon="el-icon-search" @click="loadSettings">
        {{ t('fields.search') }}
      </el-button>
      <el-button icon="el-icon-refresh" @click="resetFilters">
        {{ t('fields.reset') }}
      </el-button>
    </div>

    <el-button type="success" icon="el-icon-plus" @click="openDialog" style="margin-bottom: 10px">
      {{ t('fields.add') }}
    </el-button>

    <el-table :data="settings" border stripe v-loading="loading" style="width: 100%">
      <el-table-column prop="name" :label="t('fields.name')" />
      <el-table-column :label="t('fields.competitionName')">
        <template #default="scope">
          <div v-html="formatCompetitionNames(scope.row.tfCompetitionName)" />
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.operate')" width="100">
        <template #default="scope">
          <el-popconfirm title="确认删除此项？" @confirm="deleteSetting(scope.row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="el-icon-delete" />
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" width="500px" @open="resetDialogForm">
      <el-form :model="form" label-width="80px">
        <el-form-item :label="t('fields.sportType')">
          <el-select v-model="form.sportType" :label="t('fields.pleaseInput')" @change="loadCompetitionList" style="width: 100%">
            <el-option
              v-for="sport in sports.list"
              :key="sport"
              :label="sport"
              :value="sport"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('fields.pleaseInput')">
          <el-input v-model="form.name" :placeholder="t('fields.pleaseInput')" />
        </el-form-item>

        <el-form-item :label="t('fields.pleaseChoose')">
          <el-select
            v-model="form.competitionIds"
            multiple
            filterable
            :placeholder="t('fields.pleaseInput')"
            :disabled="!form.sportType"
            style="width: 100%"
          >
            <el-option
              v-for="comp in competitionOptions"
              :key="comp.id"
              :label="comp.tfCompetitionName"
              :value="comp.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('fields.cancel') }}</el-button>
        <el-button type="primary" @click="submitTopCompetition">{{ t('fields.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useStore } from "@/store";
import {
  getTopCompetitionSettings,
  deleteTopCompetitionSetting,
  getSportTypes,
  getCompetitionList,
  createTopCompetitionGroup
} from "@/api/top-competition";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const filters = reactive({
  sportType: null,
  name: ''
});

const settings = ref([]);
const loading = ref(false);
const sports = reactive({ list: [] });

const store = useStore();
const siteId = store.state.user.siteId;

const dialogVisible = ref(false);
const competitionOptions = ref([]);

const form = reactive({
  name: '',
  competitionIds: [],
  sportType: ''
});

function openDialog() {
  dialogVisible.value = true;
}

async function loadSportTypes() {
  const { data } = await getSportTypes();
  sports.list = data;
}

function resetDialogForm() {
  form.name = '';
  form.competitionIds = [];
  form.sportType = '';
  competitionOptions.value = [];
}

async function loadCompetitionList() {
  if (!form.sportType) {
    competitionOptions.value = [];
    return;
  }

  const { data } = await getCompetitionList({
    siteId,
    sportType: form.sportType
  });
  competitionOptions.value = data;
}

async function submitTopCompetition() {
  if (!form.sportType || !form.name || form.competitionIds.length === 0) {
    ElMessage.warning("请完整填写：运动类型、名称、至少一个联赛");
    return;
  }

  await createTopCompetitionGroup({
    siteId,
    sportType: form.sportType,
    name: form.name,
    competitionIds: form.competitionIds
  });

  ElMessage.success("新增成功");

  filters.sportType = form.sportType;

  dialogVisible.value = false;
  await loadSettings();
}

function formatCompetitionNames(names) {
  if (!names) return '';
  return names
    .split(',')
    .map(name => name.trim())
    .join('<br/>');
}

async function loadSettings() {
  if (!filters.sportType) {
    ElMessage.warning("请选择运动类型");
    return;
  }

  loading.value = true;
  const { data } = await getTopCompetitionSettings({
    sportType: filters.sportType,
    name: filters.name
  });
  settings.value = data;
  loading.value = false;
}

function resetFilters() {
  filters.sportType = null;
  filters.name = '';
}

async function deleteSetting(id) {
  await deleteTopCompetitionSetting(id);
  ElMessage.success(t('status.success'));
  await loadSettings();
}

onMounted(() => {
  loadSportTypes();
});
</script>

<style scoped>
.top-competition-setting {
  padding: 20px;
}
.filter-section {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
</style>
