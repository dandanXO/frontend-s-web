<template>
  <div class="chat-history-page">
    <el-form :inline="true" class="search-form">
      <el-form-item :label="t('fields.stream')">
        <el-select
          v-model="selectedStreamId"
          filterable
          style="width: 300px"
          placeholder="Select stream"
          @change="loadChatHistory"
        >
          <el-option
            v-for="s in streamList"
            :key="s.id"
            :label="s.title + ' (' + s.streamId + ')'"
            :value="s.id"
          />
        </el-select>

      </el-form-item>
    </el-form>

    <el-table :data="chatList" v-loading="loading" style="margin-top: 20px">
      <el-table-column prop="name" :label="t('fields.name')" width="200" />
      <el-table-column prop="content" :label="t('fields.content')" />
      <el-table-column :label="t('fields.operate')" width="220">
        <template #default="scope">
          <el-button-group>
            <el-button
              v-if="!scope.row.blocked"
              size="mini"
              type="danger"
              @click="showBlockDialog(scope.row.name)"
            >
              {{ t('fields.block') }}
            </el-button>
            <template v-else>
              <el-button
                size="mini"
                type="info"
                @click="showBlockDialog(scope.row.name)"
              >
                {{ t('fields.extendBlock') }}
              </el-button>
              <el-button
                size="mini"
                type="success"
                @click="unblockUser(scope.row.name)"
              >
                {{ t('fields.unblock') }}
              </el-button>
            </template>
          </el-button-group>
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

    <el-dialog
      v-model="dialog.visible"
      width="400px"
    >
      <div class="dialog-content">
        <el-form :model="dialog.form">
          <el-form-item :label="t('fields.loginName')">
            <el-input v-model="dialog.form.loginName" disabled />
          </el-form-item>
          <el-form-item :label="t('fields.blockDuration')">
            <el-row gutter="10">
              <el-col :span="12">
                <el-input-number v-model="dialog.form.duration" :min="1" :max="unitMaxMap[dialog.form.unit] || 60" style="width: 100%;" />
              </el-col>
              <el-col :span="12">
                <el-select v-model="dialog.form.unit" style="width: 100%">
                  <el-option label="分鐘" value="minute" />
                  <el-option label="小時" value="hour" />
                  <el-option label="天" value="day" />
                  <el-option label="週" value="week" />
                  <el-option label="月" value="month" />
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="dialog.visible = false">{{ t('fields.cancel') }}</el-button>
        <el-button type="primary" @click="submitBlock">{{ t('fields.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { getStreamList, getChatHistory, blockUserApi, unblockUserApi } from '@/api/sport-live-chat';

const { t } = useI18n();

const streamList = ref([]);
const chatList = ref([]);
const selectedStreamId = ref(null);
const loading = ref(false);

const page = reactive({
  total: 0,
  current: 1,
  size: 20
});

const dialog = reactive({
  visible: false,
  form: {
    loginName: '',
    duration: 10,
    unit: 'minute'
  }
});

const unitMaxMap = {
  minute: 60,
  hour: 24,
  day: 30,
  week: 4,
  month: 6
};

function loadStreams() {
  getStreamList().then(res => {
    streamList.value = res.data;
  });
}

function loadChatHistory() {
  if (!selectedStreamId.value) return;
  loading.value = true;

  const query = new URLSearchParams({
    current: page.current,
    size: page.size
  });

  getChatHistory(`?${query.toString()}`, { streamId: selectedStreamId.value })
    .then(res => {
      chatList.value = res.data.records;
      page.total = res.data.total;
      loading.value = false;
    });
}

function handlePageChange(pageNo) {
  page.current = pageNo;
  loadChatHistory();
}

function showBlockDialog(name) {
  dialog.form.loginName = name;
  dialog.form.duration = 10;
  dialog.form.unit = 'minute';
  dialog.visible = true;
}

function submitBlock() {
  const blockTime = dayjs().add(dialog.form.duration, dialog.form.unit).format('YYYY-MM-DD HH:mm:ss');
  blockUserApi({ loginName: dialog.form.loginName, blockTime }).then(() => {
    ElMessage.success(t('message.success'));
    dialog.visible = false;
    loadChatHistory();
  });
}

function unblockUser(loginName) {
  unblockUserApi({ loginName }).then(() => {
    ElMessage.success(t('message.success'));
    loadChatHistory();
  });
}

onMounted(() => {
  loadStreams();
});
</script>

<style scoped>
.search-form {
  margin-bottom: 20px;
}
.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
