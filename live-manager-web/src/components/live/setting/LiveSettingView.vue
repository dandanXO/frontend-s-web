<template>
  <ConfirmDialog /> 
  <div class="card">
    <h3 style="margin-bottom: 10px">{{ t('fields.liveSportSupplierStreamManage') }}</h3>

    <div style="display: flex; gap: 10px; margin-top: 10px; margin-bottom: 10px; height: 30px;">
      <Button icon="pi pi-plus" severity="info" size="small" @click="showDialog('SUPPLIER_CREATE')" style="min-width: 100px">{{ t('fields.add') }}</Button>
      <Button icon="pi pi-refresh" severity="info" size="small" @click="initialSupplierStreamStatus()" style="min-width: 150px">{{ t('fields.initialSupplierStreamStatus') }}</Button>
    </div>
    <DataTable 
      :value="supplierStreams" 
      :loading="loading" 
      :scrollable="true"
    >
      <Column field="sourceStreamUrl" style="width: 25%; margin-right: 10px">
        <template #body="slotProps">  
          <div v-if="slotProps.data.sourceStreamUrl">
            <a :href="slotProps.data.sourceStreamUrl" target="_blank">{{ slotProps.data.sourceStreamUrl }}</a>
            <div style="display: flex; justify-content: flex-end; gap: 10px; align-items: center;">
              <Button 
                icon="pi pi-eye" 
                severity="info" 
                size="small"
                @click="openPreview(slotProps.data.sourceStreamUrl)" 
              />
              <div class="signal-bars" v-if="monitorScoreMap[slotProps.data.streamId] !== undefined">
                <span
                  v-for="n in 5"
                  :key="n"
                  class="bar"
                  size="small"
                  :class="{active: n <= monitorScoreMap[slotProps.data.streamId]}"
                />
              </div>
            </div>
          </div>
          <div v-else>
            -
          </div>
        </template>
      </Column>
      <Column :field="t('fields.supplierCdnPushUrl')" :header="t('fields.supplierCdnPushUrl')" style="width: 25%; margin-right: 10px" />
      <Column :field="t('fields.supplierCdnPullUrl')" :header="t('fields.supplierCdnPullUrl')" style="width: 25%; margin-right: 10px">
        <template #body="slotProps">
          <span>
            {{
              (() => {
                try {
                  return JSON.parse(slotProps.data.supplierCdnPullUrl || '{}')?.original?.hls_url
                    || JSON.parse(slotProps.data.supplierCdnPullUrl || '{}')?.original?.flv_url
                    || '-'
                } catch {
                  return '-'
                }
              })()
            }}
          </span>
        </template>
      </Column>
      <Column :field="t('fields.operator')" :header="t('fields.operator')" style="width: 25%;">
        <template #body="slotProps">
          <div style="display: flex; gap: 10px; flex-wrap: nowrap; min-width: 0;">
            <Button icon="pi pi-pencil" style="min-width: 100px; max-width: 100px; white-space: nowrap;" severity="danger" size="small" @click="deleteSupplierStream(slotProps.data.id)">{{ t('fields.delete') }}</Button>
            <Button icon="pi pi-trash" style="min-width: 100px; max-width: 100px; white-space: nowrap;" severity="success" :disabled="slotProps.data.isDefault === 1" size="small" @click="setSupplierDefault(slotProps.data.id)">{{ slotProps.data.isDefault === 1 ? t('fields.defaultStream') : t('fields.switch') }}</Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <div class="card">
    <h3 style="margin-bottom: 10px">{{ t('fields.liveSportStreamManage') }}</h3>

    <div>
      <Button icon="pi pi-plus" severity="info" size="small" @click="showDialog('STREAMER_CREATE')" style="min-width: 100px">{{ t('fields.add') }}</Button>
    </div>
    <DataTable 
      :value="streamerStreams" 
      :loading="loading" 
      :scrollable="true"

    >
      <Column field="streamerName" :header="t('fields.streamer')" style="width: 10%" />
      <Column field="streamerCdnPushUrl" :header="t('fields.streamerCdnPushUrl')" style="width: 20%; word-break: break-all; white-space: normal; vertical-align: top;" />
      <Column :header="t('fields.streamerCdnPullUrl')" style="width: 20%; word-break: break-all; white-space: normal; vertical-align: top;">
        <template #body="slotProps">
          <span>
            {{
              (() => {
                try {
                  return JSON.parse(slotProps.data.streamerCdnPullUrl || '{}')?.original?.hls_url || '-'
                } catch {
                  return '-'
                }
              })()
            }}
          </span>
          <div style="display: flex; justify-content: flex-end; gap: 10px; align-items: center;">
            <Button icon="pi pi-eye" v-if="JSON.parse(slotProps.data.streamerCdnPullUrl || '{}')?.original?.hls_url" severity="info" size="small" @click="openPreview(slotProps.data.streamerCdnPullUrl)" />
            <div class="signal-bars" v-if="monitorScoreMap[slotProps.data.streamId] !== undefined">
              <span
                v-for="n in 5"
                :key="n"
                class="bar"
                :class="{active: n <= monitorScoreMap[slotProps.data.streamId]}"
              />
            </div>
          </div>
        </template>
      </Column>
      <Column field="roomMessage" :header="t('fields.roomMessage')" style="width: 10%; text-align: center;" />
      <Column field="scheduledAnnouncement" :header="t('fields.scheduledAnnouncement')" style="width: 10%; text-align: center;" />
      <Column field="subscribeCount" :header="t('fields.subscribeCount')" style="width: 10%; text-align: center;" />
      <Column :header="t('fields.operator')" style="width: 20%">
        <template #body="slotProps">
          <div style="display: flex; gap: 10px; flex-wrap: nowrap; min-width: 0;">
            <Button icon="pi pi-pencil" style="min-width: 100px; max-width: 100px; white-space: nowrap;" severity="secondary" size="small" @click="openChatHistory(slotProps.data.id)">{{ t('fields.chatHistory') }}</Button>
            <Button icon="pi pi-trash" style="min-width: 100px; max-width: 100px; white-space: nowrap;" severity="primary" size="small" @click="showDialog('STREAMER_EDIT', slotProps.data)"> {{ t('fields.edit')  }}</Button>
            <Button icon="pi pi-trash" style="min-width: 100px; max-width: 100px; white-space: nowrap;" severity="danger" size="small" @click="deleteStream(slotProps.data.id)">{{ t('fields.delete')  }}</Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <div class="roles-main">
    <Dialog v-model:visible="uiControl.dialogVisible" :header="uiControl.dialogTitle" modal :style="{ width: '780px' }">
      <form @submit.prevent="submit" ref="formRef" :model="form" :rules="formRules" class="p-fluid">
        <div v-if="uiControl.dialogType === 'SUPPLIER_CREATE'">
          <div style="margin-bottom: 15px; display: flex; align-items: center">
            <div style="width: 150px; text-align: right">
              <label for="sourceStreamUrl" style="margin-right: 20px">{{ t('fields.sourceStreamUrl') }}</label>
            </div>
            <InputText id="sourceStreamUrl" v-model="form.sourceStreamUrl" style="min-width: 70%" />
          </div>
          
          <div class="field-checkbox" style="margin-bottom: 15px; display: flex; align-items: center;">
            <div  style="width: 150px; text-align: right;">
              <Checkbox v-model="form.isCdnPush" :binary="true" inputId="isCdnPush"  style="margin-right: 20px" />
            </div>
            
            <label for="isCdnPush">{{ t('fields.isCdnPush') }}</label>
          </div>
        </div>
        <div v-if="uiControl.dialogType === 'STREAMER_CREATE'">
          <div class="p-field">
            <label for="streamerId">{{ t('fields.streamer') }}</label>
            <Dropdown id="streamerId" v-model="form.streamerId" :options="streamerList" optionLabel="name" optionValue="id" style="width: 300px;" />
          </div>
        </div>

        <div v-if="uiControl.dialogType.includes('STREAMER_')">
          <div class="p-field">
            <label for="roomMessage">{{ t('fields.roomMessage') }}</label>
            <Textarea id="roomMessage" v-model="form.roomMessage" rows="3" maxlength="200" style="width: 300px;" />
          </div>
          <div class="p-field">
            <label for="emoji"></label>
            <Button icon="pi pi-smile" class="p-button-sm mt-2" @click="showEmojiPickerForMessage = !showEmojiPickerForMessage" style="width: 80px;">Emoji</Button>
            <div v-if="showEmojiPickerForMessage" style="position: absolute; z-index: 100;">
              <!-- 遮罩層，點擊時關閉 -->
              <div
                style="position: fixed; inset: 0; z-index: 99;"
                @click="showEmojiPickerForMessage = false"
              ></div>
              <EmojiPicker  @select="insertEmojiToMessage" style="position: absolute;z-index: 100;"/>
            </div>
          </div>
          <div class="p-field">
            <label for="roomTitle">{{ t('fields.roomTitle') }}</label>
            <Textarea id="roomTitle" v-model="form.roomTitle" rows="3" maxlength="200" style="width: 300px;" />
          </div>
          <div class="p-field">
            <label for="emoji"></label>
            <Button icon="pi pi-smile" class="p-button-sm mt-2" @click="showEmojiPicker = !showEmojiPicker" style="width: 80px;">Emoji</Button>
            <div v-if="showEmojiPicker" style="position: absolute; z-index: 100;">
              <!-- 遮罩層，點擊時關閉 -->
              <div
                style="position: fixed; inset: 0; z-index: 99;"
                @click="showEmojiPicker = false"
              ></div>
              <EmojiPicker @select="insertEmoji" style="position: absolute;z-index: 100;"/>
            </div>
          </div>
          <div class="p-field">
            <label for="scheduledAnnouncement">{{ t('fields.scheduledAnnouncement') }}</label>
            <Textarea id="scheduledAnnouncement" v-model="form.scheduledAnnouncement" rows="3" maxlength="200" style="width: 300px;" />
          </div>
          <div class="p-field">
            <label for="emoji"></label>
            <Button icon="pi pi-smile" class="p-button-sm mt-2" @click="showEmojiPickerForScheduled = !showEmojiPickerForScheduled" style="width: 80px;">Emoji</Button>
            
            <div v-if="showEmojiPickerForScheduled" style="position: absolute; z-index: 100;">
              <!-- 遮罩層，點擊時關閉 -->
              <div
                style="position: fixed; inset: 0; z-index: 99;"
                @click="showEmojiPickerForScheduled = false"
              ></div>
              <EmojiPicker @select="insertEmojiToScheduled" style="position: absolute;z-index: 100;"/>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <Button :label="t('fields.cancel')" @click="uiControl.dialogVisible = false" class="p-button-text" style="margin-right: 10px;" />
          <Button :label="t('fields.confirm')" type="submit" icon="pi pi-check" />
        </div>
      </form>
    </Dialog>

    <Dialog v-model:visible="chatHistoryDialog.visible" :header="t('fields.chatHistory')" modal :style="{ width: '780px' }">
      <DataTable :value="chatHistoryDialog.chatList" :loading="chatHistoryDialog.loading" :scrollable="true">
        <Column field="name" :header="t('fields.name')" />
        <Column field="content" :header="t('fields.content')" />
        <Column :header="t('fields.createTime')">
          <template #body="slotProps">
            {{ formatTime(slotProps.data.createTime) }}
          </template>
        </Column>
      </DataTable>
      <Paginator
        :rows="chatHistoryDialog.page.size"
        :totalRecords="chatHistoryDialog.page.total"
        :rowsPerPageOptions="[10, 20, 50]"
        :first="(chatHistoryDialog.page.current - 1) * chatHistoryDialog.page.size"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        @page="handleChatPageChange"
        class="p-mt-2"
        />
    </Dialog>

    <Dialog v-model:visible="previewDialog.visible" :header="t('fields.preview')" modal :style="{ width: '780px' }">
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
import 'vue3-emoji-picker/css'; 
import 'videojs-flvjs-es6'
import { useUserStore } from "@/stores/userStore";

import flvjs from 'flv.js';

import dayjs from "dayjs";

const { updateSupplierStream, updateSportLiveStream,getStreamers,getSportLiveSupplierStream, getSportLiveStream, deleteSportLiveSupplierStream,deleteSportLiveStream,createSportLiveSupplierStream, getChatHistoryExport,getChatHistoryv2,createSportLiveStream, getLiveMonitorScores } = DashboardService
const toast = useToast()
const confirm = useConfirm()
const store = useUserStore()
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
    const data = await getLiveMonitorScores(allStreamIds);
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
  if(!form.sourceStreamUrl) {
    toast.add({
      severity: 'error',
      summary: t('message.validateSupplierStreamRequired'),
      life: 3000
    });
  }
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
}

async function streamerSave() {
  await createSportLiveStream({ eventId: eventId.value, liveStreamerId: form.streamerId, status: 0, roomMessage: form.roomMessage, roomTitle: form.roomTitle, scheduledAnnouncement: form.scheduledAnnouncement });
  toast.add({
    severity: 'success',
    summary: t('message.updateSuccess'),
    life: 3000
  });
  uiControl.dialogVisible = false;
  await loadEvent();
}

async function streamerUpdate() {
  await updateSportLiveStream({ eventId: eventId.value, status: 0, id: form.id, roomMessage: form.roomMessage, roomTitle: form.roomTitle, scheduledAnnouncement: form.scheduledAnnouncement });
  toast.add({
    severity: 'success',
    summary: t('message.updateSuccess'),
    life: 3000
  });
  uiControl.dialogVisible = false;
  await loadEvent();
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
    uiControl.dialogTitle = t('fields.add');
  }

  if (type === 'STREAMER_EDIT' && row) {
    fetchStreamers();
    form.streamerId = row.streamerId;
    form.id = row.id;
    form.scheduledAnnouncement = row.scheduledAnnouncement;
    form.roomMessage = row.roomMessage;
    form.roomTitle = row.roomTitle;
    uiControl.dialogTitle = t('fields.edit');
  }

  if (type === 'SUPPLIER_CREATE') {
    form.sourceStreamUrl = '';
    form.isCdnPush = false;
    uiControl.dialogTitle = t('fields.add');
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
  getChatHistoryv2(`?${query.toString()}`, { streamId: chatHistoryDialog.streamerId, siteId: siteId })
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
  const { data: timeZone } = SiteService.getSiteTimeZoneById(
    7
  )
  console.log("store : ", store.siteId)
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

.p-field {
  display: flex;
  align-items: center; /* 垂直居中 */
  margin-bottom: 15px; /* 底部間距 */
}

.p-field label {
  flex: 0 0 150px; /* 固定寬度 */
  text-align: right;
  margin-right: 20px;
}
</style>

