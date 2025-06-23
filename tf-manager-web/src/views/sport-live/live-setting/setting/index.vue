<template>
  <div class="roles-main">
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="780px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        size="small"
        label-width="140px"
      >
        <el-form-item
          v-if="uiControl.dialogType === 'SUPPLIER_CREATE'"
          :label="t('fields.sourceStreamUrl')"
          prop="sourceStreamUrl"
        >
          <el-input v-model="form.sourceStreamUrl" />
        </el-form-item>
        <el-form-item
          v-if="uiControl.dialogType === 'SUPPLIER_CREATE'"
          prop="isCdnPush"
        >
          <el-checkbox v-model="form.isCdnPush">{{ t('fields.isCdnPush') }}</el-checkbox>
        </el-form-item>

        <el-form-item
          v-if="uiControl.dialogType === 'STREAMER_CREATE'"
          :label="t('fields.streamer')"
          prop="streamerId"
        >
          <el-select v-model="form.streamerId" style="width: 100%;">
            <el-option
              v-for="s in streamerList"
              :key="s.id"
              :label="s.name"
              :value="s.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="uiControl.dialogType === 'STREAMER_CREATE' || uiControl.dialogType === 'STREAMER_EDIT'"
          :label="t('fields.roomMessage')"
          prop="roomMessage"
        >
          <div style="position: relative;">
            <el-input
              v-model="form.roomMessage"
              type="textarea"
              rows="3"
              maxlength="200"
            />
            <el-button
              icon="el-icon-smile"
              size="mini"
              style="margin-top: 5px;"
              @click="showEmojiPickerForMessage = !showEmojiPickerForMessage"
            >
              Emoji
            </el-button>
            <div v-if="showEmojiPickerForMessage" style="position: absolute; z-index: 1000;">
              <EmojiPicker @select="insertEmojiToMessage" />
            </div>
          </div>
        </el-form-item>
        <el-form-item
          v-if="uiControl.dialogType === 'STREAMER_CREATE' || uiControl.dialogType === 'STREAMER_EDIT'"
          :label="t('fields.roomTitle')"
          prop="roomTitle"
        >
          <div style="position: relative;">
            <el-input
              v-model="form.roomTitle"
              type="textarea"
              rows="3"
              maxlength="200"
            />
            <el-button
              icon="el-icon-smile"
              size="mini"
              style="margin-top: 5px;"
              @click="showEmojiPicker = !showEmojiPicker"
            >
              Emoji
            </el-button>
            <div v-if="showEmojiPicker" style="position: absolute; z-index: 1000;">
              <EmojiPicker @select="insertEmoji" />
            </div>
          </div>
        </el-form-item>
        <el-form-item
          v-if="uiControl.dialogType === 'STREAMER_CREATE' || uiControl.dialogType === 'STREAMER_EDIT'"
          :label="t('fields.scheduledAnnouncement')"
          prop="scheduledAnnouncement"
        >
          <div style="position: relative;">
            <el-input
              v-model="form.scheduledAnnouncement"
              type="textarea"
              rows="3"
              maxlength="200"
            />
            <el-button
              icon="el-icon-smile"
              size="mini"
              style="margin-top: 5px;"
              @click="showEmojiPickerForScheduled = !showEmojiPickerForScheduled"
            >
              Emoji
            </el-button>
            <div v-if="showEmojiPickerForScheduled" style="position: absolute; z-index: 1000;">
              <EmojiPicker @select="insertEmojiToScheduled" />
            </div>
          </div>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      v-model="previewDialog.visible"
      width="800px"
      top="5vh"
      @close="onPreviewDialogClose"
    >
      <div class="preview-video-container">
        <video
          id="preview-player"
          class="video-js vjs-default-skin"
          controls
          preload="auto"
          width="100%"
          height="400"
        />
      </div>
    </el-dialog>
    <h3 style="margin: 20px 0 10px; font-weight: bold;">{{ t('fields.liveSportSupplierStreamManage') }}</h3>
    <el-button
      icon="el-icon-plus"
      size="mini"
      type="primary"
      style="margin-bottom: 10px"
      @click="showDialog('SUPPLIER_CREATE')"
    >
      {{ t('fields.add') }}
    </el-button>
    <el-button
      icon="el-icon-refresh"
      size="mini"
      type="primary"
      style="margin-bottom: 10px"
      @click="initialSupplierStreamStatus"
    >
      {{ t('fields.initialSupplierStreamStatus') }}
    </el-button>
    <el-table :data="supplierStreams" size="small" border>
      <el-table-column :label="t('fields.sourceStreamUrl')" width="500">
        <template #default="scope">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span @click="copyToClipboard(scope.row.sourceStreamUrl)" style="word-break: break-all; cursor: pointer">
              {{ scope.row.sourceStreamUrl }}
            </span>
            <el-button
              size="mini"
              icon="el-icon-view"
              @click="openPreview(scope.row.sourceStreamUrl)"
              circle
              type="primary"
              :title="t('fields.browse')"
            />
            <div class="signal-bars" v-if="monitorScoreMap[scope.row.streamId] !== undefined">
              <span
                v-for="n in 5"
                :key="n"
                class="bar"
                :class="{active: n <= monitorScoreMap[scope.row.streamId]}"
              />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="supplierCdnPushUrl" :label="t('fields.supplierCdnPushUrl')" />
      <el-table-column :label="t('fields.supplierCdnPullUrl')">
        <template #default="scope">
          <span>
            {{
              (() => {
                try {
                  return JSON.parse(scope.row.supplierCdnPullUrl || '{}')?.original?.hls_url
                    || JSON.parse(scope.row.supplierCdnPullUrl || '{}')?.original?.flv_url
                    || '-'
                } catch {
                  return '-'
                }
              })()
            }}
          </span>
          <el-button
            v-if="JSON.parse(scope.row.supplierCdnPullUrl || '{}')?.original?.hls_url || JSON.parse(scope.row.supplierCdnPullUrl || '{}')?.original?.flv_url"
            size="mini"
            circle
            type="primary"
            icon="el-icon-view"
            @click="openPreview(JSON.parse(scope.row.supplierCdnPullUrl || '{}')?.original?.hls_url || JSON.parse(scope.row.supplierCdnPullUrl || '{}')?.original?.flv_url)"
          />
          <div class="signal-bars" v-if="monitorScoreMap[scope.row.streamId] !== undefined">
            <span
              v-for="n in 5"
              :key="n"
              class="bar"
              :class="{active: n <= monitorScoreMap[scope.row.streamId]}"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        :label="t('fields.operate')"
        align="center"
        width="300"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-delete"
            size="mini"
            type="danger"
            @click="deleteSupplierStream(scope.row.id)"
          >
            {{ t('fields.delete') }}
          </el-button>
          <el-button
            icon="el-icon-check"
            size="mini"
            type="success"
            :disabled="scope.row.isDefault === 1"
            @click="setSupplierDefault(scope.row.id)"
          >
            {{ scope.row.isDefault === 1 ? t('fields.defaultStream') : t('fields.switch') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <h3 style="margin: 30px 0 10px; font-weight: bold;">{{ t('fields.liveSportStreamManage') }}</h3>
    <el-button
      icon="el-icon-plus"
      size="mini"
      type="primary"
      style="margin-bottom: 10px"
      @click="showDialog('STREAMER_CREATE')"
    >
      {{ t('fields.add') }}
    </el-button>
    <el-table :data="streamerStreams" size="small" border>
      <el-table-column prop="streamerName" :label="t('fields.streamer')" />
      <el-table-column prop="streamerCdnPushUrl" :label="t('fields.streamerCdnPushUrl')" />
      <el-table-column :label="t('fields.streamerCdnPullUrl')">
        <template #default="scope">
          <span>
            {{
              (() => {
                try {
                  return JSON.parse(scope.row.streamerCdnPullUrl || '{}')?.original?.hls_url || '-'
                } catch {
                  return '-'
                }
              })()
            }}
          </span>
          <el-button
            v-if="JSON.parse(scope.row.streamerCdnPullUrl || '{}')?.original?.hls_url"
            size="mini"
            icon="el-icon-view"
            circle
            type="primary"
            @click="openPreview(JSON.parse(scope.row.streamerCdnPullUrl || '{}')?.original?.hls_url)"
          />
          <div class="signal-bars" v-if="monitorScoreMap[scope.row.streamId] !== undefined">
            <span
              v-for="n in 5"
              :key="n"
              class="bar"
              :class="{active: n <= monitorScoreMap[scope.row.streamId]}"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="roomMessage" :label="t('fields.roomMessage')" />
      <el-table-column prop="scheduledAnnouncement" :label="t('fields.scheduledAnnouncement')" />
      <el-table-column
        prop="subscribeCount"
        :label="t('fields.subscribeCount')"
        width="100"
      />
      <el-table-column
        fixed="right"
        :label="t('fields.operate')"
        align="center"
        width="180"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-chat-line-round"
            size="mini"
            type="info"
            @click="openChatHistory(scope.row.id)"
          >
            {{ t('fields.chatHistory') }}
          </el-button>
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="primary"
            @click="showDialog('STREAMER_EDIT', scope.row)"
          >
            {{ t('fields.edit') }}
          </el-button>
          <el-button
            icon="el-icon-delete"
            size="mini"
            type="danger"
            @click="deleteStream(scope.row.id)"
          >
            {{ t('fields.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog
    v-model="chatHistoryDialog.visible"
    width="850px"
    :title="t('fields.chatHistory')"
  >
    <el-table :data="chatHistoryDialog.chatList" v-loading="chatHistoryDialog.loading">
      <el-table-column prop="name" :label="t('fields.name')" width="200" />
      <el-table-column prop="content" :label="t('fields.content')" />
      <el-table-column :label="t('fields.createTime')" width="180">
        <template #default="scope">
          {{ formatTime(scope.row.createTime) }}
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
      style="margin-top: 10px; text-align: right"
      layout="prev, pager, next"
      :page-size="chatHistoryDialog.page.size"
      :total="chatHistoryDialog.page.total"
      :current-page="chatHistoryDialog.page.current"
      @current-change="handleChatPageChange"
    />
  </el-dialog>
</template>
<script setup>

import { nextTick, onMounted, onUnmounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "@/store";
import { getSiteTimeZoneById } from "@/api/site";
import {
  createSportLiveStream,
  createSportLiveSupplierStream,
  deleteSportLiveStream,
  deleteSportLiveSupplierStream,
  getSportLiveStream,
  getSportLiveSupplierStream,
  getStreamers,
  updateSportLiveStream,
  updateSupplierStream
} from "@/api/sport-live";

import { getLiveMonitorScores } from "@/api/sport-live-monitor";
import { required } from "@/utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute } from "vue-router";
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/dist/style.css'
import 'videojs-flvjs';
import flvjs from 'flv.js';
import { getChatHistory } from "@/api/sport-live-chat";
import dayjs from "dayjs";

const showEmojiPicker = ref(false)
const { t } = useI18n();
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: 'SUPPLIER_CREATE' | 'STREAMER_CREATE' | 'STREAMER_EDIT',
  editBtn: true,
  removeBtn: true,
  dialogLoading: false
});
const route = useRoute()
const eventId = ref(Number(route.query.id))
const previewDialog = reactive({
  visible: false,
  url: ''
})
const showEmojiPickerForMessage = ref(false)

function insertEmojiToMessage(emoji) {
  form.roomMessage += emoji.i
}

const showEmojiPickerForScheduled = ref(false);

function insertEmojiToScheduled(emoji) {
  form.scheduledAnnouncement += emoji.i;
}

let player = null;
let scoreTimer = null;

const timezone = ref(null);
const formRef = ref(null);
const supplierStreams = ref([]);
const streamerStreams = ref([]);
const monitorScoreMap = ref({});

function insertEmoji(emoji) {
  form.roomTitle += emoji.i
}
async function fetchMonitorScores() {
  const allStreamIds = [
    ...supplierStreams.value.map(s => s.streamId),
    ...streamerStreams.value.map(s => s.streamId)
  ].filter(Boolean);

  if (allStreamIds.length > 0) {
    const { data } = await getLiveMonitorScores(allStreamIds);
    monitorScoreMap.value = Object.fromEntries(
      (data || []).map(m => [m.streamName, m.score])
    );
  }
}

async function deleteStream(streamId) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: "warning",
  }).then(async () => {
    try {
      await deleteSportLiveStream(streamId);
      ElMessage({ message: t("message.deleteSuccess"), type: "success" });
      await loadEvent();
    } catch (error) {
      ElMessage({ message: t("message.deleteFailed"), type: "error" });
    }
  }).catch(() => {
  });
}

async function setSupplierDefault(id) {
  await updateSupplierStream({ eventId: eventId.value, id: id, isDefault: 1 });
  ElMessage.success(t('message.updateSuccess'));
  await loadEvent();
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success(t("message.copySuccess"));
  }).catch(() => {
  });
}

async function deleteSupplierStream(streamId) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: "warning",
  }).then(async () => {
    try {
      await deleteSportLiveSupplierStream(streamId);
      ElMessage({ message: t("message.deleteSuccess"), type: "success" });
      await loadEvent();
    } catch (error) {
      ElMessage({ message: t("message.deleteFailed"), type: "error" });
    }
  }).catch(() => {
  });
}

function formatTime(timestamp) {
  if (!timestamp) return '-';
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
}

function submit() {
  if (uiControl.dialogType === 'SUPPLIER_CREATE') {
    const url = form.sourceStreamUrl || '';
    const baseUrl = url.split('?')[0];

    if (!baseUrl.endsWith('.m3u8') && !baseUrl.endsWith('.flv')) {
      const corrected = baseUrl.replace(/\.\w+$/, '') + '.m3u8';
      ElMessageBox.confirm(
        t('message.streamUrlNotM3U8OrFlv'),
        t('fields.confirm'),
        {
          confirmButtonText: t('fields.confirm'),
          cancelButtonText: t('fields.cancel'),
          type: 'warning',
        }
      ).then(() => {
        const queryParams = url.includes('?') ? '?' + url.split('?')[1] : '';
        form.sourceStreamUrl = corrected + queryParams;
        ElMessage.success(t('message.replacedWithM3U8'));
        supplierCreate();
      }).catch(() => {
        ElMessage.warning(t('message.streamUrlMustBeM3U8OrFlv'));
      });
      return;
    }
    supplierCreate();
  } else if (uiControl.dialogType === 'STREAMER_CREATE') {
    streamerSave();
  } else if (uiControl.dialogType === 'STREAMER_EDIT') {
    streamerUpdate();
  }
}

function openPreview(url) {
  previewDialog.visible = true;

  nextTick(() => {
    if (player) {
      player.dispose();
      player = null;
    }

    const isFLV = url.toLowerCase().endsWith('.flv');
    const container = document.querySelector('.preview-video-container');

    if (container) {
      container.innerHTML = `
        <video
          id="preview-player"
          ${isFLV ? '' : 'class="video-js vjs-default-skin"'}
          controls
          preload="auto"
          width="100%"
          height="400"
        ></video>
      `;
    }

    nextTick(() => {
      const videoEl = document.getElementById('preview-player');

      if (isFLV && flvjs.isSupported()) {
        const flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url: url
        });
        flvPlayer.attachMediaElement(videoEl);
        flvPlayer.load();
        flvPlayer.play();
      } else {
        player = videojs(videoEl, {
          autoplay: true,
          controls: true,
          preload: 'auto',
          responsive: true,
          fluid: true,
        });
        player.src({
          src: url,
          type: 'application/x-mpegURL',
        });
        player.play();
      }
    });
  });
}

function onPreviewDialogClose() {
  if (player) {
    player.pause();
    player.dispose();
    player = null;
  }
}

async function supplierCreate() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    const payload = {
      eventId: eventId.value,
      sourceStreamUrl: form.sourceStreamUrl,
      isCdnPush: form.isCdnPush
    };
    await createSportLiveSupplierStream(payload);
    ElMessage.success(t('message.addSuccess'));
    uiControl.dialogVisible = false;
    await loadEvent();
  });
}

async function streamerSave() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    await createSportLiveStream({ eventId: eventId.value, liveStreamerId: form.streamerId, status: 0, roomMessage: form.roomMessage, scheduledAnnouncement: form.scheduledAnnouncement });
    ElMessage.success(t('message.updateSuccess'));
    uiControl.dialogVisible = false;
    await loadEvent();
  });
}

async function streamerUpdate() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    await updateSportLiveStream({ eventId: eventId.value, status: 0, id: form.id, roomMessage: form.roomMessage, roomTitle: form.roomTitle, scheduledAnnouncement: form.scheduledAnnouncement });
    ElMessage.success(t('message.updateSuccess'));
    uiControl.dialogVisible = false;
    await loadEvent();
  });
}

async function loadEvent() {
  const [supplierRes, streamerRes] = await Promise.all([
    getSportLiveSupplierStream({ eventId: eventId.value }),
    getSportLiveStream({ eventId: eventId.value })
  ]);
  supplierStreams.value = supplierRes.data.records || [];
  streamerStreams.value = streamerRes.data.records || [];
}

async function initialSupplierStreamStatus() {
  const { data } = await getSportLiveSupplierStream({ eventId: eventId.value });

  data.records.forEach(async (item) => {
    await updateSupplierStream({ eventId: eventId.value, id: item.id, status: 4 });
  });
  ElMessage.success(t('message.updateSuccess'));
  await loadEvent();
}

function showDialog(type, row) {
  uiControl.dialogVisible = true;
  uiControl.dialogType = type;

  if (type === 'STREAMER_CREATE') {
    fetchStreamers();
    form.streamerId = null;
    form.id = null;
  }

  if (type === 'STREAMER_EDIT' && row) {
    fetchStreamers();
    form.streamerId = row.streamerId;
    form.id = row.id;
    form.scheduledAnnouncement = row.scheduledAnnouncement;
    form.roomMessage = row.roomMessage;
    form.roomTitle = row.roomTitle;
  }

  if (type === 'SUPPLIER_CREATE') {
    form.sourceStreamUrl = '';
  }
}

async function fetchStreamers() {
  const { data } = await getStreamers();
  streamerList.value = data.records;
}

const form = reactive({
  id: null,
  sourceStreamUrl: '',
  streamerId: null,
  roomMessage: '',
  roomTitle: '',
  isCdnPush: false,
  scheduledAnnouncement: '',
});

const streamerList = ref([]);

const formRules = reactive({
  sourceStreamUrl: [required(t('message.validateSupplierStreamRequired'))]
});

const request = reactive({
  id: null
});

const chatHistoryDialog = reactive({
  visible: false,
  streamerId: null,
  chatList: [],
  loading: false,
  page: {
    total: 0,
    size: 30,
    current: 1
  }
});

function openChatHistory(streamerId) {
  chatHistoryDialog.streamerId = streamerId;
  chatHistoryDialog.visible = true;
  chatHistoryDialog.page.current = 1;
  loadChatHistory();
}

function loadChatHistory() {
  chatHistoryDialog.loading = true;
  const query = new URLSearchParams({
    current: chatHistoryDialog.page.current,
    size: chatHistoryDialog.page.size
  });
  const store = useStore();
  const siteId = store.state.user.siteId;
  getChatHistory(`?${query.toString()}`, { streamId: chatHistoryDialog.streamerId, siteId: siteId })
    .then(res => {
      chatHistoryDialog.chatList = res.data.records;
      chatHistoryDialog.page.total = res.data.total;
    })
    .finally(() => {
      chatHistoryDialog.loading = false;
    });
}

function handleChatPageChange(page) {
  chatHistoryDialog.page.current = page;
  loadChatHistory();
}

onMounted(async () => {
  const store = useStore()
  const { data: timeZone } = getSiteTimeZoneById(
    store.state.user.siteId
  )
  timezone.value = timeZone
  request.id = eventId
  await loadEvent();
  await fetchMonitorScores();
  scoreTimer = setInterval(fetchMonitorScores, 30000);
});

onUnmounted(() => {
  clearInterval(scoreTimer);
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

.preview-video-container {
  width: 100%;
  height: auto;
  .video-js {
    width: 100% !important;
    height: 400px !important;
  }
}

 .signal-bars {
   display: flex;
   gap: 2px;
   align-items: flex-end;
   height: 14px;
 }
.bar {
  width: 4px;
  background: #ccc;
  transition: 0.3s;
}
.bar:nth-child(1) { height: 4px; }
.bar:nth-child(2) { height: 6px; }
.bar:nth-child(3) { height: 8px; }
.bar:nth-child(4) { height: 10px; }
.bar:nth-child(5) { height: 12px; }
.bar.active {
  background: #67C23A;
}
</style>
