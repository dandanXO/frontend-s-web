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
        <Tabs v-model:value="currentPlayerType" @update:value="handlePlayerTypeChange">
          <TabList>
            <Tab :value="playerTypes[0].value">{{ playerTypes[0].label }}</Tab>
            <Tab
              v-if="playerTypes[1]"
              :value="playerTypes[1].value"
              :disabled="!streamerHasValidUrl"
            >
              {{ playerTypes[1].label }}
              <i v-if="!streamerHasValidUrl" class="pi pi-ban ml-2" v-tooltip.top="'主播流地址無效'"></i>
            </Tab>
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
	          :key="`${currentQuality}-${currentPlayerType}`"
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
        <template v-if="streamerHasValidUrl">
          <div class="video-container">
            <div v-if="streamerLoadError" class="error-overlay">
              <i class="pi pi-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem"></i>
              <p>{{ streamerLoadError }}</p>
            </div>
            <video
	            :key="`${currentQuality}-${currentPlayerType}`"
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
        </template>
        <div v-else class="error-overlay">
          <i class="pi pi-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem"></i>
          <p>主播流地址無效或不可用</p>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, onBeforeUnmount, watch, nextTick, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { DashboardService } from '@/service/DashboardService'
import videojs from 'video.js'
import 'video.js/dist/video-js.min.css'
import '@videojs/http-streaming'
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
const currentQuality = ref('original')
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

const supplierLoadError = ref(null)
const streamerLoadError = ref(null)
const isOwnStream = ref(false)
const isLiveStream = ref(false)
const isStatusChanging = ref(false)

// 初始化 toast 服務
const toast = useToast()

const streamerHasValidUrl = computed(() => {
  return !!props.stream?.streamerCdnPullUrl?.[currentQuality.value]?.hlsUrl;
})

const checkStreamStatus = () => {
  isLiveStream.value = props.stream?.streamerStatus
}

// 初始化播放器
const initializePlayers = async () => {
  const setupPlayer = (playerRef, instanceRef, url, type, errorRef, shouldInitialize) => {
    if (shouldInitialize && playerRef.value && !instanceRef.value) {
      if (!url) {
        console.warn(`[initialize] ${type} URL 無效或缺失，不進行初始化`);
        errorRef.value = '無效的播放地址';
        return;
      }

      try {
        errorRef.value = null;
        const options = {
          autoplay: false,
          controls: true,
          preload: 'auto',
          fluid: true,
          aspectRatio: '16:9',
          techOrder: ['html5'],
          sources: [{
            src: url,
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
        instanceRef.value = videojs(playerRef.value, options);
        instanceRef.value.ready(() => {
          console.log(`${type} 播放器已準備好`);
        });
        instanceRef.value.on('error', () => {
          const error = instanceRef.value.error();
          console.error(`${type} 播放器錯誤:`, error);
          errorRef.value = `串流載入失敗: ${error?.message || '未知錯誤'}`;
        });
      } catch (error) {
        console.error(`初始化${type}播放器失敗:`, error);
        errorRef.value = '播放器初始化失敗';
      }
    } else if (!shouldInitialize && instanceRef.value) {
      console.log(`[initialize] ${type} 不應初始化，銷毀現有實例`);
      try { instanceRef.value.dispose(); } catch (e) {}
      instanceRef.value = null;
    }
  };

  const supplierUrl = props.stream?.supplierCdnPullUrl?.[currentQuality.value]?.hlsUrl;
  const streamerUrl = props.stream?.streamerCdnPullUrl?.[currentQuality.value]?.hlsUrl;

  setupPlayer(supplierPlayer, supplierPlayerInstance, supplierUrl, '供應商', supplierLoadError, true);
  setupPlayer(streamerPlayer, streamerPlayerInstance, streamerUrl, '主播', streamerLoadError, streamerHasValidUrl.value);
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

// 開始播放 (現在主要用於設置來源)
const startPlay = async (playerInstanceRef, url, type, errorRef) => {
    const playerInst = playerInstanceRef.value;

    // 1. 檢查播放器實例是否存在
    if (!playerInst) {
        console.warn(`[startPlay] ${type} 播放器實例不存在`);
        errorRef.value = '播放器未初始化';
        return;
    }

    // 2. 檢查 URL 是否有效
    if (!url) {
        console.warn(`[startPlay] ${type} 無有效的播放地址，無法設置來源`);
        errorRef.value = '無效的播放地址';
        // 如果 URL 無效，重置播放器是個好主意
        try {
            playerInst.reset();
        } catch(e) { console.warn(`Error resetting ${type} player:`, e); }
        return;
    }

    // 3. 設置來源 (只有 URL 不同時)
    console.log(`[startPlay] 準備 ${type} 串流`);
    try {
        errorRef.value = null; // 清除之前的錯誤

        const currentSrc = playerInst.currentSrc();
        console.log(`[startPlay] ${type} Current source: ${currentSrc}`);
        console.log(`[startPlay] ${type} New source: ${url}`);

        if (currentSrc !== url) {
            console.log(`[startPlay] ${type} Setting new source...`);
            playerInst.src({ type: 'application/x-mpegURL', src: url });
            // load() 很重要，告訴播放器載入新來源
            playerInst.load();
            console.log(`[startPlay] ${type} Source set and loaded, awaiting user play.`);
        } else {
            console.log(`[startPlay] ${type} Source unchanged, awaiting user play.`);
        }
        // 不自動播放
    } catch (error) {
        console.error(`[startPlay] ${type} Error setting source:`, error);
        errorRef.value = '串流來源設置失敗';
    }
}

// 切換視頻質量
const changeQuality = async (quality) => {
  console.log(`[changeQuality] Requested quality: ${quality}`);
  if (isLoading.value) {
      console.warn('[changeQuality] Skipping: Player is loading.');
      return;
  }

  // 1. 更新 currentQuality
  currentQuality.value = quality;
  console.log(`[changeQuality] currentQuality set to: ${currentQuality.value}`);

  // 2. 等待 Vue 更新 computed property (非常重要)
  await nextTick();

  // 3. 獲取新 URL 和有效性狀態
  const supplierSrc = props.stream?.supplierCdnPullUrl?.[quality]?.hlsUrl;
  const streamerSrc = props.stream?.streamerCdnPullUrl?.[quality]?.hlsUrl;
  const isStreamerUrlValidNow = streamerHasValidUrl.value; // 讀取更新後的 computed 值

  console.log(`[changeQuality] Supplier URL for ${quality}:`, supplierSrc);
  console.log(`[changeQuality] Streamer URL for ${quality}:`, streamerSrc);
  console.log(`[changeQuality] Streamer URL is valid now: ${isStreamerUrlValidNow}`);
  console.log(`[changeQuality] Supplier instance: ${!!supplierPlayerInstance.value}, Streamer instance: ${!!streamerPlayerInstance.value}`);

  destroyVideoPlayer();
  initVideoPlayer();
  return;

  // 4. 更新供應商播放器 (如果實例存在)
  if (supplierPlayerInstance.value) {
      console.log('[changeQuality] Updating supplier player...');
      await startPlay(supplierPlayerInstance, supplierSrc, '供應商', supplierLoadError);
  } else {
      console.warn('[changeQuality] Supplier player instance not found when changing quality.');
      // 如果實例不存在，可能需要重新初始化，但通常不應在此發生
  }

  console.log('isStreamerUrlValidNow', isStreamerUrlValidNow)
  console.log('streamerPlayerInstance.value', streamerPlayerInstance.value)
  // 5. 更新主播播放器 (條件性)
  if (isStreamerUrlValidNow) {
      // 新畫質的 URL 有效
      if (streamerPlayerInstance.value) {
          console.log('[changeQuality] Updating streamer player (URL is valid)...');
          await initializePlayers(); // 重新初始化會設置正確來源
          console.log('[changeQuality] streamerSrc', streamerSrc)
          await startPlay(streamerPlayerInstance, streamerSrc, '主播', streamerLoadError);
          console.log('[changeQuality] 更新主播播放器')
      } else {
          // URL 有效但實例丟失了？這不應該發生，嘗試重新初始化
          console.warn('[changeQuality] Streamer URL is valid, but instance not found. Re-initializing...');
          await initializePlayers(); // 重新初始化會設置正確來源
          // initializePlayers 內部會調用 setupPlayer，它會處理來源設置
      }
  } else {
      // 新畫質的 URL 無效
      console.log('[changeQuality] Streamer URL is invalid for this quality.');
      streamerLoadError.value = '無效的播放地址'; // 設置錯誤狀態
      if (streamerPlayerInstance.value) {
          // 如果實例存在，重置它，因為來源無效了
          console.log('[changeQuality] Resetting existing streamer player instance due to invalid URL.');
          try {
            streamerPlayerInstance.value.reset();
          } catch(e) { console.warn("Error resetting streamer player:", e); }
      }
      // 如果用戶當前正在觀看主播頁籤，自動切換回供應商
      if (currentPlayerType.value === 'host') {
           console.log("[changeQuality] Auto-switching back to supplier due to invalid streamer URL.");
           currentPlayerType.value = 'supplier';
           // 可以選擇性地再次觸發供應商的 startPlay 以確保其活躍
           if (supplierPlayerInstance.value) {
               await startPlay(supplierPlayerInstance, supplierSrc, '供應商', supplierLoadError);
           }
       }
  }
  console.log('[changeQuality] Finished quality change handling.');
}

// 檢查是否是自己的直播
const checkStreamOwnership = () => {
  const loginName = sessionStorage.getItem('loginName');
  isOwnStream.value = props.stream?.streamerName === loginName;
}

// 切換直播狀態
const toggleStreamStatus = async () => {
  let success = false;
  try {
    isStatusChanging.value = true
    const targetStatus = !isLiveStream.value

    await DashboardService.changeMyStreamStatus(props.stream.streamerStreamId, targetStatus)

    isLiveStream.value = targetStatus

    success = true;

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
    onHide();
    console.log('關閉視窗')

    if (success) {
      emit('reload')
      console.log('重新載入')
    }
  }
}

const initVideoPlayer = async () => {
  console.log('Stream prop received:', JSON.parse(JSON.stringify(props.stream)))
  isInitialized.value = true
  supplierLoadError.value = null
  streamerLoadError.value = null
  streamTitle.value = props.stream?.title || '直播'
  await nextTick()

  await initializePlayers()

  console.log('對話框顯示，初始化流程完成')
  checkStreamOwnership()
  checkStreamStatus()

  // 初始顯示時，如果 streamer URL 無效且預設選中 host，切換回 supplier
  if (currentPlayerType.value === 'host' && !streamerHasValidUrl.value) {
    currentPlayerType.value = 'supplier'
  }
}

const destroyVideoPlayer = () => {
  // 清理播放器
  const disposePlayer = (instanceRef) => {
    if (instanceRef.value) {
      try {
        console.log(`準備銷毀播放器: ${instanceRef.value.id()}`)
        instanceRef.value.dispose() // 使用 dispose 徹底清理
        instanceRef.value = null // 清空引用
      } catch (error) {
        console.warn('銷毀播放器時發生錯誤:', error)
      }
    }
  }
  disposePlayer(supplierPlayerInstance)
  disposePlayer(streamerPlayerInstance)
  isLoading.value = false
  isInitialized.value = false // *** 重置初始化狀態 ***
  console.log('對話框隱藏，播放器已銷毀')
}

// 關閉對話框
const onHide = () => {
  emit('update:visible', false)
}

watch(
  () => props.visible,
  async (newValue) => {
    if (newValue) {
      initVideoPlayer();
    } else {
      destroyVideoPlayer();
    }
  },
  { immediate: true },
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

const handlePlayerTypeChange = (newType) => {
  if (newType === 'host' && !streamerHasValidUrl.value) {
    console.warn("無法切換到主播播放器，因為 URL 無效");
    toast.add({ severity: 'warn', summary: '提示', detail: '主播流地址當前無效', life: 3000 });
    nextTick(() => {
      if (currentPlayerType.value === 'host') {
        currentPlayerType.value = 'supplier';
      }
    });
  } else {
    currentPlayerType.value = newType;

    destroyVideoPlayer();
    initVideoPlayer();
    return;

    if (newType === 'supplier' && supplierPlayerInstance.value) {
      startPlay(supplierPlayerInstance, props.stream?.supplierCdnPullUrl?.[currentQuality.value]?.hlsUrl, '供應商', supplierLoadError);
    } else if (newType === 'host' && streamerPlayerInstance.value) {
      startPlay(streamerPlayerInstance, props.stream?.streamerCdnPullUrl?.[currentQuality.value]?.hlsUrl, '主播', streamerLoadError);
    }
  }
}

watch(currentQuality, (newQuality) => {
  if (currentPlayerType.value === 'host' && !streamerHasValidUrl.value) {
    console.log("畫質切換後主播 URL 無效，自動切換回供應商播放器");
    currentPlayerType.value = 'supplier';
  }
});
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
