<template>
  <div class="chat-block-page">
    <el-form :inline="true" class="block-form">
      <el-form-item :label="t('fields.loginName')">
        <el-input v-model="form.loginName" :placeholder="t('fields.loginName')" />
      </el-form-item>
      <el-form-item :label="t('fields.blockDuration')">
        <el-input-number v-model="form.duration" :min="1" :max="unitMaxMap[form.unit] || 60" />
        <el-select v-model="form.unit" style="width: 120px; margin-left: 8px">
          <el-option :label="t('fields.minute')" value="minute" />
          <el-option :label="t('fields.hour')" />
          <el-option :label="t('fields.day')" />
          <el-option :label="t('fields.week')" />
          <el-option :label="t('fields.month')" />
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-lock" @click="blockUser">
        {{ t('fields.block') }}
      </el-button>
      <el-button icon="el-icon-refresh" @click="loadBlockList">
        {{ t('fields.refresh') }}
      </el-button>
    </el-form>

    <el-table :data="blockList" v-loading="loading" style="margin-top: 20px">
      <el-table-column prop="loginName" :label="t('fields.loginName')" width="200" />
      <el-table-column prop="blockTime" :label="t('fields.blockDuration')" width="250">
        <template #default="scope">
          {{ formatDate(scope.row.blockTime) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.operate')">
        <template #default="scope">
          <el-button size="mini" type="danger" @click="unblockUser(scope.row.loginName)">
            {{ t('fields.unblock') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      layout="prev, pager, next"
      :total="page.total"
      :page-size="page.size"
      :current-page="page.current"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import {
  getBlockList,
  blockUserApi,
  unblockUserApi
} from '@/api/sport-live-chat';

const { t } = useI18n();

const form = reactive({
  loginName: '',
  duration: 10,
  unit: 'minute'
});

const unitMaxMap = {
  minute: 60,
  hour: 24,
  day: 30,
  week: 4,
  month: 6
};

const blockList = ref([]);
const loading = ref(false);

const page = reactive({
  total: 0,
  current: 1,
  size: 10
});

function formatDate(date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

function loadBlockList() {
  loading.value = true;

  const query = new URLSearchParams({
    current: page.current,
    size: page.size
  });

  getBlockList(`?${query.toString()}`).then(res => {
    blockList.value = res.data.records;
    page.total = res.data.total;
    loading.value = false;
  });
}

function blockUser() {
  if (!form.loginName || !form.duration || !form.unit) return;
  const blockTime = dayjs().add(form.duration, form.unit).format('YYYY-MM-DD HH:mm:ss');
  blockUserApi({ loginName: form.loginName, blockTime }).then(() => {
    ElMessage.success(t('message.blockSuccess'));
    loadBlockList();
  });
}

function unblockUser(loginName) {
  unblockUserApi({ loginName }).then(() => {
    ElMessage.success(t('message.unblockSuccess'));
    loadBlockList();
  });
}

function handlePageChange(pageNo) {
  page.current = pageNo;
  loadBlockList();
}

onMounted(() => {
  loadBlockList();
});
</script>

<style scoped>
.block-form {
  margin-bottom: 20px;
}
.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
