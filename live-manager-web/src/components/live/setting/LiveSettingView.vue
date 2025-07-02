<template>
  <div class="roles-main">
    <Dialog v-model:visible="uiControl.dialogVisible" :header="uiControl.dialogTitle" modal :style="{ width: '780px' }">
      <form @submit.prevent="submit" class="p-fluid">
        <div v-if="uiControl.dialogType === 'SUPPLIER_CREATE'">
          <label :for="'sourceStreamUrl'">{{ t('fields.sourceStreamUrl') }}</label>
          <InputText id="sourceStreamUrl" v-model="form.sourceStreamUrl" />

          <div class="field-checkbox">
            <Checkbox v-model="form.isCdnPush" :binary="true" inputId="isCdnPush" />
            <label for="isCdnPush">{{ t('fields.isCdnPush') }}</label>
          </div>
        </div>

        <div v-if="uiControl.dialogType === 'STREAMER_CREATE'">
          <label for="streamerId">{{ t('fields.streamer') }}</label>
          <Dropdown id="streamerId" v-model="form.streamerId" :options="streamerList" optionLabel="name" optionValue="id" />
        </div>

        <div v-if="uiControl.dialogType.includes('STREAMER_')">
          <label for="roomMessage">{{ t('fields.roomMessage') }}</label>
          <Textarea id="roomMessage" v-model="form.roomMessage" rows="3" maxlength="200" />
          <Button icon="pi pi-smile" class="p-button-sm mt-2" @click="showEmojiPickerForMessage = !showEmojiPickerForMessage">Emoji</Button>
          <div v-if="showEmojiPickerForMessage"><EmojiPicker @select="insertEmojiToMessage" /></div>

          <label for="roomTitle">{{ t('fields.roomTitle') }}</label>
          <Textarea id="roomTitle" v-model="form.roomTitle" rows="3" maxlength="200" />
          <Button icon="pi pi-smile" class="p-button-sm mt-2" @click="showEmojiPicker = !showEmojiPicker">Emoji</Button>
          <div v-if="showEmojiPicker"><EmojiPicker @select="insertEmoji" /></div>

          <label for="scheduledAnnouncement">{{ t('fields.scheduledAnnouncement') }}</label>
          <Textarea id="scheduledAnnouncement" v-model="form.scheduledAnnouncement" rows="3" maxlength="200" />
          <Button icon="pi pi-smile" class="p-button-sm mt-2" @click="showEmojiPickerForScheduled = !showEmojiPickerForScheduled">Emoji</Button>
          <div v-if="showEmojiPickerForScheduled"><EmojiPicker @select="insertEmojiToScheduled" /></div>
        </div>

        <div class="dialog-footer">
          <Button label="{{ t('fields.cancel') }}" @click="uiControl.dialogVisible = false" class="p-button-text" />
          <Button label="{{ t('fields.confirm') }}" type="submit" icon="pi pi-check" />
        </div>
      </form>
    </Dialog>

  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { DashboardService } from '@/service/DashboardService'
import { SiteService } from '@/service/SiteService.js'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import EmojiPicker from 'vue3-emoji-picker'
import { required } from "@/utils/validate";
import { useRoute } from "vue-router";
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
// import 'vue3-emoji-picker/dist/style.css'
import 'videojs-flvjs-es6'
import flvjs from 'flv.js';

import dayjs from "dayjs";

const { updateSupplierStream, updateSportLiveStream,getStreamers,getSportLiveSupplierStream, getSportLiveStream, deleteSportLiveSupplierStream,deleteSportLiveStream,createSportLiveSupplierStream, getChatHistoryExport,getChatHistory,createSportLiveStream, getLiveMonitorScores } = DashboardService
const toast = useToast()
const confirm = useConfirm()

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
  confirm.require({
    message: t('message.confirmDelete'),
    header: t('fields.confirm'),
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: t('fields.confirm'),
    rejectLabel: t('fields.cancel'),
    accept: async () => {
      try {
        await deleteSportLiveStream(streamId);
        toast.add({ severity: 'success', summary: t("message.deleteSuccess"), life: 3000 });
        await loadEvent();
      } catch (error) {
        toast.add({ severity: 'error', summary: t("message.deleteFailed"), life: 3000 });
      }
    },
    reject: () => {
      // 用户点击取消时的处理（可留空）
    }
  });
}

async function setSupplierDefault(id) {
  await updateSupplierStream({ eventId: eventId.value, id: id, isDefault: 1 });
  toast.add({
    severity: 'success',
    summary: t('message.updateSuccess'),
    life: 3000
  });
  await loadEvent();
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    toast.add({
      severity: 'success',
      summary: t('message.copySuccess'),
      life: 3000
    });
  }).catch(() => {
  });
}

async function deleteSupplierStream(streamId) {
  confirm.require({
    message: t('message.confirmDelete'),
    header: t('fields.confirm'),
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: t('fields.confirm'),
    rejectLabel: t('fields.cancel'),
    accept: async () => {
      try {
        await deleteSportLiveSupplierStream(streamId);
        toast.add({
          severity: 'success',
          summary: t('message.deleteSuccess'),
          life: 3000
        });
        await loadEvent();
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: t('message.deleteFailed'),
          life: 3000
        });
      }
    },
    reject: () => {
      // 可选处理取消操作
    }
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
      confirm.require({
        message: t('message.streamUrlNotM3U8OrFlv'),
        header: t('fields.confirm'),
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: t('fields.confirm'),
        rejectLabel: t('fields.cancel'),
        accept: () => {
          const queryParams = url.includes('?') ? '?' + url.split('?')[1] : '';
          form.sourceStreamUrl = corrected + queryParams;

          toast.add({
            severity: 'success',
            summary: t('message.replacedWithM3U8'),
            life: 3000
          });

          supplierCreate();
        },
        reject: () => {
          toast.add({
            severity: 'warn',
            summary: t('message.streamUrlMustBeM3U8OrFlv'),
            life: 3000
          });
        }
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
    toast.add({
      severity: 'success',
      summary: t('message.addSuccess'),
      life: 3000
    });
    uiControl.dialogVisible = false;
    await loadEvent();
  });
}

async function streamerSave() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    await createSportLiveStream({ eventId: eventId.value, liveStreamerId: form.streamerId, status: 0, roomMessage: form.roomMessage, scheduledAnnouncement: form.scheduledAnnouncement });
    toast.add({
      severity: 'success',
      summary: t('message.updateSuccess'),
      life: 3000
    });
    uiControl.dialogVisible = false;
    await loadEvent();
  });
}

async function streamerUpdate() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    await updateSportLiveStream({ eventId: eventId.value, status: 0, id: form.id, roomMessage: form.roomMessage, roomTitle: form.roomTitle, scheduledAnnouncement: form.scheduledAnnouncement });
    toast.add({
      severity: 'success',
      summary: t('message.updateSuccess'),
      life: 3000
    });
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
  toast.add({
    severity: 'success',
    summary: t('message.updateSuccess'),
    life: 3000
  });
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

async function requestExportExcel(streamerId) {
  const query = {};
  query.streamId = streamerId;
  query.siteId = 7;

  const { data: ret } = await getChatHistoryExport(query)
  if (ret) {
    uiControl.messageVisible = true;
  }
}

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

  const siteId = 7;
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
  const { data: timeZone } = await SiteService.getSiteTimeZoneById(
    7
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

