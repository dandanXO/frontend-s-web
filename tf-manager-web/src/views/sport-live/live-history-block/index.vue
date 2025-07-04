<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input v-model="request.title" size="small" style="width: 200px; margin-right: 10px;" :placeholder="t('fields.title')" />
        <el-input v-model="request.homeTeamName" size="small" style="width: 200px; margin-right: 10px;" :placeholder="t('fields.homeTeam')" />
        <el-input v-model="request.awayTeamName" size="small" style="width: 200px; margin-right: 10px;" :placeholder="t('fields.awayTeam')" />
        <el-button type="primary" size="small" @click="loadStreamList">{{ t('fields.search') }}</el-button>
        <el-button type="warning" size="small" @click="resetQuery">{{ t('fields.reset') }}</el-button>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 40px">

      <!-- 聊天记录 -->
      <el-dialog
        :title="t('fields.chatHistory')"
        v-model="uiControl.dialogVisible"
        append-to-body
        width="1000px"
      >
        <div class="search" style="margin-bottom: 15px;">
          <el-input v-model="chatRequest.loginName" size="small" style="width: 200px; margin-right: 10px;" :placeholder="t('fields.loginName')" />
          <el-button type="primary" size="small" @click="loadChatHistory(chatRequest.streamId)">{{ t('fields.search') }}</el-button>
          <el-button type="warning" size="small" @click="resetChatQuery">{{ t('fields.reset') }}</el-button>
        </div>
        <el-table
          :data="chatPage.records"
          row-key="id"
          size="mini"
          :resizable="true"
          highlight-current-row
          :empty-text="t('fields.noData')"
          v-loading="chatPage.loading"
          fit
        >
          <el-table-column prop="name" :label="t('fields.name')" min-width="150" />
          <el-table-column prop="content" :label="t('fields.content')" min-width="150" />
          <el-table-column :label="t('fields.operator')" min-width="350">
            <template #default="scope">
              <div v-if="!scope.row.blocked || (scope.row.blocked && uiControl.isExtendMode)">
                <el-form :model="blockUserForm">
                  <el-form-item :label="t('fields.blockDuration')">
                    <el-row :gutter="10">
                      <!-- 输入框：占 8/24 -->
                      <el-col :span="6">
                        <el-input-number
                          size="small"
                          v-model="blockUserForm.duration"
                          :min="1"
                          :max="unitMaxMap[blockUserForm.unit] || 60"
                          style="width: 100%"
                        />
                      </el-col>
                      <!-- 下拉框：占 8/24 -->
                      <el-col :span="5">
                        <el-select v-model="blockUserForm.unit" size="small" style="width: 100%">
                          <el-option label="分鐘" value="minute" />
                          <el-option label="小時" value="hour" />
                          <el-option label="天" value="day" />
                          <el-option label="週" value="week" />
                          <el-option label="月" value="month" />
                        </el-select>
                      </el-col>
                      <!-- 按钮：占 8/24 -->
                      <el-col :span="5">
                        <el-button
                          type="primary"
                          size="small"
                          @click="submitBlock(scope.row)"
                          style="width: 100%"
                        >
                          {{ t('fields.block') }}
                        </el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-form>
              </div>
              <div v-else>
                <el-button type="success" size="small" @click="unblockUser(scope.row.name)">{{ t('fields.unblock') }}</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          @current-change="changeChatPage"
          layout="prev, pager, next"
          :page-size="chatRequest.size"
          :page-count="chatPage.pages"
          :current-page="chatRequest.current"
        />
      </el-dialog>

      <!-- 直播流列表 -->
      <el-table
        :data="page.records"
        row-key="id"
        size="mini"
        :resizable="true"
        highlight-current-row
        :empty-text="t('fields.noData')"
        v-loading="page.loading"
        fit
      >
        <el-table-column prop="title" :label="t('fields.title')" min-width="250" />
        <el-table-column prop="homeTeamName" :label="t('fields.homeTeam')" min-width="250">
          <template #default="scope">
            {{ scope.row.homeNameZh || scope.row.homeNameEn }}
          </template>
        </el-table-column>
        <el-table-column prop="awayTeamName" :label="t('fields.awayTeam')" min-width="250">
          <template #default="scope">
            {{ scope.row.awayNameZh || scope.row.awayNameEn }}
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.operate')" min-width="300">
          <template #default="scope">
            <el-button type="info" size="small" @click="showChatHistory(scope.row)">{{ t('fields.chatHistory') }}</el-button>
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

    </el-card>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { getStreamHistoryList, getChatHistory, blockUserApi, unblockUserApi } from '@/api/sport-live-chat';
import { useStore } from '@/store';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs';

const { t } = useI18n();
const store = useStore();

const unitMaxMap = {
  minute: 60,
  hour: 24,
  day: 30,
  week: 4,
  month: 6
};

const uiControl = reactive({
  dialogVisible: false,
});

const request = reactive({
  siteId: store.state.user.siteId,
  size: 30,
  current: 1,
  title: null,
  homeTeamName: null,
  awayTeamName: null,
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
});

const chatRequest = reactive({
  streamId: null,
  loginName: null,
  size: 30,
  current: 1,
});

const chatPage = reactive({
  pages: 0,
  records: [],
  loading: false,
});

const blockUserForm = reactive({
  loginName: null,
  duration: 10,
  unit: 'minute',
});

function showChatHistory(row) {
  uiControl.dialogVisible = true
  chatRequest.streamId = row.id
  loadChatHistory(row.id)
}

function resetQuery() {
  request.title = null;
  request.homeTeamName = null;
  request.awayTeamName = null;
}

function resetChatQuery() {
  chatRequest.loginName = null;
  loadChatHistory(chatRequest.streamId)
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadStreamList()
  }
}

function changeChatPage(page) {
  if (chatRequest.current >= 1) {
    chatRequest.current = page
    loadChatHistory(chatRequest.streamId)
  }
}

function submitBlock(event) {
  blockUserForm.loginName = event.name
  const blockTime = dayjs().add(blockUserForm.duration, blockUserForm.unit).format('YYYY-MM-DD HH:mm:ss');
  blockUserApi({ loginName: blockUserForm.loginName, blockTime }).then(() => {
    ElMessage.success(t('message.success'));
    loadChatHistory(chatRequest.streamId);
  });
}

function unblockUser(loginName) {
  unblockUserApi({ loginName }).then(() => {
    ElMessage.success(t('message.success'));
    loadChatHistory(chatRequest.streamId);
  });
}

async function loadChatHistory(streamId) {
  chatRequest.streamId = streamId
  chatPage.loading = true

  const query = new URLSearchParams({
    current: chatRequest.current,
    size: chatRequest.size
  });

  try {
    const response = await getChatHistory(`?${query.toString()}`, chatRequest);
    const data = response?.data || response; // Handle both nested and direct responses
    chatPage.pages = data?.pages || 0;
    chatPage.records = data?.records || [];
  } catch (error) {
    console.error("Failed to load chat history:", error);
  } finally {
    chatPage.loading = false;
  }
}

async function loadStreamList() {
  page.loading = true
  const { data } = await getStreamHistoryList(request);
  page.pages = data.pages
  page.records = data.records
  page.loading = false
}

onMounted(() => {
  loadStreamList()
});
</script>

<style scoped></style>
