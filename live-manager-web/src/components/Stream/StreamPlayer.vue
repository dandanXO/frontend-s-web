<template>
  <Dialog
    :visible="visible"
    :modal="true"
    :style="{ width: '90vw' }"
    :maximizable="true"
    :closable="true"
    @hide="onHide"
    @update:visible="(val) => emit('update:visible', val)"
  >
    <template #header>
      <div class="dialog-header">
        <h3>{{ streamTitle }} - {{ formatQuality(currentQuality) }}</h3>
      </div>

    </template>

    <div class="stream-control-btn">
      <div class="control-container">
        <Tabs v-model:value="currentPlayerType" @update:value="changeQuality(currentQuality)">
          <TabList>
            <Tab :value="playerType.value" v-for="playerType in playerTypes">{{
              playerType.label
            }}</Tab>
          </TabList>
        </Tabs>
        <div class="flex-spacer"></div>
        <Button
          v-if="isOwnStream"
          :label="isLiveStream ? '關閉直播' : '開始直播'"
          :severity="isLiveStream ? 'danger' : 'success'"
          :loading="isStatusChanging"
          @click="toggleStreamStatus"
        />
      </div>
    </div>

    <div class="stream-info">
      <div class="info-item">
        <span class="label">{{ $t('stream.host') }}</span>
        <span class="value">{{ stream.streamerName }}</span>
      </div>
      <div class="info-item">
        <span class="label">{{ $t('stream.supplierStreamID') }}</span>
        <span class="value">{{ stream.supplierStreamId }}</span>
      </div>
      <div class="info-item">
        <span class="label">{{ $t('stream.hostStreamID') }}</span>
        <span class="value">{{ stream.streamerStreamId }}</span>
      </div>
      <div class="info-item">
        <span class="label">{{ $t('stream.currentQuality') }}</span>
        <span class="value">{{ formatQuality(currentQuality) }}</span>
      </div>
      <div class="info-item">
        <span class="label">{{ $t('stream.supplierPlaybackLink') }}</span>
        <div class="url-container">
          <span class="url-text">{{ getCurrentPlayUrl() }}</span>
          <Button
            icon="pi pi-copy"
            severity="secondary"
            text
            @click="copyUrl(getCurrentPlayUrl())"
            v-tooltip.top="'複製鏈結'"
          />
        </div>
      </div>
      <div class="info-item">
        <span class="label">{{ $t('stream.hostPlaybackLink') }}</span>
        <div class="url-container">
          <span class="url-text">{{ getStreamerPlayUrl() }}</span>
          <Button
            icon="pi pi-copy"
            severity="secondary"
            text
            @click="copyUrl(getStreamerPlayUrl())"
            v-tooltip.top="'複製鏈結'"
          />
        </div>
      </div>
    </div>

    <Tabs v-model:value="currentQuality" @update:value="changeQuality(currentQuality)">
      <TabList>
        <Tab :value="quality.value" v-for="quality in availableQualities">{{ quality.label }}</Tab>
      </TabList>
    </Tabs>

    <div class="players-container">
      <div
        class="player-section"
        :style="`display:${currentPlayerType === 'supplier' ? 'block' : 'none'}`"
      >
        <div class="video-container">
          <div v-if="supplierLoadError" class="error-overlay">
            <i class="pi pi-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem"></i>
            <p>{{ supplierLoadError }}</p>
          </div>
          <video
            ref="supplierPlayer"
            id="supplierPlayer"
            class="video-js vjs-big-play-centered"
            controls
            preload="auto"
            width="100%"
            height="auto"
            data-setup="{}"
          ></video>
        </div>
      </div>

      <div
        class="player-section"
        :style="`display:${currentPlayerType === 'host' ? 'block' : 'none'}`"
      >
        <div class="video-container">
          <div v-if="streamerLoadError" class="error-overlay">
            <i class="pi pi-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem"></i>
            <p>{{ streamerLoadError }}</p>
          </div>
          <video
            ref="streamerPlayer"
            id="streamerPlayer"
            class="video-js vjs-big-play-centered"
            controls
            preload="auto"
            width="100%"
            height="auto"
            data-setup="{}"
          ></video>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { DashboardService } from '@/service/DashboardService'
import videojs from 'video.js'
import 'video.js/dist/video-js.min.css'
import '@videojs/http-streaming'
import flvjs from 'flv.js'
import { useToast } from 'primevue/usetoast'
import { useRoute } from 'vue-router';

const route = useRoute();
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  stream: {
    type: Object,
    default: () => ({
      title: '',
      playUrls: {
        hls: '',
        flv: '',
      },
    }),
  },
})

const emit = defineEmits(['update:visible', 'reload'])

const player = ref(null)
const supplierPlayer = ref(null)
const streamerPlayer = ref(null)
const supplierPlayerInstance = ref(null)
const streamerPlayerInstance = ref(null)
const streamTitle = ref('')
const currentPlayerType = ref('supplier')
const currentQuality = ref('p1080')
const isLoading = ref(false)
const isInitialized = ref(false)
const playerTypes = ref([
  { label: '供应商播放器', value: 'supplier' },
  { label: '主播播放器', value: 'host' },
])
const availableQualities = ref([
  { label: '1080P', value: 'p1080' },
  { label: '720P', value: 'p720' },
  { label: '540P', value: 'p540' },
  { label: 'Original', value: 'original' },
])

// 清除數據
const clearData = () => {
  streams.value = [];
  loading.value = false;
};

const supplierLoadError = ref(null)
const streamerLoadError = ref(null)
const isOwnStream = ref(false)
const isLiveStream = ref(false)
const isStatusChanging = ref(false)
const streams = ref([])
const loading = ref(false)

// 初始化 toast 服務
const toast = useToast()

// 初始化 store
const userStore = useUserStore()

const checkStreamStatus = () => {
  isLiveStream.value = props.stream?.streamerStatus
}
// 註冊 FLV 插件
const registerFlvPlugin = () => {
  if (!videojs.getTech('FlvJs')) {
    const Tech = videojs.getTech('Tech');

    class FlvJsTech extends Tech {
      constructor(options, ready) {
        super(options, ready);
        this.flvPlayer = null;
        this.options_ = options;

        if (options.source) {
          this.setSource(options.source);
        } else {
          console.error('初始化 FlvJsTech 時缺少 source');
        }
      }

      static isSupported() {
        return flvjs.isSupported();
      }

      setSource(source) {
        if (!source || !source.src) {
          console.error('FlvJsTech.setSource: 缺少 source 或 source.src');
          return;
        }

        if (this.flvPlayer) {
          this.flvPlayer.destroy();
          this.flvPlayer = null;
        }

        if (flvjs.isSupported()) {
          const flvOptions = {
            type: 'flv',
            url: source.src,
            isLive: true,
            hasAudio: true,
            hasVideo: true,
            cors: true,
            enableStashBuffer: false,
            stashInitialSize: 128,
            enableWorker: true,
            lazyLoad: false,
          };

          this.flvPlayer = flvjs.createPlayer(flvOptions);
          this.flvPlayer.attachMediaElement(this.el());
          this.flvPlayer.load();

          this.flvPlayer.on(flvjs.Events.ERROR, (errorType, errorDetail) => {
            console.error('FLV 播放器錯誤:', errorType, errorDetail);
          });

          this.flvPlayer.on(flvjs.Events.LOADING_COMPLETE, () => {
            console.log('FLV 載入完成');
          });
        }
      }

      dispose() {
        if (this.flvPlayer) {
          this.flvPlayer.destroy();
          this.flvPlayer = null;
        }
        super.dispose();
      }
    }

    videojs.registerTech('FlvJs', FlvJsTech);
  }
}

// 初始化播放器
const initializePlayers = async () => {
  if (supplierPlayer.value && !supplierPlayerInstance.value) {
    try {
      const options = {
        autoplay: false,
        controls: true,
        preload: 'auto',
        fluid: true,
        aspectRatio: '16:9',
        techOrder: ['html5'],
        sources: [{
          src: props.stream?.supplierCdnPullUrl?.[currentQuality.value]?.hlsUrl,
          type: 'application/x-mpegURL'
        }],
        html5: {
          nativeVideoTracks: false,
          nativeAudioTracks: false,
          nativeTextTracks: false,
          hls: {
            overrideNative: true,
          },
        },
      };
      supplierPlayerInstance.value = videojs(supplierPlayer.value, options);
      supplierPlayerInstance.value.ready(() => {
        console.log('供應商播放器已準備好');
      });
    } catch (error) {
      console.error('初始化供應商播放器失敗:', error);
      supplierLoadError.value = '播放器初始化失敗';
    }
  }

  if (streamerPlayer.value && !streamerPlayerInstance.value) {
    try {
      const options = {
        autoplay: false,
        controls: true,
        preload: 'auto',
        fluid: true,
        aspectRatio: '16:9',
        techOrder: ['html5'],
        sources: [{
          src: props.stream?.streamerCdnPullUrl?.[currentQuality.value]?.hlsUrl,
          type: 'application/x-mpegURL'
        }],
        html5: {
          nativeVideoTracks: false,
          nativeAudioTracks: false,
          nativeTextTracks: false,
          hls: {
            overrideNative: true,
          },
        },
      };
      streamerPlayerInstance.value = videojs(streamerPlayer.value, options);
      streamerPlayerInstance.value.ready(() => {
        console.log('主播播放器已準備好');
      });
    } catch (error) {
      console.error('初始化主播播放器失敗:', error);
      streamerLoadError.value = '播放器初始化失敗';
    }
  }
}

// 格式化質量顯示
const formatQuality = (quality) => {
  if (!quality) return ''
  // 如果是 p540 格式，轉換為 540P
  if (quality.startsWith('p')) {
    return quality.substring(1).toUpperCase() + 'P'
  }
  return quality
}

// 開始播放
const startPlay = async () => {
  if (supplierPlayerInstance.value) {
    console.log('開始播放供應商串流');
    try {
      supplierLoadError.value = null;
      const supplierUrl = props.stream?.supplierCdnPullUrl?.[currentQuality.value]?.hlsUrl;
      console.log('供應商串流地址:', supplierUrl);
      if (supplierUrl) {
        supplierPlayerInstance.value.src({ type: 'application/x-mpegURL', src: supplierUrl });
        supplierPlayerInstance.value.play();
      } else {
        supplierLoadError.value = '無效的播放地址';
      }
    } catch (error) {
      console.error('供應商播放錯誤:', error);
      supplierLoadError.value = '串流載入失敗';
    }
  }

  if (streamerPlayerInstance.value) {
    console.log('開始播放主播串流');
    try {
      streamerLoadError.value = null;
      const streamerUrl = props.stream?.streamerCdnPullUrl?.[currentQuality.value]?.hlsUrl;
      console.log('主播串流地址:', streamerUrl);
      if (streamerUrl) {
        streamerPlayerInstance.value.src({ type: 'application/x-mpegURL', src: streamerUrl });
        streamerPlayerInstance.value.play();
      } else {
        streamerLoadError.value = '無效的播放地址';
      }
    } catch (error) {
      console.error('主播播放錯誤:', error);
      streamerLoadError.value = '串流載入失敗';
    }
  }
}

// 播放指定串流
const playStream = async (playerInstance, url, type) => {
  if (!playerInstance || !url) {
    console.error(`${type} 播放器或 URL 未定義`);
    return;
  }

  try {
    await playerInstance.pause();

    if (!playerInstance.tech_ || !playerInstance.tech_.el_) {
      console.error(`${type} 技術層未初始化`);
      return;
    }

    if (flvjs.isSupported()) {
      const flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: url,
        isLive: true,
        hasAudio: true,
        hasVideo: true,
        cors: true,
        enableStashBuffer: false,
        stashInitialSize: 128,
        enableWorker: true,
        lazyLoad: false,
      });

      const videoElement = playerInstance.tech().el();
      if (playerInstance.flvPlayer) {
        playerInstance.flvPlayer.destroy();
      }

      playerInstance.flvPlayer = flvPlayer;
      flvPlayer.attachMediaElement(videoElement);
      flvPlayer.load();

      flvPlayer.on(flvjs.Events.ERROR, (errorType, errorDetail) => {
        console.error(`${type} FLV Player Error:`, errorType, errorDetail);
        if (type === 'supplier') {
          supplierLoadError.value = '串流載入失敗';
        } else {
          streamerLoadError.value = '串流載入失敗';
        }
      });
    }
  } catch (error) {
    console.error(`${type} 播放錯誤:`, error);
    throw error;
  }
}

// 切換視頻質量
const changeQuality = (quality) => {
  if (isLoading.value || !supplierPlayerInstance.value || !streamerPlayerInstance.value) return

  currentQuality.value = quality
  const supplierSrc = props.stream?.supplierCdnPullUrl[quality]?.flvUrl
  const streamerSrc = props.stream?.streamerCdnPullUrl[quality]?.flvUrl

  if (!supplierSrc || !streamerSrc) {
    console.error('無效的播放地址')
    return
  }

  console.log('切換畫質:', quality, '供應商地址:', supplierSrc, '主播地址:', streamerSrc)
  startPlay()
}

// 檢查是否是自己的直播
const checkStreamOwnership = () => {
  const loginName = sessionStorage.getItem('loginName');
  isOwnStream.value = props.stream?.streamerName === loginName;
}

// 切換直播狀態
const toggleStreamStatus = async () => {
  let success = false; // 添加一個標誌來追蹤 API 是否成功
  try {
    isStatusChanging.value = true
    const targetStatus = !isLiveStream.value // 先確定目標狀態

    // 調用 API 更新直播狀態
    await DashboardService.changeMyStreamStatus(props.stream.streamerStreamId, targetStatus)

    // 更新本地狀態 (僅在 API 成功後)
    isLiveStream.value = targetStatus

    success = true; // 標記 API 成功

    // 顯示成功提示
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: isLiveStream.value ? '直播已開始' : '直播已關閉',
      life: 3000
    })

  } catch (error) {
    console.error('切換直播狀態失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '切換直播狀態失敗',
      life: 3000
    })
  } finally {
    isStatusChanging.value = false
    // 關閉對話框
    onHide();
    console.log('關閉視窗')

    // 只有在 API 成功時才觸發重新載入
    if (success) {
      emit('reload')
      console.log('重新載入')
    }
  }
}

// 關閉對話框
const onHide = () => {
  emit('update:visible', false)
}
// 監聽對話框的可見性變化
watch(
  () => props.visible,
  async (newValue) => {
    if (newValue) {
      isInitialized.value = true;
      supplierLoadError.value = null;
      streamerLoadError.value = null;
      streamTitle.value = props.stream?.title || '直播';
      await nextTick();

      // 初始化播放器
      await initializePlayers();

      // 確保播放器實例已初始化後再開始播放
      if (supplierPlayerInstance.value) {
        console.log('初始載入開始播放供應商串流');
        await startPlay();
      }
      if (streamerPlayerInstance.value) {
        console.log('初始載入開始播放主播串流');
        await startPlay();
      }

      console.log('初始化完成');
      checkStreamOwnership();
      checkStreamStatus();
    } else {
      if (supplierPlayerInstance.value) {
        try {
          await supplierPlayerInstance.value.pause();
          supplierPlayerInstance.value.reset();
        } catch (error) {
          console.warn('關閉供應商播放器時發生錯誤:', error);
        }
        isLoading.value = false;
      }
      if (streamerPlayerInstance.value) {
        try {
          await streamerPlayerInstance.value.pause();
          streamerPlayerInstance.value.reset();
        } catch (error) {
          console.warn('關閉主播播放器時發生錯誤:', error);
        }
        isLoading.value = false;
      }
    }
  },
  { immediate: true },
  () => props.stream?.streamerStatus,
  () => {
    checkStreamStatus()
  }
)

// 組件卸載時清理播放器
onBeforeUnmount(() => {
  if (player.value) {
    if (player.value.flvPlayer) {
      player.value.flvPlayer.destroy()
    }
    player.value.dispose()
    player.value = null
    isInitialized.value = false
  }
})

const getCurrentPlayUrl = () => {
  if (!props.stream) return ''
  return props.stream.supplierCdnPullUrl?.[currentQuality.value]?.hlsUrl || ''
}

const getStreamerPlayUrl = () => {
  if (!props.stream) return ''
  return props.stream.streamerCdnPullUrl?.[currentQuality.value]?.hlsUrl || ''
}

const copyUrl = async (url) => {
  try {
    await navigator.clipboard.writeText(url)
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '鏈結已複製到剪貼簿',
      life: 3000,
    })
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '複製失敗',
      life: 3000,
    })
  }
}
</script>

<style scoped lang="scss">
.video-container {
  width: 100%;
  background-color: #000;
  aspect-ratio: 16/9;
  position: relative;
}

.dialog-header {
  padding: 0 1rem;
}

.dialog-header h3 {
  margin: 0;
}

.quality-selector {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

:deep(.p-dialog-content) {
  padding: 0 !important;
  background-color: #000;
}

:deep(.vjs-big-play-centered .vjs-big-play-button) {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

:deep(.video-js) {
  width: 100%;
  height: 100%;
}

.stream-info {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin: 1rem 0;
}

.info-item {
  margin-bottom: 0.5rem;
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 0.5rem;
  align-items: center;
  font-size: 14px;
}

.info-item .label {
  font-weight: bold;
  white-space: pre-wrap;
  color: #666;
  position: relative;

  &:after {
    position: absolute;
    content: ':';
    right: 0;
  }
}

.info-item .value {
  color: #333;
  word-break: break-all;
}

.url-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.url-text {
  flex: 1;
  word-break: break-all;
  font-family: monospace;
  background-color: #eee;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9em;
}

.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  z-index: 2;
  text-align: center;
  padding: 1rem;
}

.error-overlay p {
  margin: 0;
  font-size: 1.1rem;
}

.players-container {
  position: relative;
}

.player-section {
  margin: 1rem;
}

:deep(.p-tab) {
  font-family: 'Inter';
}

.my-app-dark {
  .stream-info {
    background-color: #252525;
  }

  .url-text {
    background-color: #333333;
  }

  .info-item .label,
  .info-item .value {
    color: #fff;
  }
}

.control-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.flex-spacer {
  flex: 1;
}

:deep(.p-tabview-nav) {
  display: flex;
  align-items: center;
}

.stream-control-btn {
  width: 100%;
  padding: 0.5rem 1rem;
}
</style>
